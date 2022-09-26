---
title: OS level drag and drop
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/srtoh3hh96
---

This will be the last part of our course, and is by far the most complex, as we will look into how to emit events from the native side and listen for them in JavaScript, as well as implementing drag-and-drop in the OS level for our status bar item. This is something that I have seen no other app do before and you could create a whole slew of new apps with this. Think about file uploaders or file converters.... the sky is the limit!

In this lesson we will start with just the native side of things.

### OS quirks

Before we start we should talk a bit about drag-and-drop. Maybe you have implemented this in your web apps before. There are many libraries out there and the browser abstracts some of the work for you, but we are going to have to deal with the native APIs directly, and they work a bit differently.

We are going to register a list of supported types. This list is not only limited to files - we can register listeners for strings, files, specific image types and so on. So, here we will encounter the first difference: when you drag and drop a file from the computer file system, we will get not a blob but rather a URL, and it is then up to us to do something with this URL. We will create a copy in our app sandboxed document folder.

Another important difference happens when you drag an element out of another program, for example, dragging an image out of your browser. Here we will not get a URL or a file blob, but a promise object. We need to handle this promise and tell macOS where to download it.

There are many types you can register the app to listen for, so we need to be able to handle each case (more or less).

### Registering our app for drop events

We will start by registering our status bar button to be a droppable element. In `AppDelegate` add/change the following lines:

{lang=swift,engine=treesitter,crop-start-line=28,crop-end-line=39}
<<[macos/buildingApps-macOS/AppDelegate.swift](./protected/macos/buildingApps-macOS/AppDelegate.swift)

We first start by creating an array of valid types for dropping into our app (they have the `NSPasteboard.PasteboardType` type). For now we will register the `URL`, `fileURL`, `png` and `string` types. On the next line we create a type for the type of `Promises` you get when dragging complex objects (we mentioned dragging images from a browser).  We finally put all of them into a single array.

Then when we create our status bar button, we call the `registerForDraggedTypes` function with our array of types.

### Creating extensions for native classes

We are going to create some extensions (and constants) for the base classes provided by Swift and XCode. An "extension" is a mechanism for adding functionality to classes without sub-classing them. For JavaScript developers this is similar to modifying the prototype chain of an object.

In our `lib` directory, create the following files:

`URL.extension.swift`

{lang=swift,engine=treesitter}
<<[macos/buildingApps-macOS/lib/URL.extension.swift](./protected/macos/buildingApps-macOS/lib/URL.extension.swift)

We are going to extend the native URL object to make it a bit easier to distinguish passed URLs. One useful thing is to know if the URL is an image (so we can display it) or if it is a localFile so we can copy it to our app's internal directory.

`FileManager.extension.swift`

{lang=swift,engine=treesitter}
<<[macos/buildingApps-macOS/lib/FileManager.extension.swift](./protected/macos/buildingApps-macOS/lib/FileManager.extension.swift)

We are also going to extend the `FileManager` class. The `extractWhereFrom` method does spelunking in the internal metadata of a file to extract **where it was copied from**. This could be the local disk or maybe a website, can be useful to display to the user where this file came from.

The `secureCopyItem` is a copy function that overwrites anything that was there before.

`FileConstants.swift`

{lang=swift,engine=treesitter}
<<[macos/buildingApps-macOS/lib/FileConstants.swift](./protected/macos/buildingApps-macOS/lib/FileConstants.swift)

Finally, we need some constants to glue everything together. If you have done a bit of native programming before, you know that each app has a `documents` folder in which it can freely store and manipulate files. We simply detect this location when our app starts and save it as a static property.

Afterwards we create a `workQueue` (this is similar to threads - we already visited the Main thread in the previous lessons).It will be used to do copy jobs in the background, to avoid choking our UI thread and making our app unresponsive.

### Handling drop events

So now, we can create the main code to handle drop events. This one is slightly complicated, so we will walk through the code:

{lang=swift,engine=treesitter}
<<[macos/buildingApps-macOS/lib/NSStatusBarButton.extension.swift](./protected/macos/buildingApps-macOS/lib/NSStatusBarButton.extension.swift)

The first four functions are just UI adjustments to highlight our status bar button (the highlight property is already part of the base class `NSStatusBarButton`). `performDragOperation` is where we will do all the grunt work.

The first flag `isCmdPressedOnDrop` is interesting to look at. As we are dealing with the drag-and-drop operation at OS level, we get a lot more control over finer things, for example, if the user drops an element while pressing the `Cmd` key, this `draggingSourceOperationMask` is set. We could use it, for example, to immediately trigger an action for the JavaScript side (compose email, create a calendar event, create a post etc). We will not use it, but the API is not intuitive so I thought it might save you some time, in case you ever want to implement this in your app.

Afterwards we get an object array of all the items that have been dropped. The syntax might look a bit funny, but it's just the idiomatic Swift way of grabbing optional values.

We can then iterate over each object, handling it according to its type: for file promises we tell the OS to download them into our app's document directory, for URLs we need to make sure we have a file (HTTP links are also valid URLs) and then copy them.

There are a couple of snippets floating around in case you need more examples, such as how to handle strings, or image files (which are just files at the end of the day). The code is documented so read it carefully to understand the quirks.

The other interesting part you can see is a `BuildingAppsEmitter` class being used. We haven't created it yet but in the next step we will transform our native bridge object into an event emitter, so we can listen for drop events from JavaScript.

So - we are done with the dealing with the lower-level API. Let's move on to look at emitting events. 