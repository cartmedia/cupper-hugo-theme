---
title: Creating a new app
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/fuu54a38u8
---

### Requirements

To finish this first module, we are going to make sure you have everything ready to start developing your app and we'll do that by creating a clean React-Native-macOS app.

First you will need some tools installed in your machine:

- Install [**Homebrew**](https://brew.sh), which will allow you to install a lot of native packages in a straightforward manner. You can install it by using the one-liner provided in their website.
- **XCode** which you can download from the app store. Download it, open it and accept whatever terms of use you need to accept.
- **NodeJS** - I recommend you install [**Volta**](https://volta.sh) or [**NVM**](https://github.com/nvm-sh/nvm) to simplify installing and managing different versions. Once you have Volta installed you can install Node by simply running `volta install node@14` on your terminal or `nvm install v14`. (M1 macs seem to have extra trouble when picking up the node binary and other tools like Ruby, I would recommend you go with nvm if you are using one).
- You will need to make sure you have a working **Ruby** installation. This comes with macOS by default - run `ruby --version` on your terminal to check if it's installed already. If it's missing or you have any problems with it, try to (re)install with Homebrew by running `brew install ruby`.
- You will need an editor for your code. Native developers may be used to using XCode itself, but XCode is a poor tool for development in general so I recommend what has become the standard in the JavaScript world by now: [**VSCode**](https://code.visualstudio.com), which you can easily install via Homebrew: `brew install --cask visual-studio-code`.

:::important
If you have installed node via volta or NVM, Xcode might have some trouble picking up your node binary you will need to add `$VOLTA_HOME/bin` to your systems **$PATH** variable.
:::

:::important
M1 macs also seem to have some trouble with ruby/cocoapods, you might want to re-install ruby via homebrew and then re-install cocoapods, that might solve your issue. Another possible solution is running CocoaPods in emulation mode; instead of running `pod install` you should run `arch x86_64 pod install`. This will download/install Rosetta in your mac and run the installation process as if on a Intel based machine.
:::

### Extra dependencies

Once you have all of the above installed, we still a few more components to compile a react-native app:

- **Yarn** is the package manager we will use for our JavaScript dependencies. Install it with Volta by typing `volta install yarn` in your terminal. You can add a dependency via the `yarn add [library name]` command from your terminal.
- **CocoaPods** is the package manager we will use for our native macOS dependencies (we'll also use Swift Packages but we'll cover that in a later lesson). Install it by running `sudo gem install cocoapods`.
- **Watchman** is a file system that React Native depends upon. Install it by running `brew install watchman`

### Initializing a new app

We are now set to go, but let me just remind you to always check the [official site for React-Native-macOS and Windows](https://microsoft.github.io/react-native-windows/docs/0.62/rnm-getting-started). With time the installation process might have changed, so always check for the latest instructions.

1. Start by creating a blank react-native app

```bash
npx react-native init [YOUR PROJECT NAME GOES HERE] --version 0.63.4
```

:::important
It is important that the `react-native` version matches the `react-native-macos` version you are using, otherwise things might not work as expected. As of this writing the latest version is 0.63.4.
:::

2. Navigate into the directory:

```bash
cd projectName
```

3. Run the react-native-macos installer command. This may take a while to complete as the script downloads all the dependencies and Cocoapods downloads the native dependencies:

```bash
npx react-native-macos-init
```

4. After that has finished you should be able to run the project. This may also take some time as it needs to compile all the native code necessary to run your app:

```bash
npx react-native run-macos
```

![Running app](./public/workingApp.png)

5. Did it run?! Awesome! You can now open your folder and modify the `App.js` file in the root directory. If you save the file, React Native should immediately detect the change and update your app.  **MIND = BLOWN** 🤯 right? Who knew developing native apps was so easy?! A quick note: besides your app, you should have seen a new terminal window open. This window contains **Metro**, the JavaScript packager that React Native uses. Don't close it, or your app will stop functioning. In case you want to close the app you can do so via keyboard shortcut (Cmd + Q).

### Going a step further

So, we could call it a day here and just jump to our next module, but the objective is to provide you with a real-world tool set, so we are going to set up a few useful commands and libraries to make developing your app a breeze.

1. We will start by adding some convenience commands to automate short tasks common for developing React Native apps. In your `package.json` file add the following lines to the `scripts` section:

```json
"macos": "react-native-macos run-macos",
"macos:install": "cd macos && pod install",
"nuke": "watchman watch-del-all && rm -rf $TMPDIR/react-* && rm -rf node_modules/ && yarn && yarn start --reset-cache",
```

:::important
The "scripts" section of your package.json are commands callable by yarn (e.g. `yarn macos`), the benefit is that they can run the javascript libraries installed in your project. In our case the `macos` command will run our app, `macos:install` is a shortcut for installing native dependencies via CocoaPods and `nuke` will clear any caches which sometimes cause issues.
:::

2. We are going to set up [Typescript](https://www.typescriptlang.org) which will allow us to have types, auto-completion, code navigation and a lot of other goodies. React Native ships with flow support (another type-safe system) by default but **Typescript** is just better. Start by adding it as a dependency in your project via `yarn add --dev typescript`, then in the root directory create a `tsconfig.json` file, which declares how TypeScript behaves. You can dig deeper on your own, but here is a template you can just copy and paste for now:

```json
{
  "compilerOptions": {
    /* Basic Options */
    "target": "ESNEXT",                       /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    "lib": [
      "ES2020"
    ],                                        /* Specify library files to be included in the compilation. */
    // "allowJs": false,                      /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    "jsx": "react-native",                    /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    "rootDir": "./src",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    "removeComments": true,                   /* Do not emit comments to output. */
    "noEmit": true,                           /* Do not emit outputs. */
    // "incremental": true,                   /* Enable incremental compilation */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    "moduleResolution": "node",               /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    "baseUrl": "./src",                       /* Base directory to resolve non-absolute module names. */
    // "paths": { },                          /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": ["jest"],                     /* Type declaration files to be included in compilation. */
    "allowSyntheticDefaultImports": true,     /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */

    /* Source Map Options */
    // "sourceRoot": "./",                    /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "./",                       /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
    "useDefineForClassFields": true,          /* required for mobx 6*/
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "exclude": [
    "node_modules", "babel.config.js", "metro.config.js", "jest.config.js"
  ]
}
```

:::note
You can see TypeScript has a lot of flags that will change how the language behaves. I have just chosen some sensible defaults, along with some others that are required for the code in the course to work, so please make sure to copy it as is. Some libraries come with TypeScript typings, some don't, and some have support via third parties. If a library you have chosen does not seem to have types, you can try to install third-party typings via `yarn add --dev @types/\[name-of-the-library]`. Not all of the libraries have types, but a lot do.
:::

3. Now we are going to replace our main JavaScript app code with Typescript.  Create a `src` folder in the root directory and a new `App.tsx` file inside of it, and fill it with a basic component for now:

```tsx
// src/App.tsx

import React from 'react';
import { View, Text } from 'react-native';

interface IProps {}

export const App = (props: IProps) => {
  return (
    <View>
      <Text>Hello from typescript</Text>
    </View>
  )
}
```

4. If you are using visual studio code or any other editor with typescript support, you might notice that both imports are throwing errors. This is because Typescript doesn't know the types for 'react' and 'react-native'. In order to fix this we need to add the types of both libraries into our dependencies, in your terminal:

```bash
yarn add --dev @types/react @types/react-native
```

5. Next, in the `index.js` file in the root directory, change the App import from './App' to './src/App'
```js
import {AppRegistry} from 'react-native';
import {App} from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

5. It is that easy! 🎉

### Ready, set, go!

That's it! With all of that out of the way we can start developing our app for real. In the next module we will start with the JavaScript side of things: managing state, using Tailwind as a UI framework, making HTTP requests and setting up a scalable file structure.