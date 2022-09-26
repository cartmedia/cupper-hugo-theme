---
title: Flat lists and Web views
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/7o0d4aix90
---

We have now covered all the basic components and APIs of React Native. You could in theory develop a fully-fledged app with that, but there are a few advanced components you will definitely need.

### FlatLists

So far we have built our app with a fairly simple list of items, however modern apps are expected to scale, handling large amounts of data. If you have a list with thousands of items you might see your app's performance degrade. One of the tools React Native provides to handle this is a [FlatList](https://reactnative.dev/docs/flatlist).

A `FlatList` is an optimized component to re-use and optimize memory when dealing with a large list of elements. Let's change our **Books** container to use it:

```tsx
// src/containers/Books.container.tsx

import {useNavigation} from '@react-navigation/core';
import {Button} from 'components';
import {useDynamicColor} from 'libs';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {useStore} from 'Store';
import {tw} from 'Tailwind';
import {IBook} from 'stores';

interface IProps {}

export const Books = observer((props: IProps) => {
  let root = useStore();
  let [title, setTitle] = useState('');
  const dc = useDynamicColor();
  const navigation = useNavigation();

  const inputBg = dc('bg-gray-800', 'bg-white');

  useEffect(() => {
    root.ui.fetchBooks();
  }, []);

  const renderBook = ({item}: ListRenderItemInfo<IBook>) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Book', {title: item.title})}>
        <View style={tw('py-1')}>
          <Text style={tw('text-sm')}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw('p-3 flex-1')}>
      <Text style={tw('font-bold')}>My favorite books</Text>
      <FlatList
        data={root.ui.books}
        renderItem={renderBook}
        keyExtractor={(book) => book.title}
        style={tw('flex-1')}
      />
      <Text style={tw('font-bold mt-6 mb-2')}>New book</Text>
      <View style={tw('flex-row')}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={tw(`flex-1 ${inputBg} rounded-l p-1`)}
          placeholder="Book tittle"
        />
        <Button title="Add" type="primary" twStyle="rounded-r" />
      </View>
    </View>
  );
});

```

You can see it's pretty straightforward to use. The FlatList requires the list of elements on which it will iterate, and we just need to tell it how to render each item by passing a `renderItem` function. The `renderItem` function returns more JSX and can contain logic on its own.  Since it is a virtualized list it also needs to extract a key for each element for internal reconciliation of the items - that is why we need a `keyExtractor` prop. In this case we simply use the book's title as its unique key.

You can also see we added a `style` prop with a `flex-1` property. You can read more about React Native flex layouts [here](https://reactnative.dev/docs/flexbox), but it basically tells the list to occupy all the available space. You will see on the app that our book list has been automatically converted into a scrollable container. If you need to use a pure scrollable container without virtualization you can use a `ScrollView` component.

### Adding an embedded web view

Our Book container is pretty boring, so we will liven it up a bit. I don't want to bore you with building a lot of UI (since you already know how to build awesome UIs), so we're going to do something a bit more fun. Every time the user clicks on a book, we'll show the latest google results for that title.

To do this we're going to add react-native-webview as a dependency of our project

```bash
yarn add react-native-webview
```

We will need to recompile our app (with `yarn macos`), and after it launches again we can replace the content of our **Book** container:

```tsx
// src/containers/Book.container.tsx
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import WebView from 'react-native-webview';
import { IRootStackParams } from 'Route';
import { tw } from 'Tailwind';

interface IProps {
  route: RouteProp<IRootStackParams, 'Book'>
}

export const BookContainer = ({route}: IProps) => {
  let {title} = route.params;

  return (
    <View style={tw('flex-1')}>
      <WebView source={{uri: `https://google.com/search?q=${title}`}}/>
    </View>
  );
};
```

We now need to import the `WebView` component from the `react-native-webview` package. You can see we have inserted a new `WebView` component in the body, where we simply pass a URL (placing our book title into a google search URL) and now if we go back to our app, we should be able to see google results directly from the app!

![Webview for our book](./public/BookContainer.png)

<!-- ### Closing words

You'll be able to find a lot of community libraries to help you add capabilities to your app. Do remember that not all the libraries support macOS, though support is being slowly (but surely) added.

This concludes the main portion of the JavaScript basics for React Native. There are many resources out there on pure React Native that you can look at, and if you're a macOS developer hopefully all this knowledge will save you time and effort,  and quickly allow you to jump-start your new app.

In the next module we're going to jump into macOS-specific functionality. This doesn't mean we will completely forget about JavaScript - on the contrary, we will be learning to call native code from the JavaScript side of our app. For React Native developers, this is where new knowledge lies. We will learn about native macOS APIs and how to take advantage of them, and for everyone learning this course we will learn how to develop our own React Native... err native... modules. -->