---
title: Customizing the UI theme
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/mmlag5f7e1
---

In the previous lesson we used the base version of a React Native port of Tailwind, but we did not customize it in any way. However, if you are developing your own app, you will definitely want to use your own colors, font sizes and margins. We're going to achieve this by extending the base Tailwind configuration and auto-generating the custom classes.

In the root of your project create a `tailwind.config.js` file - here is a template you can use:

```js
// tailwind.config.js
module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#04bf9b'
        },
        tangerine: {
          DEFAULT: '#fc9010'
        },
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

:::note
You can also initialize an empty configuration by running `npx tailwindcss init`.
:::

You can read more about setting up variables in the [Tailwind documentation](https://tailwindcss.com/docs/theme). For now we will only add a set of colors but the potential for customization is large - you can change scales, margins, font-sizes, etc. Now it's important to note that *not all the configuration items will work*, since this is a port that needs to function with the React Native styling system, so always check out the [tailwind-rn](https://github.com/vadimdemedes/tailwind-rn) repo.

With our configuration in place we can now generate the classes for tailwind-rn to consume. Run the following command in your terminal:

```bash
npx create-tailwind-rn
```

This will create a `styles.json` file containing not only the default Tailwind style classes but also our customized classes.

### Loading our customized styles into React Native

Now before we start using them, we need to load them. We'll create a convenience wrapper around tailwind-rn. Create a `Tailwind.ts` file in the `src` folder:

```ts
// src/Tailwind.ts

import { create } from 'tailwind-rn';
import styles from '../styles.json';

const { tailwind, getColor } = create(styles);

export const tw = tailwind
export const twColor = getColor
```

We start by importing the `create` function from `tailwind-rn`. This function takes the generated styles we created before and will return an object with two properties and a customized `tw` function that works with our extended styles. It will also return a `getColor` function which is useful to get our custom colors from the Tailwind configuration. We simply take these properties and export them under new names to make it easier to import into other files.

We can now replace the default import from `tailwind-rn` to our wrapper and use our custom classes:


```ts
// src/containers/Books.container

import { tw } from 'Tailwind'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import {View, Text, Button, TextInput} from 'react-native'
import { useStore } from 'Store'

interface IProps {}

export const BookListContainer = observer((props: IProps) => {
  let root = useStore()
  let [title, setTitle] = useState('')

  useEffect(() => {
    root.ui.fetchBooks()
  }, [])

  return (
    <View style={tw('p-3')}>
      {root.ui.uppercasedBooks.map((book) => (
        <View key={book} style={tw('py-1')}>
          <Text style={tw('font-bold')}>{book.title}</Text>
          <Text style={tw('text-sm')}>{book.createdAt}</Text>
        </View>
      ))}

      <TextInput 
        value={title} 
        onChangeText={setTitle} 
        style={tw('rounded bg-gray-200')}
      />
      <Button 
        title="Add" 
        onPress={() => root.ui.addBook(title)}
        style={tw('bg-tangerine text-white justify-center p-3')} // Here we change the theme to our custom color
      />
    </View>
  )
})
```

We need to change the first import of our file. Instead of importing the default function from `tailwind-rn` we now import the `tw` function from our custom `Tailwind` module. We use the tangerine color as a background via the `bg-tangerine` class for our button. Besides the `bg-tangerine` style, other styles are also automatically created, for example a `text-tangerine` style.

### Adding dark theme support

Now, there is one more thing we need to take care of. Recently all of Apple's OSs have received support for dark themes - if you switch your OS to the light or dark theme you will see that the text automatically changes color (along with the background of the app if you haven't set any). However the moment we define our own styles, for example, setting a fixed background color, it won't automatically switch to the opposite color, yet the text will, which might lead to invisible or hard to read text. If you tried to send your app to Apple to review like this, it would be promptly rejected.

So you can either support dark themes via dynamic colors or just set fixed colors for your app, so the setting is ignored. We will add dynamic theme support with a small utility provided by React Native and our first custom hook!

Let's create a `libs` folder and inside create a `hooks.ts` file:

```ts
// src/libs/hooks

import { useColorScheme } from "react-native"

export function useDynamicColor() {
  let theme = useColorScheme()

  return (darkThemeValue: string, lightThemeValue: string) => theme === 'dark' ? darkThemeValue : lightThemeValue
}

```

:::tip
Don't forget to create an `index.ts` file (following our [exporting architecture](module-resolution)) in the `libs` folder and export everything from our hooks file, so we can use it in our other components/modules.
:::

Creating custom hooks is pretty straightforward. They are just functions that use the basic hooks exported by React (or React Native). 

To add dynamic color support we will import the `useColorScheme` hook from React Native itself. 

Afterwards we create and export a `useDynamicColor` function. Internally this function calls the `useColorScheme` hook, which returns the current theme the OS is running, either `light` or `dark`. 

Once we have the theme value we can return a function that takes two Tailwind string values and using a ternary operator returns either the value for the dark theme or the light theme.

This hook will automatically run itself every time the OS changes the color setting, allowing for automatic re-rendering of your styles. Let's try it in our Books container:

```tsx
// src/containers/Books.container

import { tw } from 'Tailwind'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import {View, Text, Button, TextInput} from 'react-native'
import { useStore } from 'Store'
import { useDynamicColor } from 'libs'

interface IProps {}

export const BookListContainer = observer((props: IProps) => {
  let root = useStore()
  let [title, setTitle] = useState('')
  let dynamicColor = useDynamicColor()

  let bgColor = dynamicColor('bg-gray-900', 'bg-white') // We will create a new dynamic color for our background

  useEffect(() => {
    root.ui.fetchBooks()
  }, [])

  return (
    /*Here we see how this plays nicely with tailwind style strings*/
    <View style={tw(`p-3 ${bgColor}`)}>
      {root.ui.uppercasedBooks.map((book) => (
        <View key={book} style={tw('py-1')}>
          <Text style={tw('font-bold')}>{book.title}</Text>
          <Text style={tw('text-sm')}>{book.createdAt}</Text>
        </View>
      ))}

      <TextInput 
        value={title} 
        onChangeText={setTitle} 
        style={tw('rounded bg-gray-200')}
      />
      <Button 
        title="Add button" 
        onPress={() => root.ui.addBook(title)}
        style={tw('bg-orange text-white justify-center p-3')} // Here we change the theme to our custom color
      />
    </View>
  )
})
```

We import our `useDynamicColor` hook from the `libs` library, then in the body of our component we create a dynamic color for the background of the app. To apply this style we modify the outermost View style; we change the value passed to the `tw` function, and instead of passing a simple string, we will use a string template. String templates are just syntactic sugar for manipulating strings with dynamic values. Just changes the single quotes (') to backticks (\`) and then we can pass our `bgColor` variable (encased with the `${}` notation).

And that's it! If you now try to change your OS theme, you should see how the colors automatically switch. Our app now has a solid styling system which also supports dynamic themes.

As your app grows, you might want to define a fixed set of styles for your most common components, but for rapid development and prototyping this Tailwind system allows for incredible speed.