import Foundation

class BuildingAppsEmitter {
  public static var sharedInstance = BuildingAppsEmitter()

  private static var emitter: BuildingAppsNative!

  private init() {

  }

  func registerEmitter(emitter: BuildingAppsNative) {
    BuildingAppsEmitter.emitter = emitter
  }

  func dispatch(name: String, body: Any?) {
    BuildingAppsEmitter.emitter.sendEvent(withName: name, body: body)
  }

  // You can add more typesafety here if you want to
  func dispatchFileDropped(body: Any!) {
    dispatch(name: "fileDropped", body: body)
  }
}
