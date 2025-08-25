import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.EXPO_APP_NAME || "idrive-trk",
  slug: process.env.EXPO_APP_SLUG || "idrive-trk",
  version: process.env.EXPO_APP_VERSION || "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "idrivetrkmpbile",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  owner: process.env.EXPO_OWNER || "idrive-trk",
  ios: {
    supportsTablet: true,
  },
  android: {
    googleServicesFile: "./google-services.json",
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#004B87",
    },
    edgeToEdgeEnabled: true,
    package: process.env.ANDROID_PACKAGE,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
});
