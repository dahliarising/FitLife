import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitlife.app',
  appName: 'FitLife',
  webDir: 'out',
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'FitLife',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
