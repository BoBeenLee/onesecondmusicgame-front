package kr.nexters.onesecondmusicgame;

import android.os.Build;
import android.os.Bundle;

import kr.nexters.onesecondmusicgame.MainApplication;

import com.reactnativenavigation.NavigationActivity;
import com.reactnativenavigation.utils.CommandListenerAdapter;
import com.reactnativenavigation.viewcontrollers.navigator.Navigator;
import android.content.Intent;
import android.webkit.WebView;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends NavigationActivity implements OnImagePickerPermissionsCallback {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);

        if (BuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        Navigator navigator = getNavigator();
        if (!navigator.handleBack(new CommandListenerAdapter())) {
            super.onBackPressed();
            moveTaskToBack(true);
        }
    }

    @Override
    public void setPermissionListener(PermissionListener listener)
    {
        this.listener = listener;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
        if (listener != null)
        {
        listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
