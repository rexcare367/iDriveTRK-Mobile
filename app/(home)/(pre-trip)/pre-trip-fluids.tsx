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
import { useDispatch, useSelector } from "react-redux";

const PreTripFormFluids = () => {
  const dispatch = useDispatch();
  const { preTripFormData } = useSelector((state: any) => state.driver);

  const [formData, setFormData] = useState<any>({
    allFunctioning: preTripFormData?.fluids?.allFunctioning || true,
    frameAssembly: preTripFormData?.fluids?.frameAssembly || false,
    frontAxle: preTripFormData?.fluids?.frontAxle || false,
    driveLine: preTripFormData?.fluids?.driveLine || false,
    frameAssemblyDetails: preTripFormData?.fluids?.frameAssemblyDetails || "",
    frontAxleDetails: preTripFormData?.fluids?.frontAxleDetails || "",
    driveLineDetails: preTripFormData?.fluids?.driveLineDetails || "",
    suspensionSystem: preTripFormData?.fluids?.suspensionSystem || "normal",
    steering: preTripFormData?.fluids?.steering || "normal",
    suspensionSystemDefectDetails:
      preTripFormData?.fluids?.suspensionSystemDefectDetails || "",
    steeringDefectDetails: preTripFormData?.fluids?.steeringDefectDetails || "",
  });

  const isAnyChecked =
    formData.allFunctioning ||
    formData.frameAssembly ||
    formData.frontAxle ||
    formData.driveLine;

  const areDetailsValid =
    (!formData.frameAssembly || formData.frameAssemblyDetails.trim() !== "") &&
    (!formData.frontAxle || formData.frontAxleDetails.trim() !== "") &&
    (!formData.driveLine || formData.driveLineDetails.trim() !== "") &&
    (formData.suspensionSystem !== "repair" ||
      formData.suspensionSystemDefectDetails.trim() !== "") &&
    (formData.steering !== "repair" ||
      formData.steeringDefectDetails.trim() !== "");

  const isNextDisabled = !isAnyChecked || !areDetailsValid;

  const handleNext = () => {
    dispatch(
      updatePreTripForm({
        ...preTripFormData,
        fluids: formData,
      })
    );
    router.push("/pre-trip-wheels");
  };

  const handleCheckboxToggle = (field: string) => {
    if (field === "allFunctioning") {
      const newValue = !formData.allFunctioning;
      setFormData({
        ...formData,
        allFunctioning: newValue,
        frameAssembly: newValue ? false : formData.frameAssembly,
        frontAxle: newValue ? false : formData.frontAxle,
        driveLine: newValue ? false : formData.driveLine,
        frameAssemblyDetails: newValue ? "" : formData.frameAssemblyDetails,
        frontAxleDetails: newValue ? "" : formData.frontAxleDetails,
        driveLineDetails: newValue ? "" : formData.driveLineDetails,
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

  const handleRadioToggle = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
      ...(field === "suspensionSystem" && value === "normal"
        ? { suspensionSystemDefectDetails: "" }
        : {}),
      ...(field === "steering" && value === "normal"
        ? { steeringDefectDetails: "" }
        : {}),
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
              index <= 4
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
        title="Fluid Levels & Leaks"
        subtitle="Check to ensure that all are functioning."
      />

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Check for Frame & Assembly, Front Axle / A-Frame, Drive Line
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
            checked={formData.frameAssembly}
            onPress={() => handleCheckboxToggle("frameAssembly")}
            label="Frame Assembly"
            style={{ marginBottom: 10 }}
          />
          <CustomCheckbox
            checked={formData.frontAxle}
            onPress={() => handleCheckboxToggle("frontAxle")}
            label="Front Axle/A-Frame"
            style={{ marginBottom: 10 }}
          />
          <CustomCheckbox
            checked={formData.driveLine}
            onPress={() => handleCheckboxToggle("driveLine")}
            label="Drive Line"
            style={{ marginBottom: 10 }}
          />
        </View>

        {formData.frameAssembly && (
          <CustomInput
            label="Frame Assembly Details"
            placeholder="Enter Frame Assembly Details"
            value={formData.frameAssemblyDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, frameAssemblyDetails: text })
            }
            icon={<Ionicons name="build-outline" size={20} color="#082640" />}
          />
        )}
        {formData.frontAxle && (
          <CustomInput
            label="Front Axle/A-Frame Details"
            placeholder="Enter Front Axle/A-Frame Details"
            value={formData.frontAxleDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, frontAxleDetails: text })
            }
            icon={<Ionicons name="car-outline" size={20} color="#082640" />}
          />
        )}
        {formData.driveLine && (
          <CustomInput
            label="Drive Line Details"
            placeholder="Enter Drive Line Details"
            value={formData.driveLineDetails}
            onChangeText={(text: string) =>
              setFormData({ ...formData, driveLineDetails: text })
            }
            icon={
              <Ionicons name="settings-outline" size={20} color="#082640" />
            }
          />
        )}

        <View style={styles.radioSection}>
          <Text style={styles.radioLabel}>
            Suspension System<Text style={{ color: "#B70101" }}>*</Text>
          </Text>
          <View style={styles.radioGroup}>
            <CustomRadioButton
              label="Checked - Normal"
              selected={formData.suspensionSystem === "normal"}
              onPress={() => handleRadioToggle("suspensionSystem", "normal")}
              style={styles.radioOption}
              labelStyle={styles.radioText}
            />
            <CustomRadioButton
              label="Requires Repair"
              selected={formData.suspensionSystem === "repair"}
              onPress={() => handleRadioToggle("suspensionSystem", "repair")}
              style={styles.radioOption}
              labelStyle={styles.radioText}
            />
          </View>
          {formData.suspensionSystem === "repair" && (
            <CustomInput
              label="Suspension System Defect Details"
              placeholder="Enter Suspension System Defect Details"
              value={formData.suspensionSystemDefectDetails}
              onChangeText={(text: string) =>
                setFormData({
                  ...formData,
                  suspensionSystemDefectDetails: text,
                })
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
        <View style={styles.radioSection}>
          <Text style={styles.radioLabel}>
            Steering<Text style={{ color: "#B70101" }}>*</Text>
          </Text>
          <View style={styles.radioGroup}>
            <CustomRadioButton
              label="Checked - Normal"
              selected={formData.steering === "normal"}
              onPress={() => handleRadioToggle("steering", "normal")}
              style={styles.radioOption}
              labelStyle={styles.radioText}
            />
            <CustomRadioButton
              label="Requires Repair"
              selected={formData.steering === "repair"}
              onPress={() => handleRadioToggle("steering", "repair")}
              style={styles.radioOption}
              labelStyle={styles.radioText}
            />
          </View>
          {formData.steering === "repair" && (
            <CustomInput
              label="Steering Defect Details"
              placeholder="Enter Steering Defect Details"
              value={formData.steeringDefectDetails}
              onChangeText={(text: string) =>
                setFormData({ ...formData, steeringDefectDetails: text })
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
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#082640",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#082640",
  },
  radioText: {
    fontSize: 14,
  },
});

export default PreTripFormFluids;
