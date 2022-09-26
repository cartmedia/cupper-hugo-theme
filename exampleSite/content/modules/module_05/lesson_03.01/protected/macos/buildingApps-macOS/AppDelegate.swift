import Foundation
import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate, NSUserNotificationCenterDelegate {
  var popover: NSPopover!
  var devWindow: NSWindow!
  var window: NSWindow?
  var statusBarItem: NSStatusItem!

  var reactNativeBridge: ReactNativeBridge!

  func applicationDidFinishLaunching(_ aNotification: Notification) {
    // Create a single bridge instance for the react-native views
    reactNativeBridge = ReactNativeBridge()

    let popoverController = ReactViewController(moduleName: "buildingApps", bridge: reactNativeBridge.bridge)

    popover = NSPopover()
    popover.contentViewController = popoverController

    popover.contentSize = NSSize(width: 700, height: 800)
    popover.animates = true
    popover.behavior = .transient

    statusBarItem = NSStatusBar.system.statusItem(withLength: CGFloat(60))

    if let button = self.statusBarItem.button {
      button.action = #selector(togglePopover(_:))
      button.title = "buildingApps"
    }

    #if DEBUG
    devWindow = NSWindow(
          contentRect: NSRect(x: 0, y: 0, width: 1, height: 1),
          styleMask: [.titled, .closable, .miniaturizable, .resizable],
          backing: .buffered,
          defer: false)

    devWindow.contentViewController = popoverController
    devWindow.center()
    devWindow.setFrameAutosaveName("Tempomat Main Window")
    devWindow.isReleasedWhenClosed = false
    devWindow.makeKeyAndOrderFront(self)
    let screen: NSScreen = NSScreen.main!
    let midScreenX = screen.frame.midX
    let posScreenY = 200
    let origin = CGPoint(x: Int(midScreenX), y: posScreenY)
    let size = CGSize(width: 700, height: 800)
    let frame = NSRect(origin: origin, size: size)
    devWindow.setFrame(frame, display: true)
    #endif

    NSUserNotificationCenter.default.delegate = self

  }

  func userNotificationCenter(_ center: NSUserNotificationCenter, didActivate notification: NSUserNotification) {
    print("user notification center called")
    // If the notification has a URL attached, then open the browser directly
    let urlString = notification.userInfo!["url"] as! String
    if(urlString.isEmpty == false ) {
      let url = URL(string: notification.userInfo!["url"] as! String)!
      NSWorkspace.shared.open(url)
    } else {
      print("Toggling popover")
      togglePopover(self)
    }

  }

  @objc
  func togglePopover(_ sender: AnyObject?) {
      if let button = self.statusBarItem.button {
          if self.popover.isShown {
              self.popover.performClose(sender)
          } else {
              self.popover.show(relativeTo: button.bounds, of: button, preferredEdge: NSRectEdge.minY)

              self.popover.contentViewController?.view.window?.becomeKey()
          }
      }
  }

  func closeApp() {
    NSApp.terminate(nil)
  }

  func openDesktopWindow() {
    if(window == nil) {
      let windowController = ReactViewController(moduleName: "buildingApps-window", bridge: reactNativeBridge.bridge)

      window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 480, height: 300),
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered, defer: false)
      window!.contentViewController = windowController
      window!.center()
      window!.setFrameAutosaveName("Building Apps Desktop")
      window!.isReleasedWhenClosed = false
      window!.makeKeyAndOrderFront(self)
      let screen: NSScreen = NSScreen.main!
      let midScreenX = screen.frame.midX
      let posScreenY = 200
      let origin = CGPoint(x: Int(midScreenX), y: posScreenY)
      let size = CGSize(width: 700, height: 800)
      let frame = NSRect(origin: origin, size: size)
      window!.setFrame(frame, display: true)
    } else {
      window!.makeKeyAndOrderFront(self)
    }
  }
}
