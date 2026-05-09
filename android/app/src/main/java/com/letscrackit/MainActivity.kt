package com.letscrackit

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "LetsCrackIt"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onStart() {
    super.onStart()
    HealthConnectPermissionDelegate.setPermissionDelegate(this)
  }
}
