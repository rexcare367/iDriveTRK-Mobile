import { useEffect, useState } from "react";
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import TripStatsContainer from "../../components/TripStatsContainer";
import { fetchPayPeriods } from "../../redux/actions/payrollActions";
import AssignedTripsScreen from "./assigned-trips";
import TripCompleteHistoryScreen from "./trip-complete-history";

import moment from "moment";

type ViewType = 'assigned' | 'completed';

export default function TripsIndex() {
  const dispatch = useDispatch();
  const { user, currentScheduler } = useSelector((state: any) => state.auth);
  const { payPeriods, payPeriodsLoading, payPeriodsError } = useSelector((state: any) => state.payroll);
  const [currentView, setCurrentView] = useState<ViewType>('assigned');
  const [selectedPayPeriodId, setSelectedPayPeriodId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (currentScheduler) {
      dispatch(fetchPayPeriods(currentScheduler) as any);
    }
  }, [dispatch, currentScheduler]);

  // Set default selected pay-period to the first one when pay-periods are loaded
  useEffect(() => {
    if (payPeriods && payPeriods.length > 0 && !selectedPayPeriodId) {
      setSelectedPayPeriodId((payPeriods[0] as any).id);
    }
  }, [payPeriods, selectedPayPeriodId]);

  const selectedPayPeriod = payPeriods?.find((pp: any) => pp.id === selectedPayPeriodId);

  const handlePayPeriodSelect = (payPeriodId: string) => {
    setSelectedPayPeriodId(payPeriodId);
    closeModal();
  };

  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
    });
  };

  const handleCompleteHistory = () => {
    setCurrentView('completed');
  };

  const handleAssignedTrip = () => {
    setCurrentView('assigned');
  };

  // Default dashboard view
  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />

      <Header title="Trips" subtitle="Manage your trips" />

      <View style={styles.content}>
        {/* Pay Period Selector */}
        <View style={styles.payPeriodContainer}>
          <TouchableOpacity
            style={styles.payPeriodButton}
            onPress={openModal}
            activeOpacity={0.7}
          >
            <View style={styles.payPeriodButtonContent}>
              <Text style={styles.payPeriodButtonText}>
                {payPeriodsLoading ? (
                  'Loading...'
                ) : selectedPayPeriod ? (
                  `${moment(selectedPayPeriod.start_date).format("MMM D")} - ${moment(selectedPayPeriod.end_date).format("MMM D, YYYY")}`
                ) : (
                  'Select Pay Period'
                )}
              </Text>
              {selectedPayPeriod?.status === 'active' && (
                <View style={styles.activeIndicator}>
                  <Text style={styles.activeText}>Active</Text>
                </View>
              )}
            </View>
            <View style={styles.dropdownIcon}>
              <Text style={styles.dropdownIconText}>▼</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TripStatsContainer
          onCompleteHistoryPress={handleCompleteHistory}
          onAssignedTripPress={handleAssignedTrip}
          variant={currentView === 'completed' ? "default" : "reversed"}
          selectedPayPeriod={selectedPayPeriod}
        />
        {
          currentView === 'assigned' && (
            <AssignedTripsScreen
              payPeriods={payPeriods}
              payPeriodsLoading={payPeriodsLoading}
              payPeriodsError={payPeriodsError}
              selectedPayPeriod={selectedPayPeriod}
            />
          )
        }
         {
          currentView === 'completed' && (
            <TripCompleteHistoryScreen
              payPeriods={payPeriods}
              payPeriodsLoading={payPeriodsLoading}
              payPeriodsError={payPeriodsError}
              selectedPayPeriod={selectedPayPeriod}
            />
          )
        }
      </View>

      {/* Pay Period Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: modalAnimation,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      translateY: modalAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Pay Period</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {payPeriodsLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading pay periods...</Text>
                  </View>
                ) : payPeriods && payPeriods.length > 0 ? (
                  payPeriods.map((payPeriod: any) => {
                    const isSelected = selectedPayPeriodId === payPeriod.id;
                    const startDate = moment(payPeriod.start_date).format("MMM D");
                    const endDate = moment(payPeriod.end_date).format("MMM D, YYYY");

                    return (
                      <TouchableOpacity
                        key={payPeriod.id}
                        style={[
                          styles.payPeriodOption,
                          isSelected && styles.payPeriodOptionSelected,
                        ]}
                        onPress={() => handlePayPeriodSelect(payPeriod.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.payPeriodOptionContent}>
                          <View style={styles.payPeriodOptionTextContainer}>
                            <Text
                              style={[
                                styles.payPeriodOptionTitle,
                                isSelected && styles.payPeriodOptionTitleSelected,
                              ]}
                            >
                              {startDate} - {endDate}
                            </Text>
                            {payPeriod.status === 'active' && (
                              <View style={styles.payPeriodOptionStatus}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>Active</Text>
                              </View>
                            )}
                          </View>
                          {isSelected && (
                            <View style={styles.checkIcon}>
                              <Text style={styles.checkIconText}>✓</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No pay periods available</Text>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      <BottomTabBar activeTab="Trips" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#082640",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  quickActions: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#082640",
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "48%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    backgroundColor: "#E8F4FD",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#082640",
    marginBottom: 4,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  // Pay Period Selector Styles
  payPeriodContainer: {
    marginTop: 10,
  },
  payPeriodLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#082640",
  },
  payPeriodButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  payPeriodButtonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  payPeriodButtonText: {
    fontSize: 16,
    color: "#082640",
    fontWeight: "500",
    flex: 1,
  },
  activeIndicator: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  activeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  dropdownIconText: {
    fontSize: 12,
    color: "#666",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    minHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#082640",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "400",
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  payPeriodOption: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  payPeriodOptionSelected: {
    backgroundColor: "#F8F9FF",
    borderColor: "#082640",
    borderWidth: 2,
  },
  payPeriodOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  payPeriodOptionTextContainer: {
    flex: 1,
  },
  payPeriodOptionTitle: {
    fontSize: 16,
    color: "#082640",
    fontWeight: "500",
    marginBottom: 4,
  },
  payPeriodOptionTitleSelected: {
    color: "#082640",
    fontWeight: "600",
  },
  payPeriodOptionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#082640",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIconText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
