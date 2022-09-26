#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(BuildingAppsNative, RCTEventEmitter)

RCT_EXTERN_METHOD(keychainWrite: (NSString)key payload:(NSString) payload resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(keychainRead: (NSString)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(closeApp)

RCT_EXTERN_METHOD(openDesktopWindow)

RCT_EXTERN_METHOD(getStartAtLoginStatus: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setStartAtLoginStatus: (BOOL)status)

RCT_EXTERN_METHOD(sendNotification: (NSString)title payload:(NSString)payload url:(NSString)url)

RCT_EXTERN_METHOD(supportedEvents)


@end