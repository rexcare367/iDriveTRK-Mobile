import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import Header from "@/components/Header";
import { startPostTrip } from "@/redux/actions/driverActions";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function PostTripScreen() {
  const dispatch = useDispatch();
  const { clockInFormData } = useSelector((state: any) => state.driver);

  const handleStartPostTrip = () => {
    if (clockInFormData.truck_id) {
      dispatch(startPostTrip(clockInFormData.truck_id));
      router.push("/post-trip-driver-info");
    } else {
      Alert.alert("Alert", "Truck info is missed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header
        title="Pre-trip Inspection"
        subtitle="Complete pre-trip inspection"
      />
      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity
          style={styles.confirmButtonOuter}
          onPress={handleStartPostTrip}
        >
          <View style={styles.confirmButtonInner}>
            <Text style={styles.confirmButtonText}>Perform Post-trip</Text>
          </View>
        </TouchableOpacity>
      </View>
      <BottomTabBar activeTab="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  confirmButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 90,
  },
  confirmButtonOuter: {
    width: 210,
    height: 210,
    borderRadius: 110,
    borderWidth: 5,
    borderColor: "#D3D1D1FF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  confirmButtonInner: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#082640",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
});
