import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
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

const today = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Merida",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date()).split("/").reverse().join("-");


const availableEvents = [
  "Practicar la autoaceptación",
  "Llevar un diario emocional",
  "Establecer límites saludables",
  "Practicar la meditación o el mindfulness",
  "Hablar con un amigo o terapeuta",
  "Participar en actividades creativas",
  "Practicar la gratitud",
  "Gestionar el estrés",
  "Hacer actividades que te gusten",
  "Desconectar de las redes sociales",
  "Leer libros o artículos",
  "Aprender algo nuevo",
  "Resolver rompecabezas o sudokus",
  "Practicar la reflexión crítica",
  "Limitar el consumo de noticias",
  "Practicar la meditación",
  "Escribir ensayos o reflexiones",
  "Participar en debates o discusiones",
  "Organizar tareas y prioridades",
  "Desarrollar un proyecto personal",
  "Mantener contacto regular con amigos y familia",
  "Participar en actividades grupales",
  "Hacer nuevos amigos",
  "Apoyar a otros",
  "Practicar la escucha activa",
  "Celebrar logros de los demás",
  "Agradecer las relaciones importantes",
  "Crear redes de apoyo",
  "Limitar las relaciones tóxicas",
  "Ser asertivo en las relaciones",
  "Practicar la meditación o la oración",
  "Reflexionar sobre tus valores",
  "Pasar tiempo en la naturaleza",
  "Practicar la gratitud",
  "Leer textos espirituales",
  "Asistir a servicios religiosos o espirituales",
  "Practicar la compasión",
  "Desarrollar un ritual personal",
  "Reflexionar sobre el propósito de vida",
  "Participar en actividades de voluntariado",
  "Caminar 30 minutos",
  "Practicar yoga",
  "Beber suficiente agua",
  "Dormir 7-9 horas",
  "Revisar los pies",
  "Hacer estiramientos",
  "Limitar el consumo de azúcar",
  "Escribir en un diario",
  "Unirse a un grupo de apoyo",
  "Meditar o hacer respiración profunda",
  "Realizar una actividad recreativa",
  "Hablar con alguien de confianza",
  "Practicar la gratitud",
  "Leer sobre diabetes",
  "Aprender una receta saludable",
  "Llevar un diario de comidas",
  "Monitorear la glucosa",
  "Contactar a un amigo o familiar",
  "Unirse a un grupo de ejercicio",
  "Hacer voluntariado",
  "Meditar",
  "Pasar tiempo en la naturaleza",
  "Reflexionar sobre el día"
];


const formatDate = (dateString) => {
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
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 5;
  const totalPages = Math.ceil(availableEvents.length / eventsPerPage);

  const handleDatePress = (day) => {
    setSelectedDate(day.dateString);
  };  

  const handleAddEvent = (event) => {
    if (eventsByDate[selectedDate]?.includes(event)) {
      alert("Este evento ya está agregado en esta fecha.");
      return;
    }
    const updatedEvents = {
      ...eventsByDate,
      [selectedDate]: [...(eventsByDate[selectedDate] || []), event],
    };
    saveEvents(updatedEvents);
    setIsModalVisible(false);
  };

  const handleDeleteEvent = (event) => {
    const updatedEvents = {
      ...eventsByDate,
      [selectedDate]: eventsByDate[selectedDate].filter(e => e !== event)
    };
    saveEvents(updatedEvents);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.fabButton} 
        onPress={() => setIsModalVisible(true)}
      >
    <Text style={styles.fabButtonText}>+</Text>
    </TouchableOpacity>

      <Calendar
        onDayPress={handleDatePress}
        markedDates={
          Object.keys(eventsByDate).reduce((acc, date) => {
            if (date !== today && eventsByDate[date]?.length > 0) {
              acc[date] = { 
                selected: true, 
                selectedColor: "#99d17d90",
                customStyles: { text: { color: "black" } } // Mantiene el texto en negro
              };
            }
            return acc;
          }, {})
        }
        
        theme={{
          todayTextColor: "#00adf5",
          textSectionTitleColor: "#222222", // Color oscuro para los nombres de los días
          textSectionTitleDisabledColor: "#666666", // Color menos oscuro para sábado y domingo
        }}
        
      />

      <View style={styles.todayEventsContainer}>
        <Text style={styles.eventsHeaderText}>Actividades de hoy ({formatDate(today)})</Text>
        {eventsByDate[today]?.map((event, index) => (
          <View key={index} style={styles.eventRow}>
            <Text style={styles.eventText}>{event}</Text>
            <TouchableOpacity onPress={() => handleDeleteEvent(event)}>
              <Text style={styles.deleteButton}>X</Text>
            </TouchableOpacity>
          </View>
        )) || <Text style={styles.noEventsText}>Sin actividades</Text>}
      </View>

      {selectedDate !== today && (
        <View style={styles.selectedEventsContainer}>
          <Text style={styles.eventsHeaderText}>Actividades para {formatDate(selectedDate)}</Text>
          {eventsByDate[selectedDate]?.map((event, index) => (
            <View key={index} style={styles.eventRow}>
              <Text style={styles.eventText}>{event}</Text>
              <TouchableOpacity onPress={() => handleDeleteEvent(event)}>
                <Text style={styles.deleteButton}>X</Text>
              </TouchableOpacity>
            </View>
          )) || <Text style={styles.noEventsText}>Sin actividades</Text>}
        </View>
      )}

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar actividad</Text>
          <FlatList
            data={availableEvents.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAddEvent(item)}>
                <Text style={styles.modalItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.paginationContainer}>
            <TouchableOpacity onPress={() => setCurrentPage(Math.max(currentPage - 1, 0))}>
              <Text style={styles.paginationButton}>Anterior</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>{currentPage + 1} / {totalPages}</Text>
            <TouchableOpacity onPress={() => setCurrentPage(Math.min(currentPage + 1, totalPages - 1))}>
              <Text style={styles.paginationButton}>Siguiente</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text style={styles.modalCloseButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  eventRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  deleteButton: { color: "red", fontSize: 14 },
  todayEventsContainer: { backgroundColor: "white", padding: 15, borderRadius: 10, marginVertical: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, borderLeftWidth: 5, borderLeftColor: "#00adf5" },
  selectedEventsContainer: { backgroundColor: "white", padding: 15, borderRadius: 10, marginVertical: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, borderLeftWidth: 5, borderLeftColor: "#99d17d" },
  eventsHeaderText: { fontSize: 18, fontWeight: "bold", color: "#2d4150", marginBottom: 10 },
  eventText: { fontSize: 16, color: "#2d4150", marginBottom: 5 },
  noEventsText: { fontSize: 16, color: "gray" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#2d4150" },
  modalItem: { fontSize: 16, paddingVertical: 10, color: "#2d4150" },
  modalCloseButton: { marginTop: 20, fontSize: 16, color: "red", textAlign: "center" },
  paginationContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, alignItems: "center" },
  paginationButton: { fontSize: 16, color: "#00adf5", paddingVertical: 5, paddingHorizontal: 10 },
  pageIndicator: { fontSize: 16, fontWeight: "bold" },
  fabButton: {
    position: "absolute",
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    backgroundColor: "#66D2A5", // Verde menta
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  fabButtonText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  }
  
});

export default BasicCalendar;
