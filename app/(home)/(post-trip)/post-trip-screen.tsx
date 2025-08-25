import { router } from "expo-router";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../../components/BackgroundEffects";
import BottomTabBar from "../../../components/BottomTabBar";
import { startPostTrip } from "../../../redux/actions/driverActions";

export default function PostTripScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { clockInFormData } = useSelector((state: any) => state.driver);

  console.log("user", user);

  const handleStartPostTrip = () => {
    if (clockInFormData.truck.id) {
      dispatch(startPostTrip(clockInFormData.truck.id));
      router.push("/post-trip-driver-info");
    } else {
      Alert.alert("Alert", "Truck info is missed");
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <View style={styles.header}></View>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>Confirm Trip Success</Text>
            <Text style={styles.subtitle}>Choose to confirm trip or not</Text>
          </View>
          <View style={styles.profileOuterBorder}>
            <View style={styles.profileInnerBorder}>
              <Image
                source={
                  user?.avatar
                    ? { uri: user.avatar }
                    : require("../../../assets/profile-placeholder.png")
                }
                style={styles.profileImage}
              />
            </View>
          </View>
        </View>
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileOuterBorder: {
    borderWidth: 1,
    borderColor: "#082640",
    borderRadius: 25,
    padding: 1,
  },
  profileInnerBorder: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 23,
    overflow: "hidden",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
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
  confirmButton: {
    backgroundColor: "#082640",
    width: 180,
    height: 180,
    borderRadius: 90,
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
