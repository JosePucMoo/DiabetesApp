import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { fontStyle } from "@/constants/FontStyles";
import { containerStyles } from "@/constants/Containers";
import { buttonStyles } from "@/constants/Buttons";
import StatesDropdown from "@/components/StatesDropdown";

interface PersonalDataFormProps {
  onSubmit: (name: string, surname: string, state: string) => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = () => {
    onSubmit(name, surname, state);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.formContainer}
    >
      <TextInput
        style={fontStyle.textInput}
        placeholder="Nombre(s)"
        placeholderTextColor="gray"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[fontStyle.textInput, {marginBottom: 20}]}
        placeholder="Primer Apellido"
        placeholderTextColor="gray"
        autoCapitalize="words"
        value={surname}
        onChangeText={setSurname}
      />
      <StatesDropdown 
        selectedState={state}
        onStateChange={setState} 
      />
      <TouchableOpacity style={buttonStyles.next} onPress={handleSubmit}>
        <Text style={fontStyle.primaryButtonFont}>Siguiente</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
    formContainer: {
      width: "85%",
      alignItems: 'center'
    }
  }
);

export default PersonalDataForm;
