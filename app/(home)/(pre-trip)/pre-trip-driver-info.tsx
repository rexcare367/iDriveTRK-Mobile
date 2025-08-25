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

export default function PreTripFormDriverInfo() {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);
  const { user } = useSelector((state: any) => state.auth);

  const getTodayString = () => {
    const today = new Date();
    return today.toLocaleDateString();
  };

  const [formData, setFormData] = useState({
    date: preTripFormData?.date || getTodayString(),
    firstName: preTripFormData?.firstName || user?.firstName || "",
    lastName: preTripFormData?.lastName || user?.lastName || "",
    email: preTripFormData?.email || user?.email || "",
  });

  const handleNext = () => {
    dispatch(updatePreTripForm(formData));
    router.push("/pre-trip-vehicle-info");
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
              index <= 0
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
          label="Today's Date"
          placeholder="Enter date"
          value={formData.date}
          onChangeText={(text: string) =>
            setFormData({ ...formData, date: text })
          }
          icon={<Ionicons name="calendar-outline" size={24} color="#666" />}
          type="date"
        />

        <CustomInput
          label={
            <>
              First Name
              <Text style={{ color: "#B70101" }}>*</Text>
            </>
          }
          placeholder="Enter First Name"
          value={formData.firstName}
          onChangeText={(text: string) =>
            setFormData({ ...formData, firstName: text })
          }
          icon={<Ionicons name="person-outline" size={24} color="#666" />}
        />

        <CustomInput
          label={
            <>
              Last Name
              <Text style={{ color: "#B70101" }}>*</Text>
            </>
          }
          placeholder="Enter Last Name"
          value={formData.lastName}
          onChangeText={(text: string) =>
            setFormData({ ...formData, lastName: text })
          }
          icon={<Ionicons name="person-outline" size={24} color="#666" />}
        />

        <CustomInput
          label={
            <>
              Drivers Email Address
              <Text style={{ color: "#B70101" }}>*</Text>
            </>
          }
          placeholder="Enter your email here"
          value={formData.email}
          onChangeText={(text: string) =>
            setFormData({ ...formData, email: text })
          }
          icon={
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="#666"
            />
          }
        />

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={
            !formData.firstName || !formData.lastName || !formData.email
          }
        />
      </ScrollView>
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
