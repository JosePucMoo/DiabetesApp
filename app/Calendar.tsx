import React, { useState, useEffect } from "react";
import { 
  Text, View, StyleSheet, FlatList, TouchableOpacity, Animated 
} from "react-native";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import Modal from "react-native-modal";
import useCalendarEvents from "../hooks/CalendarDB"; 
import { ScrollView } from "react-native";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const today = toDateId(new Date());

const availableEvents = [
  "Reunión de trabajo",
  "Clase de yoga",
  "Cena familiar",
  "Estudio personal",
  "Cita médica",
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export function BasicCalendar() {
  const { eventsByDate, saveEvents } = useCalendarEvents(); 
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Animación para el recuadro de eventos seleccionados
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (selectedDate !== today) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedDate]);

  const handleDatePress = (dateId: string) => {
    setSelectedDate(dateId);
    setIsModalVisible(true);
  };

  const handleAddEvent = (event: string) => {
    const currentEvents = eventsByDate[selectedDate] || [];
    if (currentEvents.length < 3 && !currentEvents.includes(event)) {
      const updatedEvents = { ...eventsByDate, [selectedDate]: [...currentEvents, event] };
      saveEvents(updatedEvents);
      setErrorMessage("");
    } else {
      setErrorMessage("No puedes agregar más de 3 eventos en este día.");
    }
  };

  const handleRemoveEvent = (date: string, event: string) => {
    const currentEvents = eventsByDate[date] || [];
    const updatedEvents = {
      ...eventsByDate,
      [date]: currentEvents.filter((e) => e !== event),
    };
    saveEvents(updatedEvents);
  };

  const activeDateRanges = Object.keys(eventsByDate).map((date) => ({
    startId: date,
    endId: date,
  }));

  return (
    <View style={styles.container}>
      <Calendar
        calendarActiveDateRanges={[...activeDateRanges, { startId: selectedDate, endId: selectedDate }]}
        calendarMonthId={today}
        onCalendarDayPress={handleDatePress}
        calendarColorScheme="light"
      />

      {/* 🔹 Recuadro de eventos de hoy */}
      <View style={styles.todayEventsContainer}>
        <Text style={styles.eventsHeaderText}>Eventos de Hoy ({formatDate(today)})</Text>
        {eventsByDate[today]?.length > 0 ? (
          eventsByDate[today].map((event, index) => (
            <View key={index} style={styles.eventRow}>
              <Text style={styles.eventText}>{event}</Text>
              <TouchableOpacity onPress={() => handleRemoveEvent(today, event)}>
                <Text style={styles.deleteButton}>X</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>Sin eventos</Text>
        )}
      </View>

      {/* 🔹 Recuadro de eventos de la fecha seleccionada (Aparece solo si no es hoy) */}
      {selectedDate !== today && (
        <Animated.View style={[styles.selectedEventsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.eventsHeaderText}>Eventos para: {formatDate(selectedDate)}</Text>
          {eventsByDate[selectedDate]?.length > 0 ? (
            eventsByDate[selectedDate].map((event, index) => (
              <View key={index} style={styles.eventRow}>
                <Text style={styles.eventText}>{event}</Text>
                <TouchableOpacity onPress={() => handleRemoveEvent(selectedDate, event)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>Sin eventos</Text>
          )}
        </Animated.View>
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          setIsModalVisible(false);
          setErrorMessage(""); 
        }}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Agregar evento para el {formatDate(selectedDate)}</Text>
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
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeModalButton}>
            <Text style={styles.closeModalButtonText}>Cerrar</Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
    flexGrow: 1, // 🔹 Asegura que el contenido sea deslizable cuando hay muchos elementos
  },
  todayEventsContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#000000", // 🔹 Fondo negro para resaltar eventos de hoy
  },
  todayEventsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#FFFFFF",
  },
  selectedEventsContainer: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#99d17d",
  },
  eventsHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#FFFFFF", // 🔹 Texto blanco para eventos de hoy
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingVertical: 10, // 🔹 Espaciado vertical para las líneas
    paddingHorizontal: 10, // 🔹 Espaciado para que la línea no llegue a los extremos
    borderBottomWidth: 1, // 🔹 Agrega una línea entre los eventos
    borderBottomColor: "rgba(255, 255, 255, 0.5)", // 🔹 Línea con opacidad
  },
  eventText: {
    fontSize: 18,
    flex: 1,
    color: "#FFFFFF", // 🔹 Texto blanco en eventos
  },
  deleteButton: {
    color: "#FF0000",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  noEventsText: {
    fontSize: 16,
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
    color: "#FFFFFF" 
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
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF5C5C",
    borderRadius: 10,
  },
  closeModalButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});


export default BasicCalendar;
