import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "./context/AuthContext";



const BASE_URL = "http://192.168.1.13:5000/api";

export default function Login() {
    const router = useRouter();
    const navigation = useNavigation();

 const { setUser } = useAuth();
const [showPassword, setShowPassword] = useState(false);


    
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
   console.log("LOGIN USER:", res.data.user); // 🔥 vérifie

      setUser(res.data.user); // 🔥 TRÈS IMPORTANT
    const { token, user } = res.data;

    // 🔐 Save token + user
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    console.log("LOGIN SUCCESS");
    router.replace("/home");

  } catch (error: any) {
    console.log("LOGIN ERROR:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Login failed");
  }
};
useEffect(() => {
  navigation.setOptions({
    headerLeft: () => null, // ❌ enlève bouton back
  });
}, []);

  return (
     <>
      <Stack.Screen
  options={{
    headerBackVisible: false, // enlève back
    headerTitle: "",
    headerLeft: () => (
      <Ionicons
        name="alert-circle"
        size={30}     // 🔥 PLUS GRAND
        color="red"
        style={{ marginLeft: 15 }} // collé à gauche
      />
    ),
  }}
/>

    
    <View style={styles.container}>
      
      {/* Logo */}
      <View style={styles.logoBox}>
        <Ionicons name="car-outline" size={40} color="#2D7BE5" />
      </View>

      <Text style={styles.title}>Unidrive</Text>
      <Text style={styles.subtitle}>
        Commute with your campus community
      </Text>

      {/* Email */}
      <Text style={styles.label}>University Email</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#999" />
        <TextInput
  placeholder="Enter your .edu email"
  style={styles.input}
  placeholderTextColor="#999"
  value={email}
  onChangeText={setEmail}
/>

      </View>

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" />
      <TextInput
  placeholder="Enter your password"
secureTextEntry={!showPassword}

  style={styles.input}
  placeholderTextColor="#999"
  value={password}
  onChangeText={setPassword}
/>

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
  <Ionicons
    name={showPassword ? "eye-off-outline" : "eye-outline"}
    size={20}
    color="#999"
  />
</TouchableOpacity>

      </View>

    <TouchableOpacity onPress={() => router.push("/forgot-password")}>
  <Text style={styles.forgot}>Forgot Password?</Text>
</TouchableOpacity>
      {/* Login Button */}
      
<TouchableOpacity
  style={styles.button}
 onPress={handleLogin}

>
  <Text style={styles.buttonText}>Login</Text>
</TouchableOpacity>

     
      <View style={styles.registerContainer}>
  <Text style={styles.registerText}>
    Don't have an account?{" "}
  </Text>
  <TouchableOpacity onPress={() => router.push("/register")}>
    <Text style={styles.registerLink}>Register</Text>
  </TouchableOpacity>
</View>

      

    </View>
      </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoBox: {
    backgroundColor: "#E6EEF9",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  registerContainer: {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 20,
},

registerText: {
  color: "#64748B",
},

registerLink: {
  color: "#2D7BE5",
  fontWeight: "600",
},

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E293B",
  },
  subtitle: {
    color: "#64748B",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: 5,
    color: "#475569",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    width: "100%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  forgot: {
    alignSelf: "flex-end",
    color: "#2D7BE5",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2D7BE5",
    width: "100%",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  or: {
    marginVertical: 20,
    color: "#94A3B8",
  },
  socialContainer: {
    flexDirection: "row",
    gap: 10,
  },
  socialBtn: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
  },
});
