# Odin Template

A modern JavaScript project template for [The Odin Project](https://www.theodinproject.com/) curriculum.

## Features

- **Webpack** - with separate dev/prod configurations
- **Asset Management** - Image and font loading configured for Webpack
- **ESLint** - with flat config
- **Prettier** - with pre-commit hooks (Husky & lint-staged)
- **Jest** - with Babel support
- **CSS Reset**

## Getting Started

1. Click "Use this template" on GitHub or clone the repository
2. Update project metadata:
   - Change `name` and `description` in `package.json`
   - Update `<title>` in `src/template.html`
   - Update repository URL in `package.json`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm start
   ```

## Project Structure

```
├── src/
│   ├── styles/
│   │   ├── reset.css      # CSS reset for consistency
│   │   └── styles.css     # Your styles here
│   ├── index.js           # Application entry point
│   └── template.html      # HTML template
├── tests/                 # Jest test files
├── dist/                  # Built files (git-ignored)
├── webpack.common.js      # Shared webpack config
├── webpack.dev.js         # Development config
├── webpack.prod.js        # Production config
└── eslint.config.mjs      # ESLint flat config
```

## Available Scripts

- `npm start` - Start development server with live reload
- `npm run build` - Build for production to `dist/` folder
- `npm test` - Run Jest tests
- `npm run deploy` - Build and deploy to GitHub Pages (requires gh-pages package)

## GitHub Pages Deployment

### First Deployment

When you're ready to deploy your project:

1. Push your repository to GitHub if you haven't already
2. Run `npm run deploy` - this creates the gh-pages branch and deploys
3. Go to Settings → Pages in your GitHub repo
4. Set source to "Deploy from a branch" and select "gh-pages"
5. Your site will be live at `https://[username].github.io/[repo-name]/`

### Updating Your Site

After initial setup, deploy updates anytime with:

```bash
npm run deploy
```

This automatically builds and deploys your project. The predeploy script runs `npm run build` before deploying.
