import { NativeModules } from "react-native";

interface IBuildingAppsNative {
  keychainWrite: (key: string, payload: string) => Promise<boolean>;
  keychainRead: (key: string) => Promise<string>;
}

function createBuildingAppsNative(nativeModule: any): IBuildingAppsNative {
  return {
    keychainRead: nativeModule.keychainRead,
    keychainWrite: nativeModule.keychainWrite
  }
}

export const buildingAppsNative = createBuildingAppsNative(
  NativeModules.BuildingAppsNative
)