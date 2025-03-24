import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../app/auth/firebase";

interface State {
  key: string; // ID del estado
  value: string; // Nombre del estado
}

interface StatesDropdownProps {
  selectedState: string;
  onStateChange: (state: string) => void;
  editable?: boolean;
}

const StatesDropdown: React.FC<StatesDropdownProps> = ({ selectedState, onStateChange, editable = true }) => {
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "states"));
        const statesArray = querySnapshot.docs.map((doc) => ({
          key: doc.id,
          value: doc.data().name,
        }));
        setStates(statesArray);
      } catch (error) {
        console.error("❌ Error al obtener los estados:", error);
      }
    };

    fetchStates();
  }, []);

  return (
    <TouchableOpacity activeOpacity={editable ? 1 : 1} disabled={!editable}>
      <View pointerEvents={editable ? "auto" : "none"}>
        <SelectList
          setSelected={(key: string) => {
            if (!editable) return; 
            const selectedState = states.find((state) => state.key === key);
            if (selectedState) {
              onStateChange(selectedState.value);
            }
          }}
          data={states}
          placeholder="Selecciona un estado"
          search={false} 
          boxStyles={styles.dropdown}
          dropdownStyles={styles.dropdownMenu}
          defaultOption={{ key: selectedState, value: selectedState }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },
  dropdownMenu: {
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "white",
  },
});

export default StatesDropdown;
