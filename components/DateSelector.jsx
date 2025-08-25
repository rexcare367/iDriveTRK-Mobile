import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const DateSelector = ({
  periodType,
  onPeriodChange,
  selectedDate,
  onDateChange,
  selectedMonth,
  onMonthChange,
  selectedWeek,
  onWeekChange
}) => {
  const renderDailySelector = () => {
    const date = new Date(selectedDate);
    const month = date.toLocaleString("default", { month: "long" });
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    // Generate days for the week containing the selected date
    const currentDay = date.getDay(); // 0-6
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - currentDay);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      days.push({
        dayName: daysOfWeek[i],
        dayNumber: day.getDate(),
        date: day.toISOString().split("T")[0],
        isSelected: day.toDateString() === date.toDateString()
      });
    }

    return (
      <View>
        <Text style={styles.selectorLabel}>Select Day</Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => {
              const prevDate = new Date(selectedDate);
              prevDate.setDate(prevDate.getDate() - 7);
              onDateChange(prevDate.toISOString().split("T")[0]);
            }}
          >
            <Feather name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>{month}</Text>

          <TouchableOpacity
            onPress={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(nextDate.getDate() + 7);
              onDateChange(nextDate.toISOString().split("T")[0]);
            }}
          >
            <Feather name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.daysContainer}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[styles.dayItem, day.isSelected && styles.selectedDayItem]}
              onPress={() => onDateChange(day.date)}
            >
              <Text
                style={[
                  styles.dayName,
                  day.isSelected && styles.selectedDayText
                ]}
              >
                {day.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  day.isSelected && styles.selectedDayText
                ]}
              >
                {day.dayNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderWeeklySelector = () => {
    const currentDate = new Date(selectedWeek || new Date());
    const month = currentDate.toLocaleString("default", { month: "long" });
    const year = currentDate.getFullYear();

    // Generate calendar for the month
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(year, currentDate.getMonth() + 1, 0);

    // Get the day of the week for the first day (0-6)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Adjust for Monday as first day of week
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Calculate the total number of days to display
    const totalDays = lastDayOfMonth.getDate();
    const prevMonthLastDay = new Date(
      year,
      currentDate.getMonth(),
      0
    ).getDate();

    const days = [];

    // Previous month days
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        day: prevMonthLastDay - firstDayOfWeek + i + 1,
        month: currentDate.getMonth() - 1,
        year,
        isCurrentMonth: false,
        date: new Date(
          year,
          currentDate.getMonth() - 1,
          prevMonthLastDay - firstDayOfWeek + i + 1
        )
          .toISOString()
          .split("T")[0]
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month: currentDate.getMonth(),
        year,
        isCurrentMonth: true,
        date: new Date(year, currentDate.getMonth(), i)
          .toISOString()
          .split("T")[0],
        isSelected: i === currentDate.getDate()
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: currentDate.getMonth() + 1,
        year,
        isCurrentMonth: false,
        date: new Date(year, currentDate.getMonth() + 1, i)
          .toISOString()
          .split("T")[0]
      });
    }

    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Determine which week is selected
    const selectedWeekIndex = weeks.findIndex((week) =>
      week.some((day) => day.date === selectedWeek)
    );

    return (
      <View>
        <Text style={styles.selectorLabel}>Select Week</Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => {
              const prevMonth = new Date(currentDate);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              onMonthChange(prevMonth.toISOString().split("T")[0]);
            }}
          >
            <Feather name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>{month}</Text>

          <TouchableOpacity
            onPress={() => {
              const nextMonth = new Date(currentDate);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              onMonthChange(nextMonth.toISOString().split("T")[0]);
            }}
          >
            <Feather name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.weekDaysHeader}>
            {["M", "T", "W", "Th", "F", "S", "Su"].map((day, index) => (
              <Text key={index} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          {weeks.map((week, weekIndex) => (
            <TouchableOpacity
              key={weekIndex}
              style={[
                styles.weekRow,
                weekIndex === selectedWeekIndex && styles.selectedWeekRow
              ]}
              onPress={() => {
                // Find the first day of the week that is in the current month
                const firstDayInCurrentMonth = week.find(
                  (day) => day.isCurrentMonth
                );
                if (firstDayInCurrentMonth) {
                  onWeekChange(firstDayInCurrentMonth.date);
                } else {
                  onWeekChange(week[0].date);
                }
              }}
            >
              {week.map((day, dayIndex) => (
                <Text
                  key={dayIndex}
                  style={[
                    styles.calendarDay,
                    !day.isCurrentMonth && styles.otherMonthDay,
                    day.isSelected && styles.selectedDay
                  ]}
                >
                  {day.day}
                </Text>
              ))}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderMonthlySelector = () => {
    const date = new Date(selectedMonth || new Date());
    const year = date.getFullYear();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ];

    return (
      <View>
        <Text style={styles.selectorLabel}>Select Month</Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => {
              const prevYear = new Date(date);
              prevYear.setFullYear(prevYear.getFullYear() - 1);
              onMonthChange(prevYear.toISOString().split("T")[0]);
            }}
          >
            <Feather name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>{year}</Text>

          <TouchableOpacity
            onPress={() => {
              const nextYear = new Date(date);
              nextYear.setFullYear(nextYear.getFullYear() + 1);
              onMonthChange(nextYear.toISOString().split("T")[0]);
            }}
          >
            <Feather name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.monthsContainer}>
          {months.map((month, index) => {
            const isSelected = date.getMonth() === index;
            return (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthItem,
                  isSelected && styles.selectedMonthItem
                ]}
                onPress={() => {
                  const newDate = new Date(date);
                  newDate.setMonth(index);
                  onMonthChange(newDate.toISOString().split("T")[0]);
                }}
              >
                <Text
                  style={[
                    styles.monthItemText,
                    isSelected && styles.selectedMonthText
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            );
          })}     
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectorLabel}>Select Period</Text>
      <TouchableOpacity
        style={styles.periodSelector}
        onPress={() => {
          const periods = ["Daily", "Weekly", "Monthly"];
          const currentIndex = periods.indexOf(periodType);
          const nextIndex = (currentIndex + 1) % periods.length;
          onPeriodChange(periods[nextIndex]);
        }}
      >
        <Text style={styles.periodText}>{periodType}</Text>
        <Feather name="chevron-down" size={20} color="#000" />
      </TouchableOpacity>

      {periodType === "Daily" && renderDailySelector()}
      {periodType === "Weekly" && renderWeeklySelector()}
      {periodType === "Monthly" && renderMonthlySelector()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333"
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff"
  },
  periodText: {
    fontSize: 16
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "500"
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8
  },
  dayItem: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    width: 45
  },
  selectedDayItem: {
    backgroundColor: "#002B49"
  },
  dayName: {
    fontSize: 12,
    marginBottom: 4
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "500"
  },
  selectedDayText: {
    color: "#fff"
  },
  calendarContainer: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  weekDaysHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "#f5f5f5"
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "500",
    width: 30,
    textAlign: "center"
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  selectedWeekRow: {
    backgroundColor: "#e6f2ff"
  },
  calendarDay: {
    fontSize: 14,
    width: 30,
    textAlign: "center"
  },
  otherMonthDay: {
    color: "#aaa"
  },
  selectedDay: {
    backgroundColor: "#002B49",
    color: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    width: 30,
    height: 30,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 30
  },
  monthsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  monthItem: {
    width: "30%",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5"
  },
  selectedMonthItem: {
    backgroundColor: "#002B49"
  },
  monthItemText: {
    fontSize: 14,
    fontWeight: "500"
  },
  selectedMonthText: {
    color: "#fff"
  }
});

export default DateSelector;
