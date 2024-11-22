## Creating an NPM Package with TypeScript

### 1 - Initialise the Project
```bash
npm init
```

### 2 - Install TypeScript
```bash
npm install typescript @types/node --save-dev
npx tsc --init
```

### 3 - Configure the Build Process
```json
// tsconfig.json
"rootDir": "./",
"outDir": "./dist",
```
```json
// package.json
{
  "main": "./dist/src/index.js",
  "bin": "./dist/src/bin/blkhurst-version.js",
  "scripts": {
    "build": "tsc -p ."
    ...
  },
  "files": [
    "dist/**/*"
  ],
  ...
}
```
<!--! "types": "dist/index.d.ts", -->