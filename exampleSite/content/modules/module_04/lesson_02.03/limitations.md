---
title: Overview on the limitations
isPublicLesson: false
---

Before moving on to the final part of the module, we need to discuss some other limitations of React-Native-macOS.  Whilst some of these are not show-stoppers it is worth mentioning before you dive headfirst into building your app.

### Hermes

Hermes is a JavaScript engine created by Facebook to cut loading times on Android. It does so by storing your JavaScript code as bytecode - this helps by not having to parse it in-device as it can be directly loaded, particularly useful on lower-end android devices and indeed on all platforms where you can ship bundled JavaScript. It should be released soon for iOS (with React Native 0.64), but it is available right now for macOS.

Enabling it is super simple; follow the instructions on the Podfile and uncomment the following line:

```ruby
# macos/Podfile

# To use Hermes, install the `hermes-engine-darwin` npm package, e.g.:
#   $ yarn add 'hermes-engine-darwin@~0.5.3'
#
# Then enable this option:
#   :hermes_enabled => true
```

Remember always to check the [official docs](https://microsoft.github.io/react-native-windows/docs/hermes) (even though right now they are a bit outdated).

A word of caution! This is very new technology and in my experience there are subtle bugs. I had an issue where it completely froze my app when handling a large number of promises, meaning I had to revert to jscore (the default engine on apple devices). However if you have a very large JavaScript bundle it might help you cut your app's launch time.

### Other UI components

We have seen that small things like hover states are not working quite as expected, but there are other components and APIs that you will need if you ever want to create a more feature-packed app. Listening for keyboard events is limited, and unlike their mobile counterparts, desktop apps require a lot of keyboard interaction. For example I tried building an auto-complete box, but this was a lot of hard work on the native side (manually toggling key listeners and emitting events) and it was impossible to get the caret coordinates within an an input box, so I gave up after a couple of days.

Other stuff is more critical, for example, secure text fields are also missing, and anything but a basic text input is filled with weird errors. 

Gaps are getting implemented, albeit slowly. Since you now know how to expose native functionality you might be able to get around some of these issues, but if you can contribute to the core package it would be even better. As a matter of fact a lot of the lessons in this course are directly translatable to new modules or should be part of the framework. I encourage you to participate and contribute to the community!

### Unsupported libraries

We also mentioned that not all libraries support macOS as a target (some you can get around).

However with other libraries you won't have that much luck. SVG support is non-existent, as it is for any other animation library, and most of the UI libraries just won't work because the underlying UI API changes from iOS to macOS. However, if the library uses pure Obj-C or Swift code without calling UI frameworks, there is a good chance you can just add macOS as a compilation target and it will work. One example is [react-native-get-random-values](https://github.com/LinusU/react-native-get-random-values/pull/14). I created a PR for it and all it took was just adding macOS on the CocoaPods spec file.

You can also create tickets for the community to add support to other libraries in the react-native-macos repository; there is no guarantee it will happen, but at least Microsoft and the community will be made aware of the issue.

Sometimes it can feel like death by a thousand paper cuts, but this is life with new technologies, and the benefits of having a single codebase for your product can outweigh these drawbacks.

We will now move to the last part of this module, preparing our app for release.