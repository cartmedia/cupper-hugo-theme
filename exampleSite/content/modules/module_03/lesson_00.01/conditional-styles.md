---
title: Conditional styles
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/pnwargacef
---

Before we move on, there are still a couple more ways we can make our app styles more concise. So far we have created our own hook for supporting the OS theme, but as your app grows you will want to change the style of your components based on other flags. Using string templates can become burdensome once you have more variables, for example:

```tsx
<View style={tw(`p-3 ${isHovered ? `bg-blue-500` : `bg-green-500`} ${isSelected? `font-bold`: `font-regular` }`)}>
```

## Classnames utility

[Classnames](https://github.com/JedWatson/classnames) is a small JavaScript utility that plays nicely with Tailwind. It allows us to define our styles strings in an object and then, based on a boolean value, it concatenates them into a single class string. Let's start by adding it into our project.

```bash
yarn add classnames
```

We can start using it right away. Let's modify our Books container to use `classnames` instead of our custom hook, just as an example.

```tsx
// src/containers/Book.container

import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {IRootStackParams} from 'Routes';
import {tw} from 'Tailwind';
import cn from 'classnames';

interface IProps {
  route: RouteProp<IRootStackParams, 'Book'>;
}

export const Book = ({route}: IProps) => {
  let {title} = route.params;

  return (
    <View style={tw('flex-1')}>
      <Text
        style={tw(
          cn('p-3 text-xl', {
            'text-red-500 font-bold': title.includes('Lord'),
            'text-green-500': !title.includes('Lord'),
          }),
        )}>
        {title}
      </Text>
    </View>
  );
};

```

Although it might seem more verbose to start with, once you have more conditional styling to apply it might be worth it to stick to the `classnames` package.

## Combining our tw function with classnames

You can see that our `tw` function will always be paired with a `cn` call. In order to reduce the verbosity even further we can combine them into a single function. In our Tailwind module file:

```ts
// src/Tailwind.ts

import { create } from 'tailwind-rn';
import cn from 'classnames';
import styles from '../styles.json';

const { tailwind, getColor } = create(styles);

export const tw = tailwind
export const twColor = getColor
// not worrying to much about types here, but you could try to match/extract the types from the cn function
export const cw = (...args: any[]) => tw(cn(...args))
```

Then in our component we can simply use it as:

```tsx
// src/containers/Book.container
import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {IRootStackParams} from 'Routes';
import {cw} from 'Tailwind';

interface IProps {
  route: RouteProp<IRootStackParams, 'Book'>;
}

export const Book = ({route}: IProps) => {
  let {title} = route.params;

  return (
    <View style={cw('flex-1')}>
      <Text
        style={cw('p-3 text-xl', {
          'text-red-500 font-bold': title.includes('Lord'),
          'text-green-500': !title.includes('Lord'),
        })}>
        {title}
      </Text>
    </View>
  );
};


:::tip
You can reduce the verbosity of your components even further by wrapping the default `View`, `Text`, etc. components and modify the `style` prop to be able to take strings directly (and internally call the `tw`/`cw` function). Even though it might seem inefficient, I have used this technique in the past with good results as it allows you to globally control how your components are rendered.
:::