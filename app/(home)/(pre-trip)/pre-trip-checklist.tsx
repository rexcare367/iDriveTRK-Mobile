"use client";

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
import Checkbox from "../../../components/CustomCheckbox";
import CustomInput from "../../../components/CustomInput";
import { updatePreTripForm } from "../../../redux/actions/driverActions";

const PreTripFormChecklist = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState({
    allFunctioning: preTripFormData?.checklist?.allFunctioning ?? true,
    clutch: preTripFormData?.checklist?.clutch || false,
    parkingBreak: preTripFormData?.checklist?.parkingBreak || false,
    serviceBreak: preTripFormData?.checklist?.serviceBreak || false,
    starter: preTripFormData?.checklist?.starter || false,
    clutchDetails: preTripFormData?.checklist?.clutchDetails || "",
    parkingBreakDetails: preTripFormData?.checklist?.parkingBreakDetails || "",
    serviceBreakDetails: preTripFormData?.checklist?.serviceBreakDetails || "",
    starterDetails: preTripFormData?.checklist?.starterDetails || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.clutch ||
    formData.parkingBreak ||
    formData.serviceBreak ||
    formData.starter;

  const areDetailsValid =
    (!formData.clutch || formData.clutchDetails.trim() !== "") &&
    (!formData.parkingBreak || formData.parkingBreakDetails.trim() !== "") &&
    (!formData.serviceBreak || formData.serviceBreakDetails.trim() !== "") &&
    (!formData.starter || formData.starterDetails.trim() !== "");

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        checklist: formData,
      })
    );
    router.push("/pre-trip-safety");
  };

  const handleCheckboxToggle = (field) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        clutch: newValue ? false : formData.clutch,
        parkingBreak: newValue ? false : formData.parkingBreak,
        serviceBreak: newValue ? false : formData.serviceBreak,
        starter: newValue ? false : formData.starter,
        clutchDetails: newValue ? "" : formData.clutchDetails,
        parkingBreakDetails: newValue ? "" : formData.parkingBreakDetails,
        serviceBreakDetails: newValue ? "" : formData.serviceBreakDetails,
        starterDetails: newValue ? "" : formData.starterDetails,
      });
    } else {
      const isUnchecking = formData[field];
      setFormData({
        ...formData,
        [field]: !formData[field],
        allFunctioning: false,
        ...(isUnchecking && {
          [`${field}Details`]: "",
        }),
      });
    }
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

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {progressSteps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressStep,
            index <= 9
              ? styles.progressStepActive
              : styles.progressStepInactive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Check The Following</Text>
        <Text style={styles.subtitle}>
          Check to ensure that all are functioning.
        </Text>
        <Text style={styles.description}>
          Checklist includes: Clutch, Parking Break, Service Break, Starter
        </Text>

        {renderProgressBar()}

        <Text style={styles.sectionTitle}>
          Check any components that need repairs or attention
        </Text>
        <View style={styles.sectionDivider} />

        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={formData.allFunctioning}
            onPress={() => handleCheckboxToggle("allFunctioning")}
            label="All Functioning"
          />

          <Checkbox
            checked={formData.clutch}
            onPress={() => handleCheckboxToggle("clutch")}
            label="Clutch"
          />

          <Checkbox
            checked={formData.parkingBreak}
            onPress={() => handleCheckboxToggle("parkingBreak")}
            label="Parking Break"
          />

          <Checkbox
            checked={formData.serviceBreak}
            onPress={() => handleCheckboxToggle("serviceBreak")}
            label="Service Break"
          />

          <Checkbox
            checked={formData.starter}
            onPress={() => handleCheckboxToggle("starter")}
            label="Starter"
          />
        </View>

        {formData.clutch && (
          <CustomInput
            label="Clutch Details"
            placeholder="Enter Clutch Details"
            value={formData.clutchDetails}
            onChangeText={(text) =>
              setFormData({ ...formData, clutchDetails: text })
            }
            icon={
              <Ionicons name="settings-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.parkingBreak && (
          <CustomInput
            label="Parking Break Details"
            placeholder="Enter Parking Break Details"
            value={formData.parkingBreakDetails}
            onChangeText={(text) =>
              setFormData({ ...formData, parkingBreakDetails: text })
            }
            icon={
              <Ionicons name="car-sport-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.serviceBreak && (
          <CustomInput
            label="Service Break Details"
            placeholder="Enter Service Break Details"
            value={formData.serviceBreakDetails}
            onChangeText={(text) =>
              setFormData({ ...formData, serviceBreakDetails: text })
            }
            icon={
              <Ionicons name="construct-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.starter && (
          <CustomInput
            label="Starter Details"
            placeholder="Enter Starter Details"
            value={formData.starterDetails}
            onChangeText={(text) =>
              setFormData({ ...formData, starterDetails: text })
            }
            icon={<Ionicons name="flash-outline" size={20} color="#082640" />}
          />
        )}

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={!isAnyChecked || !areDetailsValid}
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
    marginBottom: 5,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 14,
    marginBottom: 15,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: "#E2DFDFFF",
    marginVertical: 10,
    marginBottom: 20,
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 10,
  },
});

export default PreTripFormChecklist;
