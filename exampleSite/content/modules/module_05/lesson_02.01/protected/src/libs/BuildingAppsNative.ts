import { NativeModules } from "react-native";

interface IBuildingAppsNative {
  keychainWrite: (key: string, payload: string) => Promise<boolean>;
  keychainRead: (key: string) => Promise<string>;
  closeApp: () => void;
  openDesktopWindow: () => void;
  getStartAtLoginStatus: () => Promise<boolean>;
  setStartAtLoginStatus: (status: boolean) => void;
}

function createBuildingAppsNative(nativeModule: any): IBuildingAppsNative {
  return {
    keychainRead: nativeModule.keychainRead,
    keychainWrite: nativeModule.keychainWrite,
    closeApp: nativeModule.closeApp,
    openDesktopWindow: nativeModule.openDesktopWindow,
    getStartAtLoginStatus: nativeModule.getStartAtLoginStatus,
    setStartAtLoginStatus: nativeModule.setStartAtLoginStatus
  }
}

export const buildingAppsNative = createBuildingAppsNative(
  NativeModules.BuildingAppsNative
)