import React, { useState, useEffect } from "react";
import { 
  Text, View, StyleSheet, TouchableOpacity, Animated, FlatList 
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Modal from "react-native-modal";
import useCalendarEvents from "../hooks/CalendarDB"; 

LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const today = new Date().toISOString().split('T')[0];

const availableEvents = [
  "Reunión de trabajo",
  "Clase de yoga",
  "Cena familiar",
  "Estudio personal",
  "Cita médica",
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00");
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

  const handleDatePress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true);
  };

  const handleAddEvent = (event: string) => {
    const currentEvents = eventsByDate[selectedDate] || [];
    if (currentEvents.includes(event)) {
      setErrorMessage("La actividad ya está agregada para esta fecha.");
      setTimeout(() => setErrorMessage(""), 3000); // Limpiar el mensaje de error después de 3 segundos
      return;
    }
    const updatedEvents = {
      ...eventsByDate,
      [selectedDate]: [...currentEvents, event],
    };
    saveEvents(updatedEvents);
    setIsModalVisible(false);
  };

  const handleRemoveEvent = (date: string, event: string) => {
    const currentEvents = eventsByDate[date] || [];
    const updatedEvents = {
      ...eventsByDate,
      [date]: currentEvents.filter((e) => e !== event),
    };
    if (updatedEvents[date].length === 0) {
      delete updatedEvents[date]; // Eliminar la entrada del día si no tiene eventos
    }
    saveEvents(updatedEvents);
  };

  const markedDates = Object.keys(eventsByDate).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: date !== today ? "#99d17d" : "#000000", // Verde menta para fechas con eventos que no son hoy
    };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDatePress}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: 'orange',
          monthTextColor: 'blue',
          indicatorColor: 'blue',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />

      {/* 🔹 Recuadro de eventos de hoy */}
      <View style={styles.todayEventsContainer}>
        <Text style={styles.eventsHeaderText}>Actividades de hoy ({formatDate(today)})</Text>
        {eventsByDate[today]?.length > 0 ? (
          eventsByDate[today].map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <Text style={styles.eventText}>{event}</Text>
              <TouchableOpacity onPress={() => handleRemoveEvent(today, event)}>
                <Text style={styles.deleteButton}>X</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>Sin actividades</Text>
        )}
      </View>

      {/* 🔹 Recuadro de eventos de la fecha seleccionada (Aparece solo si no es hoy) */}
      {selectedDate !== today && (
        <Animated.View style={[styles.selectedEventsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.eventsHeaderText}>Actividades para {formatDate(selectedDate)}</Text>
          {eventsByDate[selectedDate]?.length > 0 ? (
            eventsByDate[selectedDate].map((event, index) => (
              <View key={index} style={[styles.eventCard, styles.selectedEventCard]}>
                <Text style={styles.eventText}>{event}</Text>
                <TouchableOpacity onPress={() => handleRemoveEvent(selectedDate, event)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>Sin actividades</Text>
          )}
        </Animated.View>
      )}

      {/* Modal para agregar eventos */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar actividad</Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <FlatList
            data={availableEvents}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAddEvent(item)}>
                <Text style={styles.modalItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text style={styles.modalCloseButton}>Cerrar</Text>
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
    backgroundColor: "white", // Fondo blanco
  },
  todayEventsContainer: {
    marginTop: 20,
  },
  eventsHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d4150",
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedEventCard: {
    backgroundColor: "#99d17d", // Verde menta
  },
  eventText: {
    fontSize: 16,
    color: "#2d4150",
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
  },
  noEventsText: {
    fontSize: 16,
    color: "gray",
  },
  selectedEventsContainer: {
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2d4150",
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#2d4150",
  },
  modalCloseButton: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default BasicCalendar;