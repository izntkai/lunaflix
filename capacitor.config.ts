import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lunaflix.app',
  appName: 'Lunaflix',
  webDir: 'dist',
  server: {
    url: "http://192.168.1.3:5173",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    },
    Keyboard: {
      resize: "body",
      style: "DARK"
    }
  }
};

export default config;
