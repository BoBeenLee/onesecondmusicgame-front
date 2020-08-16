/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>
#import "RNSplashScreen.h"
#import <KakaoOpenSDK/KakaoOpenSDK.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

@import Firebase;
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [FIROptions defaultOptions].deepLinkURLScheme = @"onesecondmusicgame";
    if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
    }
    [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
  
    NSURL *jsCodeLocation;
    #if DEBUG
      jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    #else
      jsCodeLocation = [CodePush bundleURL];
    #endif

    [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
    [RNSplashScreen show];
    return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  if ([KOSession isKakaoAccountLoginCallback:url]) {
    return [KOSession handleOpenURL:url];
  }
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                         openURL:url
                                               sourceApplication:sourceApplication
                                                      annotation:annotation];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *, id> *)options {
    if ([KOSession isKakaoAccountLoginCallback:url]) {
      return [KOSession handleOpenURL:url];
    }
    if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
      return YES;
    }
    return false;
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  [KOSession handleDidBecomeActive];
  [FBSDKAppEvents activateApp];
}

@end
