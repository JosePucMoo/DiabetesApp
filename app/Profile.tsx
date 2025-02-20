import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Avatar, ProgressBar, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { containerStyles } from "@/constants/Containers";
import { fontStyle } from "@/constants/FontStyles";
import { auth, db } from "./auth/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { buttonStyles } from "@/constants/Buttons";
import LogOutButton from "@/components/LogOutButton";
import { typography } from "@/constants/Typograhpy";
import Colors from "@/constants/Colors";

const Profile: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);
  const [limit, setLimit] = useState<number>(100);
  const [progress, setProgress] = useState(0);

  // Estados para los inputs
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setUserData(data);
        setExperience(data.exp);
        setLevel(data.level);

        const limit = 100 * Math.pow(data.level, 2);
        setLimit(limit);
        setProgress(Math.min(1, Math.max(0, data.exp / limit)));

        // Cargar valores en los inputs
        setName(data.name || "");
        setLastName(data.lastName || "");
        setState(data.state || "");
        setBirthDate(data.birthDate || "");
      }
    }
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSaveChanges = async () => {
    if (!name.trim() || !lastName.trim() || !state.trim() || !birthDate.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (name.length > 100 || lastName.length > 100 || state.length > 100 || birthDate.length > 100) {
      Alert.alert("Error", "Cada campo debe tener menos de 100 caracteres.");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        name,
        lastName,
        state,
        birthDate,
      });
      fetchUserData();
      setEditable(false);
    }
  };

  const handleLogOut = () => {
    router.navigate("./SignIn");
  };

  return (
    <View style={containerStyles.container}>
      <Avatar.Image size={150} source={require("../assets/images/profile.png")} />
      <View style={styles.textContainer}>
        <Text style={fontStyle.headlineFont}>{userData?.name}</Text>
      </View>
      <View>
        <Text style={styles.level}>Nivel {level}</Text>
        <View style={styles.experienceContainer}>
          <Text style={styles.level}>{experience}</Text>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={progress} color={Colors.Error} style={styles.progressBar} />
          </View>
          <Text style={styles.level}>{limit}</Text>
        </View>
      </View>

      {/* Formulario de Edición */}
      <View style={styles.formContainer}>
        <TextInput
          label="Nombre"
          value={name}
          onChangeText={setName}
          mode="outlined"
          editable={editable}
        />
        <TextInput
          label="Apellido Paterno"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          editable={editable}
        />
        <TextInput
          label="Estado"
          value={state}
          onChangeText={setState}
          mode="outlined"
          editable={editable}
        />
        <TextInput
          label="Fecha de Nacimiento"
          value={birthDate}
          onChangeText={setBirthDate}
          mode="outlined"
          editable={editable}
        />
      </View>

      {!editable ? (
        <TouchableOpacity style={[buttonStyles.error, { marginTop: 20 }]} onPress={handleEdit}>
          <Text style={fontStyle.primaryButtonFont}>Editar Perfil</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[buttonStyles.success, { marginTop: 20 }]} onPress={handleSaveChanges}>
          <Text style={fontStyle.primaryButtonFont}>Guardar Cambios</Text>
        </TouchableOpacity>
      )}

      <LogOutButton onLogOut={handleLogOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 20,
  },
  experienceContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  level: {
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
  },
  progressBarContainer: {
    width: "70%",
    justifyContent: "center",
  },
  progressBar: {
    height: 10,
    borderRadius: 25,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default Profile;
