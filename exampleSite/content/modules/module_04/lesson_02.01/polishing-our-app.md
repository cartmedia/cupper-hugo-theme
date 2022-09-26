---
title: Polishing our app
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/poc5786l5q
---

We are going to take a small break from adding features like crazy to our app, and take a bit of time to polish it and prepare it for a release. Most importantly, we have only traversed the happy path so far, having (intentionally) avoided some of the limitations of the framework, but it's important to discuss them sooner rather than later.

### Quitting the app

Something that is different from a mobile app is that you need to provide a Quit button if you want to pass the App Store review process, and since we made our app a UIElement, the user cannot close it if we don't provide any UI for it! So let's get to it. We will start by creating a native method:

{lang=objective-c,crop-start-line=9,crop-end-line=9}
<<[macos/buildingApps-macOS/BuildingAppsNative.m](./protected/macos/buildingApps-macOS/BuildingAppsNative.m)

You will notice that this time, we don't care about the response, so we can just leave it out, and then in our Swift code:

{lang=objective-c,crop-start-line=25,crop-end-line=31}
<<[macos/buildingApps-macOS/BuildingAppsNative.swift](./protected/macos/buildingApps-macOS/BuildingAppsNative.swift)

Now, here are two important tidbits to pay attention to!

First, there is this funny `DispatchQueue.main.async` call. Whenever you interact with the app's UI, you cannot just execute any code. This is a limitation from the OS to prevent race conditions, therefore sometimes you will need to run your code on the `main` thread of your app. It's the same thread that runs the UI. If you forget it, XCode will warn you whenever you need to do this, but be careful not to choke the thread or your app could become completely unresponsive!

The second part is we are grabbing the instance of our `AppDelegate`, because that is the main class where our app is running. Sometimes we will add other functionality into `AppDelegate` and we will need to reach into this instance again. For now we are just going to add a close method, which will effectively terminate our app:

{lang=objective-c,crop-start-line=70,crop-end-line=72}
<<[macos/buildingApps-macOS/AppDelegate.swift](./protected/macos/buildingApps-macOS/AppDelegate.swift)

You will notice that this time we don't need an `@objc` annotation, because the calling code is directly Swift. Don't worry about this too much either as XCode will warn you whenever you need to add it (or just throw a runtime error when you try to call it!).

We can now bind our JavaScript code (update our native class) and add a button on our UI to close our app. Let's update our native module first:

{lang=typescript}
<<[src/libs/BuildingAppsNative.ts](./protected/src/libs/BuildingAppsNative.ts)

We simply need to add a new `closeApp` function to the type declaration and internally bind it in the body of our class.  And on the Books container:

{lang=typescript,crop-query=.buildingAppsNative}
<<[src/container/Books.container.tsx](./protected/src/container/Books.container.tsx)

We start by importing our native module.

{lang=typescript,crop-query='Quit'}
<<[src/container/Books.container.tsx](./protected/src/container/Books.container.tsx)

And then by creating and binding a new button to call our close function.

Having a way to close the app is one of the many requirements for releasing a native macOS app, it will be required by the Apple reviewer if you submit your app to the AppStore. Next we will move on to polishing our UI a bit.