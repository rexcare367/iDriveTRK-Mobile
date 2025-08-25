const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("cjs");
config.resolver.unstable_enablePackageExports = false;

// Add support for react-native-maps
config.resolver.assetExts.push("db", "mp3", "ttf", "obj", "png", "jpg");

// Add JSX support for react-native-maps
config.resolver.sourceExts.push("jsx");

module.exports = config;
