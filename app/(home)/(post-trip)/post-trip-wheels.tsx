"use client";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../../components/BackgroundEffects";
import BottomTabBar from "../../../components/BottomTabBar";
import CustomButton from "../../../components/CustomButton";
import CustomCheckbox from "../../../components/CustomCheckbox";
import CustomInput from "../../../components/CustomInput";
import Header from "../../../components/Header";
import { updatePostTripForm } from "../../../redux/actions/driverActions";

export default function PostTripFormWheels() {
  const dispatch = useDispatch();
  const { postTripFormData } = useSelector((state: any) => state.driver);

  // Helper function to get wheels inspection data from the new structure
  const getWheelsInspection = () => {
    const inspection = postTripFormData?.inspection || [];
    return inspection.find((item: any) => item.type === "wheels");
  };

  const wheelsInspection = getWheelsInspection();

  const [formData, setFormData] = useState({
    allFunctioning: wheelsInspection?.allFunctioning ?? true,
    wheels: wheelsInspection?.items?.find((item: any) => item.name === "wheels")?.status === "defective" || false,
    rims: wheelsInspection?.items?.find((item: any) => item.name === "rims")?.status === "defective" || false,
    lugs: wheelsInspection?.items?.find((item: any) => item.name === "lugs")?.status === "defective" || false,
    tires: wheelsInspection?.items?.find((item: any) => item.name === "tires")?.status === "defective" || false,
    tireChains: wheelsInspection?.items?.find((item: any) => item.name === "tireChains")?.status === "missing" || false,
    wheelsDetails: wheelsInspection?.items?.find((item: any) => item.name === "wheels")?.details || "",
    rimsDetails: wheelsInspection?.items?.find((item: any) => item.name === "rims")?.details || "",
    lugsDetails: wheelsInspection?.items?.find((item: any) => item.name === "lugs")?.details || "",
    tiresDetails: wheelsInspection?.items?.find((item: any) => item.name === "tires")?.details || "",
    tireChainsDetails: wheelsInspection?.items?.find((item: any) => item.name === "tireChains")?.details || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.wheels ||
    formData.rims ||
    formData.lugs ||
    formData.tires ||
    formData.tireChains;

  const areDetailsValid =
    (!formData.wheels || formData.wheelsDetails.trim() !== "") &&
    (!formData.rims || formData.rimsDetails.trim() !== "") &&
    (!formData.lugs || formData.lugsDetails.trim() !== "") &&
    (!formData.tires || formData.tiresDetails.trim() !== "") &&
    (!formData.tireChains || formData.tireChainsDetails.trim() !== "");

  const handleNext = () => {
    // Transform the form data into the new inspection structure
    const wheelsInspectionData = {
      type: "wheels",
      allFunctioning: formData.allFunctioning,
      items: [
        {
          name: "wheels",
          status: formData.wheels ? "defective" : "normal",
          details: formData.wheelsDetails
        },
        {
          name: "rims",
          status: formData.rims ? "defective" : "normal",
          details: formData.rimsDetails
        },
        {
          name: "lugs",
          status: formData.lugs ? "defective" : "normal",
          details: formData.lugsDetails
        },
        {
          name: "tires",
          status: formData.tires ? "defective" : "normal",
          details: formData.tiresDetails
        },
        {
          name: "tireChains",
          status: formData.tireChains ? "missing" : "normal",
          details: formData.tireChainsDetails
        }
      ]
    };

    // Update the inspection array in postTripFormData
    const existingInspection = postTripFormData?.inspection || [];
    const updatedInspection = existingInspection.filter((item: any) => item.type !== "wheels");
    updatedInspection.push(wheelsInspectionData);

    dispatch(
      updatePostTripForm({
        ...postTripFormData,
        inspection: updatedInspection,
      })
    );
    router.push("/post-trip-rear-vehicle");
  };

  const handleCheckboxToggle = (field: string) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        wheels: newValue ? false : formData.wheels,
        rims: newValue ? false : formData.rims,
        lugs: newValue ? false : formData.lugs,
        tires: newValue ? false : formData.tires,
        tireChains: newValue ? false : formData.tireChains,

        wheelsDetails: newValue ? "" : formData.wheelsDetails,
        rimsDetails: newValue ? "" : formData.rimsDetails,
        lugsDetails: newValue ? "" : formData.lugsDetails,
        tiresDetails: newValue ? "" : formData.tiresDetails,
        tireChainsDetails: newValue ? "" : formData.tireChainsDetails,
      });
    } else {
      const isUnchecking = formData[field];
      const detailsField = `${field}Details`;
      setFormData({
        ...formData,
        [field]: !formData[field],
        allFunctioning: false,
        ...(isUnchecking && {
          [detailsField]: "",
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

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {progressSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index <= 5
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
      <Header
        title="Wheels & Tires"
        subtitle="Check to ensure that all are functioning."
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Wheels and Tires includes: Wheels, Rims, Lugs, Tires, Lugs, Tire
          Chains
        </Text>

        {renderProgressBar()}

        <Text style={styles.sectionTitle}>
          Check any components that need repairs or attention
        </Text>
        <View style={styles.sectionDivider} />

        <View style={styles.checkboxContainer}>
          <CustomCheckbox
            checked={formData.allFunctioning}
            onPress={() => handleCheckboxToggle("allFunctioning")}
            label="All Functioning"
          />

          <CustomCheckbox
            checked={formData.wheels}
            onPress={() => handleCheckboxToggle("wheels")}
            label="Wheels"
          />

          <CustomCheckbox
            checked={formData.rims}
            onPress={() => handleCheckboxToggle("rims")}
            label="Rims"
          />

          <CustomCheckbox
            checked={formData.lugs}
            onPress={() => handleCheckboxToggle("lugs")}
            label="Lugs"
          />

          <CustomCheckbox
            checked={formData.tires}
            onPress={() => handleCheckboxToggle("tires")}
            label="Tires"
          />

          <CustomCheckbox
            checked={formData.tireChains}
            onPress={() => handleCheckboxToggle("tireChains")}
            label="Tire Chains"
          />
        </View>

        {formData.wheels && (
          <CustomInput
            label="Wheels Details"
            placeholder="Enter Wheels Details"
            value={formData.wheelsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, wheelsDetails: text })
            }
            icon={
              <Ionicons name="car-sport-outline" size={20} color="#082640" />
            }
          />
        )}
        {formData.rims && (
          <CustomInput
            label="Rims Details"
            placeholder="Enter Rim Details"
            value={formData.rimsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, rimsDetails: text })
            }
            icon={<Ionicons name="disc-outline" size={20} color="#082640" />}
          />
        )}
        {formData.lugs && (
          <CustomInput
            label="Lugs Details"
            placeholder="Enter Lugs Details"
            value={formData.lugsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, lugsDetails: text })
            }
            icon={<Ionicons name="ellipse-outline" size={20} color="#082640" />}
          />
        )}
        {formData.tires && (
          <CustomInput
            label="Tires Details"
            placeholder="Enter Tires Details"
            value={formData.tiresDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, tiresDetails: text })
            }
            icon={
              <Ionicons
                name="radio-button-on-outline"
                size={20}
                color="#082640"
              />
            }
          />
        )}
        {formData.tireChains && (
          <CustomInput
            label="Tire Chains Details"
            placeholder="Enter Tire Chains Details"
            value={formData.tireChainsDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, tireChainsDetails: text })
            }
            icon={<Ionicons name="link-outline" size={20} color="#082640" />}
          />
        )}

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={!isAnyChecked || !areDetailsValid}
        />
      </ScrollView>

      <BottomTabBar activeTab="Home" />
    </SafeAreaView>
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
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#666",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#082640",
    borderColor: "#082640",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 10,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: "#E2DFDFFF",
    marginVertical: 10,
    marginBottom: 20,
  },
});
