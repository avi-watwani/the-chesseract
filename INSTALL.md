# Installation Guide

This document explains how to set up and install The Chesseract project.

## Prerequisites

Make sure you have the following installed:
- Node.js (v14 or later)
- npm or yarn

## Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/chesseract.git
cd chesseract
```

## Step 2: Install dependencies

```bash
npm install
# or
yarn install
```

This will install all the required dependencies, including:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React (for icons)

## Step 3: Resolving TypeScript errors

The project has TypeScript set up, which provides type checking. You might see some linter errors in your code editor related to missing type definitions.

To resolve these errors, install the following type definitions:

```bash
npm install --save-dev @types/react @types/react-dom @types/node
# or
yarn add --dev @types/react @types/react-dom @types/node
```

Make sure the installed versions are compatible with your dependencies in package.json.

## Step 4: Start the development server

```bash
npm run dev
# or
yarn dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

## Step 5: Build for production

When you're ready to deploy your project:

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## Troubleshooting

### Linter errors

If you're still seeing TypeScript/linter errors after installation:

1. Make sure your `node_modules` has been properly installed
2. Try deleting the `.next` folder and running `npm run dev` again
3. Check that your `tsconfig.json` is properly set up
4. Make sure you have the correct versions of all dependencies

### CSS issues

If you're experiencing CSS problems:

1. Ensure Tailwind CSS is properly installed and configured
2. Make sure `globals.css` is imported in your `layout.tsx` file
3. Check that PostCSS is configured correctly in `postcss.config.js`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs) 