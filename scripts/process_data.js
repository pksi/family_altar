import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DATA_DIR = path.join(__dirname, '../raw_data');
const OUT_DIR = path.join(__dirname, '../src/data');

// Helper to parse simple CSV
function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].trim().split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        // Handle basic comma splitting, assuming no commas in values for now based on inspection
        // If values had commas they would need quote handling, but the provided files are simple.
        const values = line.trim().split(',');
        const entry = {};
        headers.forEach((header, index) => {
            // Rejoin if split too much (e.g. if URL had a comma, though unlikely here)
            // Actually, for Music URL, let's be careful.
            // But since we know the structure: Name, Music URL, Order
            // We can just take the first, the last, and join the middle?
            // "Name,URL,Order" -> 3 parts.
            // If URL has comma, it might be split.
            // But inspection showed no commas in URLs.

            entry[header] = values[index] ? values[index].trim() : '';
        });
        return entry;
    });
}

// worship_music.csv
try {
    const musicCsv = fs.readFileSync(path.join(RAW_DATA_DIR, 'worship_music.csv'), 'utf-8');
    const musicLines = musicCsv.trim().split('\n');
    // Header: Name,Music URL,Order
    const musicData = musicLines.slice(1).map(line => {
        const parts = line.trim().split(',');
        // Be safe about potential commas in URL? 
        // Name is parts[0]
        // Order is parts[parts.length-1]
        // URL is the rest joined
        const name = parts[0];
        const order = parts[parts.length - 1];
        const url = parts.slice(1, parts.length - 1).join(',');
        return {
            name: name,
            url: url,
            order: parseInt(order) || 0
        };
    });

    fs.writeFileSync(path.join(OUT_DIR, 'worship_music.json'), JSON.stringify(musicData, null, 2));
    console.log('Converted worship_music.csv to worship_music.json');
} catch (err) {
    console.error('Error processing worship_music.csv:', err);
}

// beginners_bible_table_of_contents.csv
try {
    const bibleCsv = fs.readFileSync(path.join(RAW_DATA_DIR, 'beginners_bible_table_of_contents.csv'), 'utf-8');
    const bibleLines = bibleCsv.trim().split('\n');
    // Header: Number,Title
    const bibleData = bibleLines.slice(1).map(line => {
        // Assuming format: Number,Title
        // Title might have commas? "The sneaky snake", "Noah's Ark".
        // Let's check for commas in titles.
        // "Jacob and Esau meet again", "Joseph's colorful robe".
        // No commas seen in the provided snippet.
        // But to be safe: Number is first part, Title is rest.
        const parts = line.trim().split(',');
        const number = parts[0];
        const title = parts.slice(1).join(',');

        return {
            number: parseInt(number),
            title: title.trim()
        };
    }).filter(item => item.number && item.title); // Filter empty lines

    fs.writeFileSync(path.join(OUT_DIR, 'bible_stories.json'), JSON.stringify(bibleData, null, 2));
    console.log('Converted beginners_bible_table_of_contents.csv to bible_stories.json');
} catch (err) {
    console.error('Error processing beginners_bible_table_of_contents.csv:', err);
}
