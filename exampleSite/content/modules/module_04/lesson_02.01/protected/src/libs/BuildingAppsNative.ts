import { NativeModules } from "react-native";

interface IBuildingAppsNative {
  keychainWrite: (key: string, payload: string) => Promise<boolean>;
  keychainRead: (key: string) => Promise<string>;
  closeApp: () => void;
}

function createBuildingAppsNative(nativeModule: any): IBuildingAppsNative {
  return {
    keychainRead: nativeModule.keychainRead,
    keychainWrite: nativeModule.keychainWrite,
    closeApp: nativeModule.closeApp
  }
}

export const buildingAppsNative = createBuildingAppsNative(
  NativeModules.BuildingAppsNative
)