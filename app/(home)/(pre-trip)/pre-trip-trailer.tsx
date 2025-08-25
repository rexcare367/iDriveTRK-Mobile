import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../../components/BackgroundEffects";
import BottomTabBar from "../../../components/BottomTabBar";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import { updatePreTripForm } from "../../../redux/actions/driverActions";

const PreTripFormTrailer = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    trailerNumber1: preTripFormData?.trailer?.trailerNumber1 || "",
    trailerNumber2: preTripFormData?.trailer?.trailerNumber2 || "",
  });

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        trailer: formData,
      })
    );
    router.push("/pre-trip-trailer-details");
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
    <View style={styles.container}>
      <BackgroundEffects />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Trailer(s)</Text>
        <Text style={styles.subtitle}>List of Trailers with Details</Text>

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
    </View>
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

export default PreTripFormTrailer;
