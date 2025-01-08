import React, { useState } from "react";
import { Text, View, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import Modal from "react-native-modal";

const today = toDateId(new Date());

// Lista de eventos disponibles
const availableEvents = [
  "Reunión de trabajo",
  "Clase de yoga",
  "Cena familiar",
  "Estudio personal",
  "Cita médica",
];

export function BasicCalendar() {
  const [selectedDate, setSelectedDate] = useState(today);
  const [eventsByDate, setEventsByDate] = useState<{ [date: string]: string[] }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Manejar selección de fecha
  const handleDatePress = (dateId: string) => {
    setSelectedDate(dateId);
    setIsModalVisible(true); // Mostrar panel
  };

  // Manejar la adición de un evento
  const handleAddEvent = (event: string) => {
    setEventsByDate((prev) => {
      const currentEvents = prev[selectedDate] || [];
      if (currentEvents.length < 3 && !currentEvents.includes(event)) {
        return { ...prev, [selectedDate]: [...currentEvents, event] };
      }
      return prev; // No agregar si ya hay 3 eventos o si el evento ya existe
    });
  };

  // Manejar la eliminación de un evento
  const handleRemoveEvent = (event: string) => {
    setEventsByDate((prev) => {
      const currentEvents = prev[selectedDate] || [];
      return {
        ...prev,
        [selectedDate]: currentEvents.filter((e) => e !== event),
      };
    });
  };

  // Construir rangos activos basados en las fechas con eventos
  const activeDateRanges = Object.keys(eventsByDate).map((date) => ({
    startId: date,
    endId: date,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Fecha seleccionada: {selectedDate}</Text>
      <Calendar
        calendarActiveDateRanges={[
          ...activeDateRanges, // Fechas marcadas
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarMonthId={today}
        onCalendarDayPress={handleDatePress}
        calendarColorScheme="light"
      />
      {/* Mostrar eventos para la fecha seleccionada */}
      <View style={styles.eventsContainer}>
        <Text style={styles.subHeaderText}>Eventos para {selectedDate}:</Text>
        {eventsByDate[selectedDate]?.length > 0 ? (
          eventsByDate[selectedDate].map((event, index) => (
            <View key={index} style={styles.eventRow}>
              <Text style={styles.eventText}>{event}</Text>
              <Button
                title="Eliminar"
                onPress={() => handleRemoveEvent(event)}
                color="#FF5C5C"
              />
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>Sin eventos</Text>
        )}
      </View>

      {/* Modal para agregar eventos */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Agregar evento para {selectedDate}</Text>
          <FlatList
            data={availableEvents}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.eventButton,
                  eventsByDate[selectedDate]?.includes(item) && styles.eventButtonDisabled,
                ]}
                onPress={() => handleAddEvent(item)}
                disabled={eventsByDate[selectedDate]?.includes(item)}
              >
                <Text style={styles.eventButtonText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Cerrar" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  eventsContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  eventText: {
    fontSize: 14,
    flex: 1,
  },
  noEventsText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  eventButton: {
    padding: 10,
    backgroundColor: "#4A8CF0",
    marginVertical: 5,
    borderRadius: 10,
  },
  eventButtonDisabled: {
    backgroundColor: "#ccc",
  },
  eventButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});

export default BasicCalendar;
