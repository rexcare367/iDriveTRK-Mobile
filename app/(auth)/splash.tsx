import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

const SplashImage = ({ source, style }: any) => (
  <Image source={source} style={style} />
);

export default function SplashScreen() {
  const splashImages = [
    require("../../assets/effect/splash1.png"),
    require("../../assets/effect/splash2.png"),
    require("../../assets/effect/splash3.png"),
    require("../../assets/effect/splash4.png"),
  ];
  return (
    <View style={styles.container} onTouchEnd={() => router.push("/pin")}>
      {splashImages.map((image, index) => (
        <SplashImage
          key={index}
          source={image}
          style={styles[`splash${index + 1}`]}
        />
      ))}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo/idrive-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.subtitle}>
        Welcome to iDrive, where you get to optimize your productivity by using
        the application
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004B87",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  subtitle: {
    position: "absolute",
    fontSize: 16,
    color: "white",
    textAlign: "center",
    bottom: 40,
  },
  splash1: {
    top: 0,
    left: 0,
    width: 266,
    height: 423,
    position: "absolute",
  },
  splash2: {
    top: 0,
    right: 0,
    width: 266,
    height: 423,
    position: "absolute",
  },
  splash3: {
    bottom: 0,
    left: 0,
    width: 266,
    height: 423,
    position: "absolute",
  },
  splash4: {
    bottom: 0,
    right: 0,
    width: 266,
    height: 423,
    position: "absolute",
  },
});
