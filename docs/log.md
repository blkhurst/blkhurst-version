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
{
  "compilerOptions": {
    /* Base */
    "target": "ES2022",
    "esModuleInterop": true,
    "skipLibCheck": true,

    /* Strictness */
    "strict": true,

    /* TypeScript */
    "outDir": "dist",
    "module": "NodeNext",
    "sourceMap": true,
    "declaration": true,

    "lib": ["ES2022"]
  },
  "include": ["src/**/*"]
}

```
```json
// package.json
{
  "main": "./dist/index.js",
  "bin": "./dist/bin/blkhurst-version.js",
  "type": "module",
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
- `"type": "module"`: Tells Node.js that all `.js` files use ES Module syntax unless otherwise specified.