import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Header from "@/components/Header";
import { updatePostTripForm } from "@/redux/actions/driverActions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const PostTripFormTrailer = () => {
  const dispatch = useDispatch();
  const { postTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    trailerNumber1: postTripFormData?.trailer?.trailerNumber1 || "",
    trailerNumber2: postTripFormData?.trailer?.trailerNumber2 || "",
  });

  const handleNext = () => {
    dispatch(
      updatePostTripForm({
        ...postTripFormData,
        trailer: formData,
      })
    );
    router.push("/post-trip-trailer-details");
  };

  const progressSteps = [
    "Driver Info",
    "Vehicle Info",
    "Photos",
    "Engine",
    "Fluids",
    "Wheels",
    "Rear",
    "Cab",
    "Lights",
    "Checklist",
    "Safety",
    "Trailer",
    "Trailer Details",
    "Signature",
  ];

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {progressSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index <= 11
                ? styles.progressStepActive
                : styles.progressStepInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header title="Trailer(s)" subtitle="List of Trailers with Details" />

      <ScrollView style={styles.content}>
        {renderProgressBar()}

        <View style={styles.inputContainer}>
          <CustomInput
            label="Trailer Number 1"
            placeholder="Enter Trailer Number Details"
            value={formData.trailerNumber1}
            onChangeText={(text: string) =>
              setFormData({ ...formData, trailerNumber1: text })
            }
            icon={<Ionicons name="apps-outline" size={20} color="#082640" />}
          />
        </View>

        <View style={styles.inputContainer}>
          <CustomInput
            label="Trailer Number 2"
            placeholder="Enter Trailer Number Details"
            value={formData.trailerNumber2}
            onChangeText={(text: string) =>
              setFormData({ ...formData, trailerNumber2: text })
            }
            icon={<Ionicons name="apps-outline" size={20} color="#082640" />}
          />
        </View>

        <CustomButton title="Next" onPress={handleNext} />
      </ScrollView>

      <BottomTabBar activeTab="Home" />
    </SafeAreaView>
  );
};

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    marginTop: 10,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  progressStep: {
    height: 4,
    flex: 1,
    marginHorizontal: 2,
  },
  progressStepActive: {
    backgroundColor: "#082640",
  },
  progressStepInactive: {
    backgroundColor: "#D3D3D3",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
});

export default PostTripFormTrailer;
