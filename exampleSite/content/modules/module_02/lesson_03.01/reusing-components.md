---
title: Re-using components
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/lnltjj8kw7
---

So far, we have written one big UI React component, however it's important to talk about how these components help us divide and conquer the complex task that is creating UIs.

Components bring several benefits, and chief among them are the following:

## Behavior encapsulation

Each component is meant to represent a single chunk of our UI and because each component does not immediately share any global state (even if it is a direct children),  components can have an internal state. This means each component can also encapsulate a specific part of our app's logic.

Once you can encapsulate behavior, the most obvious use case is re-usability. You want to design your components in a way that makes them re-usable throughout your app. You also want to define the props each component will receive in a way that allows for customization without an exponential explosion in complexity.

## Creating a re-usable button

It will still be hard to grasp what shape a sensible API would take, just from a high-level description, so let's walk through an example. Let's say we want to create a re-usable button component for our app.

Before we write a single line of code, let's try to define certain requirements for our button:

1. It needs to have a style that fits our app, however there are many kinds of buttons (success, neutral, danger, etc.), so they should all be defined within a single component. 
2. It should maintain the same API as the default React Native Button component - it has many useful properties and we don't want to re-invent the wheel here. 
3. We should still be able to customize it a bit for those one-off cases where it needs to be slightly different than the rest of the buttons in the app.

```tsx
// src/components/button.component.tsx
import React from 'react';
import {View, Text, StyleProp, TouchableOpacityProps, TouchableOpacity, ViewProps} from 'react-native';
import { tw } from 'Tailwind';

interface IProps extends TouchableOpacityProps {
  title: string;
  type?: 'primary' | 'secondary'
  style?: StyleProp<ViewProps>;
}

export const Button = ({title, style, type, ...props}: IProps) => {

  return (
    <TouchableOpacity {...props} >
      <View style={[tw(styles[type]), style]}>
        <Text style={tw('text-white')}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  primary: `bg-cyan p-3 w-24 items-center`,
  secondary: `bg-blue-500 p-3 w-24 items-center`
}
```

Here is a sample implementation of such a button. Let's skip the imports for now - first look at the props interface declaration. This time we are extending the `TouchableOpacityProps` type (imported from react-native itself) which ensures that we can pass all the props defined within that type. This takes care of requirement 2.

However we can still add new props to our component, for example a `title` prop. More interesting though is the `type` prop, which allows the button to change its theme based on pre-defined styles. This takes care of requirement 1.

Even then, we still allow for a `style` component to be passed if necessary (the `?` character after the variable makes the variable/prop optional), to allow for direct customization of our button. This takes care of requirement 3.

In the body of our component, we extract our custom properties, while the rest we can put in a single `props` variable. The body of our button simply consists of a `TouchableOpacity` (a component that allows for click/press interactions) wrapping a `View` and a `Text` to hold the actual UI of the button.

## Component API is more art than science

You might have a different opinion about which props the component should receive, and that is alright! To be honest with you, defining the borders/responsibilities of components is really hard, and you will rarely get it right on the first try. Some components will be too large or too complex meaning you have to break them down further, and some will excessively depend on the props passed from the parent, in which case you might want to abstract their state.

There are however some rules of thumb that can help you keep the complexity of your components down.

### Avoid excessive prop passing

If your component needs 20 props to work properly it's probably not well designed. You should in general try to keep the number of props low and/or simple. Try not to pass entire objects, but some reference that will allow you to retrieve objects from your global MobX state (for example pass an `id` instead of the entire object).

### Avoid excessive nested prop passing

Sometimes a child component might need a prop from the parent of the parent component, and you generally want to avoid this. The problem is that with time you may acquire even more components in between, meaning you have to update multiple files every time you change your component props. Instead, move the state into a MobX store so you can directly access it from the child.

### Names, names, names

Like any other branch of programming, coming up with sensible naming schemes for your props is going to be the hardest problem. My recommendation is to stick as much as possible to naming as per the default React Native (eg `onPress`, `style`, etc). With time you will forget any custom or complex names and it will be easier to assume they all have a common naming scheme.

At the end of the day, the most sensible API for your components is the one that makes sense to you (and your app). With time you will arrive at a preferred way to create your components. Just try to keep it simple and consistent.