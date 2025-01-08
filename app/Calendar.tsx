import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

const today = toDateId(new Date());

const BasicCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selected date: {selectedDate}</Text>
      <Calendar
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarMonthId={today}
        onCalendarDayPress={setSelectedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Calendar;
