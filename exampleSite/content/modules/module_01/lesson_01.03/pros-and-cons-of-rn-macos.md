---
title: Pros and cons
isPublicLesson: false
privateVideoUrl: https://fullstack.wistia.com/medias/j6i7f49sci
---

Like everything in life, there is no magic bullet. React Native macOS has a lot of upsides, but it also has some downsides, and it's important to be aware of them.  We'll go over some of the good and the bad.

Let's first look at the pros and cons of pure React Native, before diving into the specifics with macOS.

## React Native pros and cons

### Pros

- **Cross-platform**
  
  You can re-use most of the code across platforms, saving huge amounts of time and the market is full of web developers who can quickly jump into a JavaScript codebase.
    
- **Hot-reloading**

  Unlike native development, where you need to recompile your app on every change, React Native allows for quick iteration on the UI layer. For a lot of native devs this is a game changer. (SwiftUI now has previews, but they are finicky at best.)

- **Cost-efficient**

  Again being able to re-use code and developers directly translates to costs - a small team is able to deliver more functionality.

- **Large community**

  Over the years the React Native community has grown quite large and there are many libraries, from UI components to integration with third-party APIs and vendors. (However, support has been left entirely to the community so you might find your favorite library is not well supported.)

- **Performance**

  React Native apps are far smaller and faster than embedded web alternatives, performing at around 80% - 90% the speed of a native app!

### Cons

- **Compromises on the experience**

  Sometimes you will not be able to replicate a pure native experience, due to either limitations of the framework itself or lack of libraries.

- **No escape from native constraints**

  While it is meant for web developers to quickly pick up, there is no escaping from the truth that sometimes you will stumble into problems that will require native knowledge to solve.

- **Performance**

  While performance is great, there are some constraints backed into the framework. There are plans to improve some of the pain points, but if performance is critical to your app, then you'll either have to work your way around some of the obstacles or fall back to native components/code.

## Pros and cons of  macOS port

Having said all of this about pure React Native, there are some important differences with the macOS port that we ought to look at.

### Pros

- **(re)Use your mobile code**

  While mobile experiences have become a lot more polished, and the mobile market is dictating the fate of many companies, the desktop has been somewhat forgotten. No more! With minor modifications, you can bring the same delightful mobile experience into desktops... at least in theory.

- **No need to learn objective-c or SwiftUI**

  A lot of this stuff is abstracted for you, so you are no longer at the whim of Apple.  Whatever knowledge you gain you can apply it (mostly) through all the platforms.

- **Create truly amazing desktop experiences**

  With the advent of Apple silicon there are now many iOS apps you can directly run on your mac, however they were not designed for mouse and keyboard, which means the UX suffers. With React-Native-macOS you can tailor the experience to be as easy on desktop as it is on mobile.

### Cons

- **You will still need to learn some of the old APIS**

  Let's face it, Apple is not so great at documenting and maintaining their APIs and if you truly want to deliver the best possible experience then sometimes you'll have to get your hands dirty with the macOS internals.

- **The port is REALLY new**

  At the time of this course's creation, the port had only been released a few months prior. There are very real limitations with React-Native-macOS itself and with a lot of the libraries, which currently do not support macOS. Progress is being made, albeit slowly, and maybe by the time you are undertaking this course things will have improved. 

## Future of React-Native for desktops

I have no association with Microsoft but I can tell you that it is committed to further expand and maintain their end of the deal. Facebook has also announced they are partnering with them to continue further development of the React-Native desktops versions. React Native also has a very healthy community, you will be able to find a lot of libraries and resources all over the internet.

As we go through the course we will run into some of the limitations we discussed. Microsoft showcased their Xbox app to be a React Native app, but in reality it was just a webview (something we will learn how to do in this course). We, however, will do the work for real, creating workarounds and alternatives to get as close as possible to a real native experience.