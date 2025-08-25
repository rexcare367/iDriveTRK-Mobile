import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../../components/BackgroundEffects";
import BottomTabBar from "../../../components/BottomTabBar";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import Header from "../../../components/Header";
import { updatePreTripForm } from "../../../redux/actions/driverActions";

const PreTripFormVehicleInfo = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    location: preTripFormData?.location || "",
    powerUnit: preTripFormData?.powerUnit || "",
    odometerReading: preTripFormData?.odometerReading || "",
  });

  const handleNext = () => {
    dispatch(updatePreTripForm({ ...preTripFormData, ...formData }));
    router.push("/pre-trip-photos");
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
              index <= 1
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
      <Header
        title="Vehicle Inspection Report"
        subtitle="As required by the DOT Federal Motor Carrier Service Regulations"
      />

      <ScrollView style={styles.content}>
        {renderProgressBar()}

        <CustomInput
          label={
            <>
              Location
              <Text style={{ color: "#B70101" }}>*</Text>
            </>
          }
          placeholder="Your Location"
          value={formData.location}
          onChangeText={(text: string) =>
            setFormData({ ...formData, location: text })
          }
          icon={<Ionicons name="location-outline" size={24} color="#666" />}
        />

        <CustomInput
          label={
            <>
              Power Unit
              <Text style={{ color: "#B70101" }}>*</Text>
            </>
          }
          placeholder="Enter Power Unit"
          value={formData.powerUnit}
          onChangeText={(text: string) =>
            setFormData({ ...formData, powerUnit: text })
          }
          icon={
            <MaterialCommunityIcons
              name="engine-outline"
              size={24}
              color="#666"
            />
          }
        />

        <CustomInput
          label={
            <>
              Odometer Reading (Beginning)
              <Text style={{ color: "#B70101" }}>*</Text>
            </>
          }
          placeholder="Enter Odometer Reading"
          value={formData.odometerReading}
          onChangeText={(text: string) =>
            setFormData({ ...formData, odometerReading: text })
          }
          icon={
            <MaterialCommunityIcons name="speedometer" size={24} color="#666" />
          }
        />

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={
            !formData.location ||
            !formData.powerUnit ||
            !formData.odometerReading
          }
        />
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
    backgroundColor: "#004B87",
  },
  progressStepInactive: {
    backgroundColor: "#D3D3D3",
  },
});

export default PreTripFormVehicleInfo;
