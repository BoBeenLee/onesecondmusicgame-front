package kr.nexters.onesecondmusicgame;

import android.app.Application;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Arrays;

import kr.nexters.onesecondmusicgame.BuildConfig;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.instanceid.RNFirebaseInstanceIdPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import com.microsoft.codepush.react.CodePush;
import com.airbnb.android.react.lottie.LottiePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.dooboolab.kakaologins.RNKakaoLoginsPackage;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.beefe.picker.PickerViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.bugsnag.BugsnagReactNative;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage; 

public class MainApplication extends NavigationApplication {
    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @javax.annotation.Nullable
            @Override
            protected String getJSBundleFile() {
                return CodePush.getJSBundleFile();
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                new RNFirebasePackage(),
                new RNFirebaseAnalyticsPackage(),
                new RNFirebaseMessagingPackage(),
                new RNFirebaseCrashlyticsPackage(),
                new RNFirebaseInstanceIdPackage(),
                new RNFirebaseLinksPackage(),
                new RNFirebaseNotificationsPackage(),
                new RNFirebaseRemoteConfigPackage(),
                new LottiePackage(),
                new CodePush(getString(R.string.reactNativeCodePush_androidDeploymentKey), MainApplication.this, isDebug(),
                        R.string.CodePushPublicKey),
                new SplashScreenReactPackage(),
                new RNKakaoLoginsPackage(),
                new RNFetchBlobPackage(),
                new VectorIconsPackage(),
                new SvgPackage(),
                new RNDeviceInfo(),
                new LinearGradientPackage(),
                new PickerViewPackage(),
                new AsyncStoragePackage(),
                new RNCWebViewPackage(),
                new ReanimatedPackage(),
                new RNGestureHandlerPackage(),
                BugsnagReactNative.getPackage(),
                new RNPermissionsPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}