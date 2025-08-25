import { Image, StyleSheet } from "react-native";

const BackgroundEffects = () => {
  return (
    <>
      <Image
        source={require("../assets/effect/effect1.png")}
        style={styles.effect1}
      />
      <Image
        source={require("../assets/effect/effect2.png")}
        style={styles.effect2}
      />
    </>
  );
};

const styles = StyleSheet.create({
  effect1: {
    width: 283.41,
    height: 423,
    position: "absolute",
  },
  effect2: {
    width: 283.41,
    height: 423,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});

export default BackgroundEffects;
