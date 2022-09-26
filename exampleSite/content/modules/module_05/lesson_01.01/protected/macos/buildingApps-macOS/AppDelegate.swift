import Foundation
import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  var popover: NSPopover!
  var devWindow: NSWindow!
  var statusBarItem: NSStatusItem!

  var reactNativeBridge: ReactNativeBridge!
  var window: NSWindow?

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
  }

  @objc func togglePopover(_ sender: AnyObject?) {
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
