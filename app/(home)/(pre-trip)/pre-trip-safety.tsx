import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import CustomButton from "@/components/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox";
import CustomInput from "@/components/CustomInput";
import CustomRadioButton from "@/components/CustomRadioButton";
import Header from "@/components/Header";
import { updatePreTripForm } from "@/redux/actions/driverActions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const PreTripFormSafety = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  // Helper function to get safety inspection data from the new structure
  const getSafetyInspection = () => {
    const inspection = preTripFormData?.inspection || [];
    return inspection.find((item: any) => item.type === "safety");
  };

  const safetyInspection = getSafetyInspection();

  const [formData, setFormData] = useState({
    allFunctioning: safetyInspection?.allFunctioning ?? true,
    fireExtinguisher: safetyInspection?.items?.find((item: any) => item.name === "fireExtinguisher")?.status === "missing" || false,
    flagsFlares: safetyInspection?.items?.find((item: any) => item.name === "flagsFlares")?.status === "missing" || false,
    reflectiveTriangles: safetyInspection?.items?.find((item: any) => item.name === "reflectiveTriangles")?.status === "missing" || false,
    fireExtinguisherDetails: safetyInspection?.items?.find((item: any) => item.name === "fireExtinguisher")?.details || "",
    flagsFlaresDetails: safetyInspection?.items?.find((item: any) => item.name === "flagsFlares")?.details || "",
    reflectiveTrianglesDetails: safetyInspection?.items?.find((item: any) => item.name === "reflectiveTriangles")?.details || "",
    others: safetyInspection?.items?.find((item: any) => item.name === "others")?.status || "noOtherNotes",
    othersDefectDetails: safetyInspection?.items?.find((item: any) => item.name === "others")?.details || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.fireExtinguisher ||
    formData.flagsFlares ||
    formData.reflectiveTriangles;

  const areDetailsValid =
    (!formData.fireExtinguisher ||
      formData.fireExtinguisherDetails.trim() !== "") &&
    (!formData.flagsFlares || formData.flagsFlaresDetails.trim() !== "") &&
    (!formData.reflectiveTriangles ||
      formData.reflectiveTrianglesDetails.trim() !== "") &&
    (formData.others !== "defective" ||
      formData.othersDefectDetails.trim() !== "");

  const isNextDisabled = !isAnyChecked || !areDetailsValid;

  const handleNext = () => {
    // Transform the form data into the new inspection structure
    const safetyInspectionData = {
      type: "safety",
      allFunctioning: formData.allFunctioning,
      items: [
        {
          name: "fireExtinguisher",
          status: formData.fireExtinguisher ? "missing" : "normal",
          details: formData.fireExtinguisherDetails
        },
        {
          name: "flagsFlares",
          status: formData.flagsFlares ? "missing" : "normal",
          details: formData.flagsFlaresDetails
        },
        {
          name: "reflectiveTriangles",
          status: formData.reflectiveTriangles ? "missing" : "normal",
          details: formData.reflectiveTrianglesDetails
        },
        {
          name: "others",
          status: formData.others,
          details: formData.othersDefectDetails
        }
      ]
    };

    // Update the inspection array in preTripFormData
    const existingInspection = preTripFormData?.inspection || [];
    const updatedInspection = existingInspection.filter((item: any) => item.type !== "safety");
    updatedInspection.push(safetyInspectionData);

    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        inspection: updatedInspection,
      })
    );
    router.push("/pre-trip-trailer");
  };

  const handleCheckboxToggle = (field: string) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        fireExtinguisher: newValue ? false : formData.fireExtinguisher,
        flagsFlares: newValue ? false : formData.flagsFlares,
        reflectiveTriangles: newValue ? false : formData.reflectiveTriangles,
        fireExtinguisherDetails: newValue
          ? ""
          : formData.fireExtinguisherDetails,
        flagsFlaresDetails: newValue ? "" : formData.flagsFlaresDetails,
        reflectiveTrianglesDetails: newValue
          ? ""
          : formData.reflectiveTrianglesDetails,
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

  const handleRadioToggle = (value) => {
    // Map "requiresRepair" to "defective" for consistency
    const statusValue = value === "requiresRepair" ? "defective" : value;
    setFormData({
      ...formData,
      others: statusValue,
      othersDefectDetails:
        statusValue === "defective" ? formData.othersDefectDetails : "",
    });
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
              index <= 10
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
        title="Safety Equipment"
        subtitle="Check to ensure that all are functioning."
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Safety Equipment includes: Fire Extinguisher, Flags - Flares - Fuses,
          Reflective Triangles
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
            style={{ marginBottom: 10 }}
          />
          <CustomCheckbox
            checked={formData.fireExtinguisher}
            onPress={() => handleCheckboxToggle("fireExtinguisher")}
            label="Fire Extinguisher"
            style={{ marginBottom: 10 }}
          />
          <CustomCheckbox
            checked={formData.flagsFlares}
            onPress={() => handleCheckboxToggle("flagsFlares")}
            label="Flags - Flares - Fuses"
            style={{ marginBottom: 10 }}
          />
          <CustomCheckbox
            checked={formData.reflectiveTriangles}
            onPress={() => handleCheckboxToggle("reflectiveTriangles")}
            label="Reflective Triangles"
            style={{ marginBottom: 10 }}
          />
        </View>

        {formData.fireExtinguisher && (
          <CustomInput
            label="Fire Extinguisher Details"
            placeholder="Enter Fire Extinguisher Details"
            value={formData.fireExtinguisherDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, fireExtinguisherDetails: text })
            }
            icon={<Ionicons name="flame-outline" size={20} color="#082640" />}
          />
        )}
        {formData.flagsFlares && (
          <CustomInput
            label="Flags - Flares - Fuses Details"
            placeholder="Enter Flags - Flares - Fuses Details"
            value={formData.flagsFlaresDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, flagsFlaresDetails: text })
            }
            icon={<Ionicons name="flag-outline" size={20} color="#082640" />}
          />
        )}
        {formData.reflectiveTriangles && (
          <CustomInput
            label="Reflective Triangles Details"
            placeholder="Enter Reflective Triangles Details"
            value={formData.reflectiveTrianglesDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, reflectiveTrianglesDetails: text })
            }
            icon={
              <Ionicons name="triangle-outline" size={20} color="#082640" />
            }
          />
        )}

        <View style={styles.radioSection}>
          <Text style={styles.radioLabel}>
            Others<Text style={{ color: "#B70101" }}>*</Text>
          </Text>
          <View style={styles.radioGroup}>
            <CustomRadioButton
              label="No Other Notes"
              selected={formData.others === "noOtherNotes"}
              onPress={() => handleRadioToggle("noOtherNotes")}
              style={styles.radioOption}
              labelStyle={styles.radioText}
            />
            <CustomRadioButton
              label="Requires Repair"
              selected={formData.others === "defective"}
              onPress={() => handleRadioToggle("requiresRepair")}
              style={styles.radioOption}
              labelStyle={styles.radioText}
            />
          </View>
          {formData.others === "defective" && (
            <CustomInput
              label="Other Defect Details"
              placeholder="Enter details for other defect"
              value={formData.othersDefectDetails}
              onChangeText={(text: string) =>
                setFormData({ ...formData, othersDefectDetails: text })
              }
              icon={
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#B70101"
                />
              }
            />
          )}
        </View>

        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={isNextDisabled}
        />
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
  radioSection: {
    marginVertical: 15,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioText: {
    fontSize: 14,
  },
});

export default PreTripFormSafety;
