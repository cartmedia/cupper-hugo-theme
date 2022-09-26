import { EmitterSubscription, NativeEventEmitter, NativeModules } from "react-native";

class BuildingAppsNative extends NativeEventEmitter {
  keychainWrite: (key: string, payload: string) => Promise<boolean>;
  keychainRead: (key: string) => Promise<string>;
  closeApp: () => void;
  openDesktopWindow: () => void;
  getStartAtLoginStatus: () => Promise<boolean>;
  setStartAtLoginStatus: (status: boolean) => void;
  sendNotification: (title: string, payload: string, url: string) => void;

  constructor(nativeModule: any) {
    super(nativeModule)

    this.keychainWrite = nativeModule.keychainWrite
    this.keychainRead = nativeModule.keychainRead
    this.closeApp = nativeModule.closeApp
    this.openDesktopWindow = nativeModule.openDesktopWindow
    this.getStartAtLoginStatus = nativeModule.getStartAtLoginStatus
    this.setStartAtLoginStatus = nativeModule.setStartAtLoginStatus
    this.sendNotification = nativeModule.sendNotification
  }
}

export const buildingAppsNative = new BuildingAppsNative(NativeModules.BuildingAppsNative)