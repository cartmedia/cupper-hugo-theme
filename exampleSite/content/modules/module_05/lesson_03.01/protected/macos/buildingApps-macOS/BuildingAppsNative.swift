import Foundation
import KeychainAccess
import LaunchAtLogin


private let keychain = Keychain(service: "BuildingApps")

@objc(BuildingAppsNative)
class BuildingAppsNative: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func keychainWrite(_ key: NSString, payload: NSString, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
    keychain[key as String] = payload as String
    resolver(true)
  }

  @objc
  func keychainRead(_ key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
    let value = keychain[key as String]
    return resolve( value)
  }
  
  @objc
  func closeApp() {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.closeApp()
    }
  }

  @objc
  func openDesktopWindow() {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.openDesktopWindow()
    }
  }

  @objc
  func getStartAtLoginStatus(_ resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
    resolve(LaunchAtLogin.isEnabled)
  }

  @objc
  func setStartAtLoginStatus(_ status: Bool) {
    LaunchAtLogin.isEnabled = status
  }

  @objc
  func sendNotification(_ title: NSString, payload: NSString, url: NSString) {
    let notification = NSUserNotification()
    notification.identifier = UUID().uuidString
    notification.subtitle = payload as String
    notification.title = title as String
    // This part is interesting, this is how we are going to pass data back into our application
    notification.userInfo = [
      "url": url
    ]
    notification.soundName = "default"

    NSUserNotificationCenter.default.deliver(notification)
  }
}
