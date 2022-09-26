---
title: Setting up navigation
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/l8ltrcg5ce
---

So far our app is pretty functional, but contains only one screen, so we will now set up multiple screens via [React Navigation](https://reactnavigation.org). There are a couple of React Native libraries for navigation but here we find ourselves limited: in order to keep the screens performant the navigation implementation must be written in native code. (As a matter of fact, React Navigation just added support for macOS some months ago.)

It's not perfect - for example animations are not supported - so unlike the iOS and Android counterparts, our app won't be that pretty. However I expect the situation to improve with time.

### Installing React Navigation

In order to get React Navigation working we will need to add some dependencies to our project:

```bash
yarn add @react-navigation/native @react-navigation/stack react-native-safe-area-context react-native-screens
```

Now this is the first time we've come across a JavaScript dependency that has a native dependency/code (namely react-native-screens). This means we need to link the native libraries, which is not as straightforward as pure JavaScript dependencies, although luckily the process has gotten a lot easier in the last year or so, thanks to CocoaPods.

After adding our dependencies, navigate to the macOS folder and do a `pod install`.

```bash
cd macos && pod install
--- OR use our custom command---
yarn macos:install 
```

You will see CocoaPods will link any new JavaScript dependency that has declared a native code dependency itself. Since this is a change on the native side we will also need to recompile our app:

```bash
yarn macos
```

Sometimes you might face some issues such as the packager having cached outdated files, and in this case the best you can do is kill the packager and start it again (it will have opened in a new terminal window, and you can just close it). If that still does not solve your problem, running our helper command `yarn nuke` and compiling the app again should clear any outdated caches.

### Setting up a router

Navigation in React Native is based on navigators. We have installed a stack navigator but there are others like a bottom tab navigator or a side menu navigator (not all might support macOS). You can compose these navigators as you see fit for your app.

We will start by setting up a simple stack navigator, just to get your foot in the door.

In the `src` folder create a `Routes.tsx` file.  In  previous lessons we abstracted our Books into a `container` component, in this **Routes** file, this is where we will use our containers. As a rule of thumb, only containers should be registered as the navigable routes.

```tsx
// src/Routes.tsx

import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { useDynamicColor } from 'libs/hooks';
import { tw } from 'Tailwind';
import { Books, Book } from 'containers';

export type IRootStackParams = {
  Home: undefined,
  Book: {title: string}
}

let RootStack = createStackNavigator<IRootStackParams>();

export let Routes = () => {
  let dynamic = useDynamicColor();

  let headerTintColor = dynamic('bg-gray-900', 'bg-gray-200')

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: [
          tw(headerTintColor)
        ]
      }}
    >
      <RootStack.Screen
        name="Home"
        component={Books}
        options={{
          headerShown: false
        }}
      />
      <RootStack.Screen
        name="Book"
        component={Book}
      />
    </RootStack.Navigator>
  )
}
```

Besides importing React, we will import the `createStackNavigator` function from react-navigation. We will also import our styling functions to customize the header element of the navigation (react-navigation/stacks inserts headers by default on the screens).

You can see we have created a `RootStack`. This will be the root stack navigator of our app, but you could switch this with any other navigator (react-navigation offers a [variety of them](https://reactnavigation.org/docs/nesting-navigators/)). A Stack navigator simply will stack the screens so you can navigate backwards by popping elements off the stack. 

Then we create a `Routes` component which will actually hold all the routes. 

We use the same dynamic color generation as we did in the previous lesson to create a color for the header. 

On the return of the function we create the outermost component with the `RootStack.Navigator` element, and we pass a `screenOptions` prop with a `headerStyle` property to customize the color of the header. 

Inside of this component we finally declare our routes - one will be the "home" route (our Books container we have been working with in the previous lessons) and a new `Book` route that will be a new container for displaying a single book. On the home route, we pass an `options` object with a `headerShown` flag to hide the header on this specific route.

You can see we have also declared a `IRootStackParams` type. If you are familiar with web development, the way you usually pass information between screens is via URL params. In React Native we don't have any URL field, so to navigate between screens you need to send the next screen the information it needs to do its job. React Navigation has opted for this strongly-typed approach to make sure the correct information is being sent to the appropriate screen.

At the top of the file we imported a `Book` container, but we didn't create it. We will use a placeholder implementation for now:

```tsx
// src/container/Book.container

import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { IRootStackParams } from 'Route';
import { tw } from 'Tailwind';

interface IProps {
  route: RouteProp<IRootStackParams, 'Book'>
}

export const BookContainer = ({route}: IProps) => {
  let {title} = route.params;

  return (
    <View style={tw('flex-1')}>
      <Text>{title}</Text>
    </View>
  );
};
```

The code should be familiar to you by now, with one exception - here you can see the type safety in action, using the `IRootStackParams` type we declared before. For the first time our React component will take a custom prop, and since this component is registered as a navigable route (on our Routes file), it automatically gets certain props passed to it. One of them is the `route` object - this object contains any parameters you want to send to this component from any other component you navigate from. In this case the component needs a book `title` to work, we simply pluck it from the route object `params` property.

Now it's time to finally put the navigation into place in our app. In our main `App.tsx` file, we will mount our RootStack:

```tsx
import React from 'react';
import {Routes} from 'Route';
import {root, StoreProvider} from 'Store';
import {NavigationContainer} from '@react-navigation/native';

export const App = () => {
  return (
    <StoreProvider value={root}>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </StoreProvider>
  );
};
```

We import the `Routes` component from the `Route` file, and we also need to import the `NavigationContainer` from react-navigation. Inside of our `StoreProvider` we replace the content with the `NavigationContainer` (this component needs to wrap all the navigable components) and inside of it we put our `Routes` component. The `NavigationContainer` takes care of mounting, un-mounting and keeping track of the navigation state of the app for us.

### Navigating between containers

So now that everything is mounted, we are only missing one piece - navigating between containers! Let's update our **Books** container (not to be confused with Book container!) to include links to each entry of our favorite books:

```tsx
// src/containers/Books.container.tsx

import { useDynamic } from 'libs/hooks'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { useStore } from 'Store'
import { tw } from 'Tailwind'
import { Button } from 'components/Button.component'
import { useNavigation } from '@react-navigation/native'

interface IProps {}

export const BooksContainer = observer((props: IProps) => {
  // Do not spread the store, otherwise you lose reactivity
  let root = useStore()
  let dynamic = useDynamic()
  let navigation = useNavigation()

  useEffect(() => {
    root.ui.fetchBooks()
  }, [])

  let backgroundColor = dynamic('bg-gray-900', 'bg-white')

  return (
    <View style={tw(`p-4 ${backgroundColor} flex-1`)}>
      {root.ui.uppercasedBooks.map((book) => (
        <TouchableOpacity key={book} onPress={() => navigation.navigate('Book', {title: book})}>
          <View style={tw('p-2')}>
            <Text>{book}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Button title="Add button" onPress={() => root.ui.addBook('Test')} style={tw('self-center')}/>
    </View>
  )
})
```

You can see we have added a `TouchableOpacity` component, wrapping each entry in the book list. You can pretty much wrap any component if you want to make it interactive.

Now in order to navigate between screens, we will need the `useNavigation` hook. The navigation object contains all the methods you need to navigate between screens (eg you can go back with the `goBack` function). You can read more about it in the [documentation](https://reactnavigation.org/docs/navigating).

For now on, for each element we iterate in our screen, we will attach a callback function which will navigate to the `Book` route we created before, and pass the title of our book as the param.

Now, if we go to our app, we should be able to navigate to the specific container for our books. You can also see that React Navigation has taken care of setting up a header for us. You can disable this header or customize it however you want, and since it is a React component we can even use our very own `useDynamicColor` hook, to make it responsive to theme changes! Pretty cool huh?

In the next lesson we will transform our simple list of books into a FlatList, which is an optimized list for displaying a large number of items, and we will also integrate a web view into our web app to make it a little more useful.
