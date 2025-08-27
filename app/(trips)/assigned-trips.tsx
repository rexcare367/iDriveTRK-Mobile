import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import TripStatsContainer from "../../components/TripStatsContainer";
import { api } from "../../utils";

export default function AssignedTripsScreen() {
  const { user } = useSelector((state: any) => state.auth);
  const [activeView, setActiveView] = useState("day");
  const [weekScrollReady, setWeekScrollReady] = useState(false);

  // API state
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [startTime, setStartTime] = useState<string>(moment().toISOString());
  const [endTime, setEndTime] = useState<string>(
    moment().add(1, "day").toISOString()
  );

  const dayScrollRef = useRef(null);
  const weekScrollRef = useRef(null);

  // Ensure refs are properly initialized
  // useEffect(() => {
  //   // Small delay to ensure refs are attached
  //   const timer = setTimeout(() => {
  //     try {
  //       if (
  //         dayScrollRef.current &&
  //         activeView === "day" &&
  //         daysInMonth.length > 0
  //       ) {
  //         const todayIndex = daysInMonth.findIndex(
  //           (d) => d.format("YYYY-MM-DD") === today.format("YYYY-MM-DD")
  //         );
  //         if (todayIndex !== -1) {
  //           dayScrollRef.current.scrollTo({
  //             x: todayIndex * 64,
  //             animated: true,
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       console.warn("Error scrolling to today:", error);
  //     }
  //   }, 200);

  //   return () => clearTimeout(timer);
  // }, [activeView, daysInMonth, today]);

  const today = useMemo(() => moment(), []);
  const [currentMonth, setCurrentMonth] = useState(
    today.clone().startOf("month")
  );

  const [selectedDay, setSelectedDay] = useState(today.format("YYYY-MM-DD"));
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  // Calculate days in month
  const daysInMonth = useMemo(() => {
    const days = [];
    const startOfMonth = currentMonth.clone().startOf("month");
    const endOfMonth = currentMonth.clone().endOf("month");

    for (
      let m = startOfMonth.clone();
      m.isSameOrBefore(endOfMonth);
      m.add(1, "day")
    ) {
      days.push(m.clone());
    }
    return days;
  }, [currentMonth]);

  // Calculate weeks in month
  const weeksInMonth = useMemo(() => {
    const weeks = [];
    const currentMonthStart = today.clone().startOf("month");
    const currentMonthEnd = today.clone().endOf("month");

    let start = currentMonthStart.clone().startOf("week");
    const end = currentMonthEnd.clone().endOf("week");

    while (start.isSameOrBefore(end)) {
      const weekStart = start.clone();
      const weekEnd = start.clone().endOf("week");

      weeks.push({
        label: `${weekStart.format("MMM D")} - ${weekEnd.format("D")}`,
        start: weekStart,
        end: weekEnd,
      });

      start.add(1, "week");
    }

    return weeks;
  }, [today]);

  const currentWeekIndex = useMemo(() => {
    return weeksInMonth.findIndex((week) =>
      today.isBetween(week.start, week.end, "day", "[]")
    );
  }, [weeksInMonth, today]);

  // Fetch schedules from API
  const fetchSchedules = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      console.log("startTime, endTime, user.id", startTime, endTime, user.id);
      const response = await api.get(
        `/api/schedules?user_id=${user.id}&start_time=${encodeURIComponent(
          startTime
        )}&end_time=${encodeURIComponent(endTime)}&status=scheduled`
      );
      console.log("Schedules response:", response.data);
      setSchedules(response.data || []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  // Initialize date range on component mount
  useEffect(() => {
    if (activeView === "day") {
      const selectedDate = moment(selectedDay);
      const start = selectedDate
        .clone()
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const end = selectedDate
        .clone()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      setStartTime(start);
      setEndTime(end);
    } else if (activeView === "week" && weeksInMonth.length > 0) {
      const selectedWeek = weeksInMonth[selectedWeekIndex];
      if (selectedWeek) {
        const start = selectedWeek.start
          .clone()
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        const end = selectedWeek.end
          .clone()
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss");

        setStartTime(start);
        setEndTime(end);
      }
    }
  }, [activeView, selectedDay, selectedWeekIndex, weeksInMonth]);

  useEffect(() => {
    fetchSchedules();
  }, [user?.id, startTime, endTime]);

  useEffect(() => {
    if (currentWeekIndex !== -1 && weeksInMonth.length > 0) {
      setSelectedWeekIndex(currentWeekIndex);
      setTimeout(() => setWeekScrollReady(true), 50);
    }
  }, [currentWeekIndex, weeksInMonth]);

  // useEffect(() => {
  //   if (dayScrollRef.current && daysInMonth.length > 0) {
  //     const todayIndex = daysInMonth.findIndex(
  //       (d) => d.format("YYYY-MM-DD") === today.format("YYYY-MM-DD")
  //     );
  //     if (todayIndex !== -1) {
  //       setTimeout(() => {
  //         if (dayScrollRef.current) {
  //           dayScrollRef.current.scrollTo({
  //             x: todayIndex * 64,
  //             animated: true,
  //           });
  //         }
  //       }, 100);
  //     }
  //   }
  // }, [dayScrollRef, daysInMonth, today]);

  // useEffect(() => {
  //   if (weekScrollReady && weekScrollRef.current) {
  //     setTimeout(() => {
  //       try {
  //         if (weekScrollRef.current) {
  //           weekScrollRef.current.scrollTo({
  //             x: selectedWeekIndex * 100,
  //             animated: true,
  //           });
  //         }
  //       } catch (error) {
  //         console.warn("Error scrolling to selected week:", error);
  //       }
  //     }, 100);
  //   }
  // }, [weekScrollReady, selectedWeekIndex]);

  // Additional safety check for week scroll
  // useEffect(() => {
  //   if (
  //     activeView === "week" &&
  //     weekScrollRef.current &&
  //     selectedWeekIndex >= 0
  //   ) {
  //     const timer = setTimeout(() => {
  //       try {
  //         if (weekScrollRef.current) {
  //           weekScrollRef.current.scrollTo({
  //             x: selectedWeekIndex * 100,
  //             animated: true,
  //           });
  //         }
  //       } catch (error) {
  //         console.warn(
  //           "Error scrolling to selected week (additional check):",
  //           error
  //         );
  //       }
  //     }, 200);

  //     return () => clearTimeout(timer);
  //   }
  // }, [activeView, selectedWeekIndex]);

  const getTripsForSelectedDay = () => {
    if (!schedules || schedules.length === 0) return [];

    const selectedDate = moment(selectedDay);
    return schedules
      .filter((schedule) => {
        try {
          const scheduleDate = moment(
            schedule.start_time || schedule.date || schedule.scheduled_date
          );
          return scheduleDate.isSame(selectedDate, "day");
        } catch (error) {
          console.error("Error parsing schedule date:", error);
          return false;
        }
      })
      .map((schedule) => {
        try {
          const startTime = moment(schedule.start_time || schedule.start_date);
          const endTime = moment(schedule.end_time || schedule.end_date);

          return {
            id: schedule.id,
            name: schedule.job.name,
            time: `${startTime.format("hh:mma")} - ${endTime.format("hh:mma")}`,
            stops:
              schedule.stops ||
              schedule.locations ||
              schedule.destinations ||
              [],
            distance: schedule.job.driving_distance + " km" || "N/A",
            duration:
              moment(schedule.end_time).diff(schedule.start_time, "minutes") +
                " mins" || "N/A",
            status: schedule.status || "Scheduled",
          };
        } catch (error) {
          console.error("Error processing schedule:", error, schedule);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries
  };

  const getTripsForSelectedWeek = () => {
    if (!schedules || schedules.length === 0) return [];

    const selectedWeek = weeksInMonth[selectedWeekIndex];
    if (!selectedWeek) return [];

    return schedules
      .filter((schedule) => {
        try {
          const scheduleDate = moment(
            schedule.start_time || schedule.date || schedule.scheduled_date
          );
          return scheduleDate.isBetween(
            selectedWeek.start,
            selectedWeek.end,
            "day",
            "[]"
          );
        } catch (error) {
          console.error("Error parsing schedule date:", error);
          return false;
        }
      })
      .map((schedule) => {
        try {
          const startTime = moment(schedule.start_time || schedule.start_date);
          const endTime = moment(schedule.end_time || schedule.end_date);

          return {
            id: schedule.id,
            name: schedule.job.name,
            date: moment(schedule.start_time).format("MMM D"),
            time: `${startTime.format("hh:mma")} - ${endTime.format("hh:mma")}`,
            stops: schedule.stops || [],
            distance: schedule.job.driving_distance + " km" || "N/A",
            duration:
              moment(endTime).diff(startTime, "minutes") + " mins" || "N/A",
            status: schedule.status,
          };
        } catch (error) {
          console.error("Error processing schedule:", error, schedule);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries
  };

  const handleTripSelect = (trip: any) => {
    router.push({
      pathname: "/(home)/trip-details",
      params: { tripId: trip.id },
    });
  };

  const handleViewChange = (view: any) => {
    setActiveView(view);

    // Update date range when switching views
    if (view === "day") {
      const selectedDate = moment(selectedDay);
      const start = selectedDate
        .clone()
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const end = selectedDate
        .clone()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      setStartTime(start);
      setEndTime(end);
    } else if (view === "week") {
      const selectedWeek = weeksInMonth[selectedWeekIndex];
      if (selectedWeek) {
        const start = selectedWeek.start
          .clone()
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        const end = selectedWeek.end
          .clone()
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss");

        setStartTime(start);
        setEndTime(end);
      }
    }
  };

  const handleDaySelect = (day: any) => {
    const selectedDate = moment(day);
    const start = selectedDate
      .clone()
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    const end = selectedDate.clone().endOf("day").format("YYYY-MM-DD HH:mm:ss");

    console.log("Day selected:", day.format("YYYY-MM-DD"));
    console.log("Start time:", start);
    console.log("End time:", end);

    setStartTime(start);
    setEndTime(end);
    setSelectedDay(day.format("YYYY-MM-DD"));
  };

  const handleWeekSelect = (weekIndex: any) => {
    const selectedWeek = weeksInMonth[weekIndex];
    if (selectedWeek) {
      const start = selectedWeek.start
        .clone()
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const end = selectedWeek.end
        .clone()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      console.log("Week selected:", selectedWeek.label);
      console.log("Start time:", start);
      console.log("End time:", end);

      setStartTime(start);
      setEndTime(end);
      setSelectedWeekIndex(weekIndex);
    }
  };

  const renderDailyView = () => {
    const trips = getTripsForSelectedDay();

    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#666" }}>
            Loading schedules...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#e74c3c",
              textAlign: "center",
              marginHorizontal: 20,
            }}
          >
            {error}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>Select Day</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={dayScrollRef}
          >
            {daysInMonth.map((day) => {
              const isBeforeToday = day.isBefore(today, "day");
              const isSelected = day.format("YYYY-MM-DD") === selectedDay;
              return (
                <TouchableOpacity
                  key={day.format("YYYY-MM-DD")}
                  style={[
                    {
                      padding: 10,
                      marginRight: 8,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: isSelected ? "#082640" : "#eee",
                      backgroundColor: isSelected ? "#082640" : "#fff",
                      opacity: isBeforeToday ? 0.4 : 1,
                      minWidth: 56,
                      alignItems: "center",
                    },
                  ]}
                  disabled={isBeforeToday}
                  onPress={() => handleDaySelect(day)}
                >
                  <Text
                    style={{
                      color: isSelected ? "#fff" : "#666",
                      fontWeight: "500",
                    }}
                  >
                    {day.format("ddd")}
                  </Text>
                  <Text
                    style={{
                      color: isSelected ? "#fff" : "#666",
                      fontSize: 16,
                    }}
                  >
                    {day.format("D")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <ScrollView style={styles.tripList}>
          {trips.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
              No trips assigned for this day.
            </Text>
          ) : (
            trips.map((trip: any) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <Text style={styles.tripName}>{trip.name}</Text>
                  <View style={styles.tripStatusContainer}>
                    <Text style={styles.tripStatus}>{trip.status}</Text>
                  </View>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.tripTime}>
                    <Ionicons name="time-outline" size={16} color="#082640" />
                    <Text style={styles.tripTimeText}>{trip.time}</Text>
                  </View>

                  <View style={styles.tripStops}>
                    {trip.stops.map((stop: any, index: number) => (
                      <View key={index} style={styles.tripStop}>
                        <View style={styles.stopDot} />
                        <Text style={styles.stopName}>{stop}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.tripMeta}>
                    <View style={styles.tripMetaItem}>
                      <Ionicons
                        name="speedometer-outline"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.tripMetaText}>{trip.distance}</Text>
                    </View>
                    <View style={styles.tripMetaItem}>
                      <Ionicons
                        name="hourglass-outline"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.tripMetaText}>{trip.duration}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.tripActions}>
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => handleTripSelect(trip)}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  const renderWeekPicker = () => {
    return (
      <View style={{ marginBottom: 16, minHeight: 56 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Select Week</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={weekScrollRef}
        >
          {weeksInMonth.map((week, idx) => {
            const isBeforeCurrent = idx < currentWeekIndex;
            const isSelected = idx === selectedWeekIndex;
            return (
              <TouchableOpacity
                key={week.label}
                style={{
                  padding: 10,
                  marginRight: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: isSelected ? "#082640" : "#eee",
                  backgroundColor: isSelected ? "#082640" : "#fff",
                  opacity: isBeforeCurrent ? 0.4 : 1,
                  minWidth: 90,
                  alignItems: "center",
                }}
                disabled={isBeforeCurrent}
                onPress={() => handleWeekSelect(idx)}
              >
                <Text
                  style={{
                    color: isSelected ? "#fff" : "#666",
                    fontWeight: isSelected ? "600" : "400",
                  }}
                >
                  {week.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderWeeklyView = () => {
    const trips = getTripsForSelectedWeek();

    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#666" }}>
            Loading schedules...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#e74c3c",
              textAlign: "center",
              marginHorizontal: 20,
            }}
          >
            {error}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {renderWeekPicker()}
        <ScrollView style={styles.tripList}>
          {trips.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
              No trips assigned for this week.
            </Text>
          ) : (
            trips.map((trip: any) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View>
                    <Text style={styles.tripName}>{trip.name}</Text>
                    <Text style={styles.tripDate}>{trip.date}</Text>
                  </View>
                  <View style={styles.tripStatusContainer}>
                    <Text style={styles.tripStatus}>{trip.status}</Text>
                  </View>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.tripTime}>
                    <Ionicons name="time-outline" size={16} color="#082640" />
                    <Text style={styles.tripTimeText}>{trip.time}</Text>
                  </View>

                  <View style={styles.tripStops}>
                    {trip.stops.map((stop: any, index: number) => (
                      <View key={index} style={styles.tripStop}>
                        <View style={styles.stopDot} />
                        <Text style={styles.stopName}>{stop}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.tripMeta}>
                    <View style={styles.tripMetaItem}>
                      <Ionicons
                        name="speedometer-outline"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.tripMetaText}>{trip.distance}</Text>
                    </View>
                    <View style={styles.tripMetaItem}>
                      <Ionicons
                        name="hourglass-outline"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.tripMetaText}>{trip.duration}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.tripActions}>
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => handleTripSelect(trip)}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  const handleCompleteHistory = () => {
    router.push("/(trips)/trip-complete-history");
  };

  const handleAssignedTrip = () => {
    router.push("/(trips)/assigned-trips");
  };

  const handleRefresh = () => {
    // Reset date range and fetch all schedules
    setStartTime("");
    setEndTime("");
    fetchSchedules();
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects />

      <Header />

      <View style={styles.content}>
        <TripStatsContainer
          onCompleteHistoryPress={handleCompleteHistory}
          onAssignedTripPress={handleAssignedTrip}
          variant="reversed"
        />

        <View style={styles.viewSelectorContainer}>
          <View style={styles.viewSelector}>
            <TouchableOpacity
              style={[
                styles.viewButton,
                activeView === "day" && styles.viewButtonActive,
              ]}
              onPress={() => handleViewChange("day")}
            >
              <Text
                style={[
                  styles.viewButtonText,
                  activeView === "day" && styles.viewButtonTextActive,
                ]}
              >
                Daily View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewButton,
                activeView === "week" && styles.viewButtonActive,
              ]}
              onPress={() => handleViewChange("week")}
            >
              <Text
                style={[
                  styles.viewButtonText,
                  activeView === "week" && styles.viewButtonTextActive,
                ]}
              >
                Weekly View
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={loading}
          >
            <Ionicons
              name="refresh"
              size={20}
              color={loading ? "#ccc" : "#082640"}
            />
          </TouchableOpacity>
        </View>

        {activeView === "day" ? renderDailyView() : renderWeeklyView()}
      </View>

      <BottomTabBar activeTab="Trips" />
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationContainer: {
    marginRight: 15,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#082640",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#082640",
    fontWeight: "600",
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 10,
  },
  locationScroll: {
    flexGrow: 0,
  },
  locationChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 10,
  },
  locationChipActive: {
    backgroundColor: "#082640",
  },
  locationChipText: {
    fontSize: 14,
    color: "#666",
  },
  locationChipTextActive: {
    color: "white",
    fontWeight: "500",
  },
  viewSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  viewSelector: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
    flex: 1,
    marginRight: 10,
  },
  refreshButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewButtonText: {
    fontSize: 14,
    color: "#666",
  },
  viewButtonTextActive: {
    color: "#082640",
    fontWeight: "500",
  },
  tripList: {
    flex: 1,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  weekSection: {
    marginBottom: 20,
  },
  weekSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  tripCard: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tripName: {
    fontSize: 16,
    fontWeight: "600",
  },
  tripDate: {
    fontSize: 14,
    color: "#666",
  },
  tripStatusContainer: {
    backgroundColor: "#E8F4FD",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },
  tripStatus: {
    fontSize: 12,
    color: "#082640",
    fontWeight: "500",
  },
  tripDetails: {
    padding: 12,
  },
  tripTime: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tripTimeText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
  tripStops: {
    marginBottom: 10,
  },
  tripStop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#082640",
    marginRight: 8,
  },
  stopName: {
    fontSize: 14,
  },
  tripMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  tripMetaText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  tripActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  viewDetailsButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#666",
  },
  startTripButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#E8F4FD",
  },
  startTripText: {
    fontSize: 14,
    color: "#082640",
    fontWeight: "600",
  },
});
