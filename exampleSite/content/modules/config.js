module.exports = ({ dedent }) => ({
  title: "Building React Native Apps for Mac",
  slug: "building-react-native-apps-for-mac",
  permalink: "/courses/building-react-native-apps-for-mac",
  // posterImageUrl: "./images/tinyhouse-video-banner.png",
  heroVideoUrl: "https://fullstack.wistia.com/medias/c57r7q171j",
  gitRepoHttpUrl: "https://gitlab.com/fullstackio/books/building-react-native-apps-for-mac",
  publicLessonCount: 0,
  previewPercent: 40,
  modulePrefix: "module_",
  lessonDirsGlob: "module_*/lesson_*",
  moduleDirsGlob: "module_*",
  authorSlugs: ["ospfranco"],
  isFree: false,
  isShownPublicly: false,
  previewPagesOnSite: false,
  useDeltas: true,
  posterImageUrl: "./images/twitter.jpg",
  ogImageUrl: "./images/twitter.jpg",
  twitterPromoImageUrl: "./images/twitter.jpg",
  // heroPhotoUrl: "./path/to/file.jpg",
  // heroLogoUrl: "./path/to/logo.jpg"
  /* INSTRUCTIONS: Read the template below, write your own version, and then delete this comment (and the extra text) */
  summary: dedent(`
In this course we will learn how to create modern macOS applications using react-native, take advantage of all the goodies react-native provides on the mac.
  `),
  whatYouWillLearn: {
    items: [
      { text: "How to set up a scalable architecture for your application" },
      { text: "How to integrate native macOS APIs" },
      { text: "How to leverage native APIs with JavaScript" },
      { text: "How to create great desktop native experiences" },
    ]
  },
  primaryDescriptionMarkdown: dedent(`
In this course we will explore react-native as a framework for building macOS applications. Unlike web based tools, react-native offers a lot of benefits when it comes to performance and the ability to leverage native functionality.

React-native is not without its difficulties and the jump to a desktop environment requires not only novel technical solutions but also a different way of dealing with APIs and UI patterns.

In 30 lessons we cover setting up a scalable application architecture, connecting with native macOS APIs and exploring some workarounds. The course comes with a lot of new techniques, code samples and detailed instructions to develop React Native apps that are truly equal to native alternatives.

Taught by Oscar Franco, who has worked in several companies as team lead and CTO, released a bunch of React Native apps and has contributed many of the newest latest techniques for react-native-macos.
  `),
  numProjects: 1,
  linesOfCode: 709,
  ctaFeatures: {
    features: [
      { text: "Learn about react native on macOS" },
      { text: "Build a status bar application with JavaScript" },
      { text: "Integrate desktop functionality into a react-native app" }
    ]
  },
  authorBios: {
    yourUsernameHere: dedent(`
👋 Hi! I'm Oscar. Over the years I have created and released several React Native apps. A big pain has always been having to develop a separate app for desktops, with React Native for macOS this problem disappears, you can port your app at the drop of a hat.
`)
  },
  faq: [
    {
      q: "Who is this course for?",
      a: "Javascript and web devs who want to jump into desktop app development and/or macOS devs who want to create apps faster with modern tooling."
    },
    {
      q: "The framework is already there, what more is there to learn?",
      a: "While the framework provides the foundation for creating your app, many advanced features are time consuming to discover alone. Knowledge of the internal APIs and UI patterns macOS uses is also poorly documented. This course will cover a lot of topics so you can quickly create a great desktop experience."
    },
    {
      q: "What if I need help?",
      a:
        "You can ask us questions anytime through the community Discord channel or by [sending us a message](mailto:us@fullstack.io)."
    }
  ]
});
