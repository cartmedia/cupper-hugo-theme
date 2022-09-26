---
title: Creating an api store
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/g4jjma4t8g
---

### HTTP layer

We will start connecting our app to our server to persist and retrieve data. In React Native you can now use the `fetch` interface to do HTTP requests. This comes already integrated, but some devices have problems with it, and the API is slightly awkward.

We'll go with a better alternative, the [Axios](https://github.com/axios/axios) HTTP client library. Its API is a bit easier to use and it never fails, so let's start by adding it as a dependency into our project.

```bash
yarn add axios
```

Next we will create a new store in the `stores` folder. Go ahead and create an `Api.store.ts` file, with the following content:

```ts
// src/stores/Api.store.ts

import axios from 'axios';
import {IRootStore} from 'Store';

export let createApiStore = (root: IRootStore) => {
  let store = {
    fetchBooks: async () => {
      const res = await axios.get('http://localhost:3000/book')

      return res.data
    },
    addBook: async (title: string) => {
      try {
        const res = await axios.post(
          'http://localhost:3000/book', 
          {title}
        )
  
        return res.data
      } catch(e) {
        console.warn(`error creating book`, e)
      }
    }
  };

  return store;
};
```

This store follows a similar structure to the previous UI store we created. This time we start by importing the axios dependency. Then our `IRootStore` interface to make the create function type-safe.

However, you can see that in this store we are not using `makeAutoObservable`, because we don't have any state to keep track of for now, but at some point you could also track your requests at this level. The beauty of MobX is that it makes it trivial to add and observe state without too much fuss.

Next we create a `fetchBooks` call. This is a function that will query the `GET` endpoint of our mock server. It is an marked with the `async` prefix, thus making async code (such as network calls) easier to read by allowing us to use the `await` keyword. Inside this function we simply call axios (with `await` as a prefix) and passing it the full URL of our server. As the last step we simply return the data to whoever called the function (Axios takes care of parsing the JSON and putting it in the `data` field of the returned object).

Last we add an `addBook` function, which will just take the title of a book. The axios call is a bit different (we call `.post` instead of `.get`), and as a second parameter we pass an object with the title of our book - this object will be stringified into JSON and the server will take care of adding a date to it.

You can also see we have added minimal error handling to the `addBook` function, with a try/catch block, in case the server returns an error. It's up to you on which level of abstraction you want to handle your errors. I would recommend keeping the API store as stateless as possible and handling errors on the calling stores, because most of the time you want to provide the user with some feedback in case something goes wrong. That might include some business logic, like displaying different types of alerts, specific error messages and so on.

### API store

We can now update our root store to contain our new API store:

```ts
// src/Store.ts

import { createContext, useContext } from "react"
import { createApiStore } from "stores/Api.store"
import { createUIStore } from "stores/UI.store"

export interface IRootStore {
  ui: ReturnType<typeof createUIStore>,
  api: ReturnType<typeof createApiStore>
}

export let createRootStore = (): IRootStore => {
  let store: any = {}
    
  store.ui = createUIStore(store)
  store.api = createApiStore(store)

  return store
}
```

We can now import the new `createApiStore` function at the top of the file. Same as when we created the UI store, on our first pass on the root store, we need to add the return type of the create function into the `IRootStore` interface. And finally on the body of the function, we can add a new key `.api` where we create an instance of the `ApiStore`.

Now you see the power of giving access to the root store from the children stores. From our UI store, we can now directly call the API layer of our app, effectively containing HTTP internals and just dealing with responses. Let's modify our UI store to use the new API store:

```ts
// src/stores/UI.store.ts
import { makeAutoObservable, runInAction } from "mobx";
import { IRootStore } from "Store";

interface IBook {
  title: string,
  createdAt: string
}

export let createUIStore = (root: IRootStore) => {

  let store = makeAutoObservable({
    books: [] as IBook[],

    get uppercasedBooks(): IBook[] {
      return store.books.map((book) => ({
        ...book,
        title: book.title.toUpperCase(),
      }))
    },
    async addBook(title: string) {
      const books = await root.api.addBook(title)

      if (books) {
        runInAction(() => {
          store.books = books
        })
      }
    },
    async fetchBooks() {
      const books = await root.api.fetchBooks()

      runInAction(() => {
        store.books = books
      })
    }
  })

  return store
}
```

:::note
We have also created an `IBook` interface to provide some type safety for the data we are dealing with.
:::

The server will now contain the "source of truth" for the latest state of the user books, therefore we modify the addBook function. We have made it `async` so we can await for the response from the server, and in the body of the function we now access the API store (via the `root` object) and call the `addBook` function. 

We then take the response from the server, if the server responds with any value (the response for this query is returned an updated array with the new entry), we can finally update the local value of the books.

You can see there is a new `runInAction` function being used when updating the books array reference, we will talk about in a second. 

We also add a `fetchBook` function - this will simply get the books from the server and put it in the state.

### MobX caveats

There are a few important points we need to clarify regarding MobX. 

The first thing to notice is the `runInAction` function. MobX needs to apply all the changes to the observable properties in a sequential manner, however JavaScript is single-threaded, so it relies on the "event loop" to do async operations. We won't go into too much detail, but basically async code breaks the consistency guarantees of MobX, which is why **for any async request you need to re-wrap any code that modifies observables in an `action` transaction again**. (Remember` makeAutoObservable` does this for you for the high-level elements of the store).

Another important thing to mention is that nested observables can be a little finicky. In our code you can see we just replace the entire `store.books` reference. This works fine, because "observable" is a property on the store object itself and not the original array reference (due to `makeAutoObservable`). However there might come a time where the observable is the array itself, and in those cases if you replace the property you will lose all reactivity, because it is no longer an "observable" item. In those cases, if you want to completely replace the contents of the array, MobX enhances the array with a `replace` method, which will completely empty the array and replace its content.

### Connecting our UI

With that out of the way, we can now update our `Books.container` to connect to the API. The basic idea is that when the component mounts, it will tell our store to fetch the books. We could have this logic in the store initialization code, but this is also a mechanism to fetch data when navigating through components.

```ts
// src/containers/Books.container
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import {useStore} from 'Store';

interface IProps {}

export const Books = observer((props: IProps) => {
  let root = useStore();
  let [title, setTitle] = useState('');

  useEffect(() => {
    root.ui.fetchBooks();
  }, []);

  return (
    <View>
      {root.ui.uppercasedBooks.map((book) => (
        <View key={book.createdAt}>
          <Text>{book.title}</Text>
        </View>
      ))}

      <TextInput value={title} onChangeText={setTitle} />
      <Button title="Add button" onPress={() => root.ui.addBook(title)} />
    </View>
  );
});

```

We added a `useState` hook to hold a book's title. Let us skip it for a minute, as we will come to explain more about hooks. It basically returns a tuple; the first value being the current value of the variable and the second being a function we can call to update it. When you call the `setName` function, the value of the inside of the hook will be updated and your component will re-render.

We have now added a `useEffect` hook which will run its internal function every time one of the parameters in the array changes. If you pass an empty array it will run **only** when the component has finished mounting.  If you pass nothing it will run every time your component updates. In this case once our component mounts it will trigger a loading of the books from our API. We don't need to modify the rest of the code connected to the `books` value - MobX takes care of re-rendering the component when it changes!

You can also see a new React Native component `TextInput`, which is just that, a text input. Now our user can interact with the app and add their favorite books. The button we placed before now calls the `addBook` function with the state we added.

### About hooks

Now that you have seen that we can hold state inside the component with `useState` you may be wondering, **"if I can have state in my components why use MobX at all?"**

Well - it's complicated! Hooks provide a great API for functional components to maintain state, however as you add more (and compose) hooks, it gets really hard to reason about state changes. Because your UI renders in a declarative manner, keeping track of state changes across different renders can become a big state machine which you have to run in your head. Sharing state between components is also cumbersome if you only use hooks - passing props downwards is straightforward but sharing state laterally or up the render tree can be very painful.

In this case we could have completely avoided hooks and handled all the state in our UI store, but it's important to know about this so you don't get confused, and so you can use the right abstraction when you need it. My advice is to use hooks for **small local state**, as it makes code easier to understand and provides encapsulation. Everything else you can architect into your MobX stores, specially async code and computed properties, which are much easier to handle at that level.


