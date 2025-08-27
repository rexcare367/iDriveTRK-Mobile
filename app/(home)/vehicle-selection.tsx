import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import { clockIn, selectVehicle } from "../../redux/actions/driverActions";
import { IVehicle } from "../../redux/types";
import { api } from "../../utils";

const VehicleSelectionScreen = () => {
  const dispatch = useDispatch();
  const { clockInFormData } = useSelector((state: any) => state.driver);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [search, setSearch] = useState("");
  const [expandedVehicleIds, setExpandedVehicleIds] = useState<string[]>([]);

  const handleToggleSpecs = (vehicleId: string) => {
    setExpandedVehicleIds((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
  };

  const handleConfirmVehicle = async () => {
    if (selectedVehicle) {
      const formData = {
        ...clockInFormData,
        truck_id: selectedVehicle?.id,
        status: "clockIn",
      };
      console.log("handleConfirmVehicle formData", formData);
      dispatch(clockIn(formData));

      try {
        await api.post("api/timesheets", formData);

        // Update schedule status to 'running'
        await api.patch(`api/schedules/${clockInFormData.schedule_id}`, {
          status: "running",
        });
      } catch (error) {
        console.error("Failed to store clock-in status:", error);
        throw error;
      }

      dispatch(selectVehicle(selectedVehicle));
      router.push("/(home)/(pre-trip)/pre-trip-screen");
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get(
          `/api/trucks?scheduler_id=${clockInFormData.scheduler_id}`
        );
        setVehicles(res.data);
      } catch (err) {
        setError("Failed to load vehicles. Please try again.");
        console.error("Error fetching vehicles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // console.log("vehicles", vehicles);

  return (
    <View style={styles.container}>
      <BackgroundEffects />

      <Header
        title="Confirm Vehicle"
        subtitle="Choose to confirm Vehicle or not"
      />

      <View style={styles.content}>
        <View style={styles.confirmButtonContainer}>
          <TouchableOpacity
            style={[
              styles.confirmButtonOuter,
              { opacity: selectedVehicle ? 1 : 0.5 },
            ]}
            onPress={handleConfirmVehicle}
            disabled={!selectedVehicle}
          >
            <View style={styles.confirmButtonInner}>
              <Text style={styles.confirmButtonText}>Confirm Vehicle</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Available Trucks</Text>
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={18}
            color="#666"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, make, model, unit number..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#082640" />
            <Text style={styles.loadingText}>Loading vehicles...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : vehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vehicles available</Text>
          </View>
        ) : (
          <ScrollView style={styles.vehicleList}>
            {vehicles
              .filter((vehicle) => {
                const q = search.toLowerCase();
                return (
                  (vehicle.name && vehicle.name.toLowerCase().includes(q)) ||
                  (vehicle.make && vehicle.make.toLowerCase().includes(q)) ||
                  (vehicle.model && vehicle.model.toLowerCase().includes(q)) ||
                  (vehicle.unit_number &&
                    vehicle.unit_number.toLowerCase().includes(q))
                );
              })
              .map((vehicle, idx) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    selectedVehicle?.id === vehicle.id
                      ? styles.selectedVehicleCard
                      : null,
                  ]}
                  onPress={() => handleVehicleSelect(vehicle)}
                  activeOpacity={0.9}
                >
                  <View style={styles.vehicleInfoRow}>
                    <Image
                      source={{ uri: vehicle.photo }}
                      style={styles.vehicleImage}
                    />
                    <View style={styles.vehicleMainDetails}>
                      <Text style={styles.vehicleName}>
                        {vehicle.name || vehicle.make || vehicle.model || "-"}
                      </Text>
                      <View style={styles.vehicleMainSpecs}>
                        <View style={styles.vehicleMainSpecItem}>
                          <Feather name="hash" size={16} color="#666" />
                          <Text style={styles.vehicleMainSpecLabel}>Unit:</Text>
                          <Text style={styles.vehicleMainSpecValue}>
                            {vehicle.unit_number || "-"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.specsToggleButton}
                      onPress={(e) => {
                        e.stopPropagation && e.stopPropagation();
                        handleToggleSpecs(vehicle.id);
                      }}
                    >
                      <Feather
                        name={
                          expandedVehicleIds.includes(vehicle.id)
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={22}
                        color="#082640"
                      />
                    </TouchableOpacity>
                  </View>
                  {expandedVehicleIds.includes(vehicle.id) && (
                    <View style={styles.vehicleOtherSpecsGrid}>
                      <View style={styles.vehicleSpecRow}>
                        <Feather name="settings" size={16} color="#666" />
                        <Text style={styles.vehicleSpecLabel}>Model:</Text>
                        <Text style={styles.vehicleSpecValue}>
                          {vehicle.model || "-"}
                        </Text>
                      </View>
                      <View style={styles.vehicleSpecRow}>
                        <Feather name="key" size={16} color="#666" />
                        <Text style={styles.vehicleSpecLabel}>VIN:</Text>
                        <Text style={styles.vehicleSpecValue}>
                          {vehicle.vin_number || "-"}
                        </Text>
                      </View>
                      <View style={styles.vehicleSpecRow}>
                        <Feather name="cpu" size={16} color="#666" />
                        <Text style={styles.vehicleSpecLabel}>
                          Lytx Serial:
                        </Text>
                        <Text style={styles.vehicleSpecValue}>
                          {vehicle.lytx_serial || "-"}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
      </View>

      <BottomTabBar activeTab="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  specsToggleButton: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#e6f0fa",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  vehicleInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  vehicleMainDetails: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 15,
  },
  vehicleMainSpecs: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  vehicleMainSpecItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },
  vehicleMainSpecLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: 6,
    minWidth: 60,
  },
  vehicleMainSpecValue: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    fontWeight: "400",
  },
  vehicleOtherSpecsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
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
    flex: 1,
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
    marginBottom: 30,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  vehicleImage: {
    width: 80,
    height: 50,
  },
  vehicleIndex: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#082640",
    marginRight: 10,
    width: 30,
    textAlign: "right",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
  },
  vehicleList: {
    flex: 1,
  },
  vehicleCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedVehicleCard: {
    borderColor: "#082640",
    borderWidth: 2,
    backgroundColor: "#e6f0fa",
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleDetails: {
    marginLeft: 15,
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  vehicleSpecs: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleSpecsGrid: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginTop: 4,
    marginBottom: 4,
  },
  vehicleSpecRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 2,
  },
  vehicleSpecLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: 6,
    minWidth: 100,
  },
  vehicleSpecValue: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontWeight: "400",
  },
  vehicleSpec: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  vehicleSpecText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
});

export default VehicleSelectionScreen;
