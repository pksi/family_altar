# How to Publish Family Alter

You can publish this web app easily using GitHub Pages, Netlify, or Vercel.

## Option 1: GitHub Pages (Recommended)
1.  Initialize a git repository if you haven't already:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Link your local repository to GitHub:
    ```bash
    git remote add origin https://github.com/<your-username>/<repository-name>.git
    ```
4.  Open `package.json` and add/update the `homepage` field:
    ```json
    "homepage": "https://<your-username>.github.io/<repository-name>"
    ```
5.  Deploy the app:
    ```bash
    npm run deploy
    ```

## Option 2: Netlify / Vercel (Drag & Drop)
1.  Run the build command:
    ```bash
    npm run build
    ```
2.  This generates a `dist` folder in your project directory.
3.  Go to [Netlify Drop](https://app.netlify.com/drop).
4.  Drag and drop the `dist` folder onto the page.
5.  Your site will be live instantly!

## Option 3: Firebase Hosting
1.  Install Firebase CLI: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Initialize: `firebase init`
4.  Deploy: `firebase deploy`
