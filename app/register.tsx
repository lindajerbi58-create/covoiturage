import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const BASE_URL = "http://192.168.1.13:5000/api";

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");

const handleRegister = async () => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      fullName,
      email,
      password,
      phone,
      role
    });

    console.log("REGISTER SUCCESS:", res.data);
    alert("Account created successfully ✅");

    router.replace("/home"); // adapte selon ton routing

 } catch (error: any) {
  console.log("REGISTER ERROR:", error.response?.data || error.message);
  alert(error.response?.data?.message || "Registration failed");
}

};


  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>◀ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Join your university community
      </Text>

      {/* Full Name */}
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Email */}
      <TextInput
        placeholder="University Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password */}
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Phone */}
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      {/* Role Selection */}
      <Text style={styles.roleTitle}>I am a...</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "student" && styles.roleActive,
          ]}
          onPress={() => setRole("student")}
        >
          <Text style={role === "student" ? styles.roleTextActive : styles.roleText}>
            Student
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "staff" && styles.roleActive,
          ]}
          onPress={() => setRole("staff")}
        >
          <Text style={role === "staff" ? styles.roleTextActive : styles.roleText}>
            Staff
          </Text>
        </TouchableOpacity>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6FA",
  },
  back: {
    color: "#2D7BE5",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#64748B",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  roleTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "500",
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    marginRight: 10,
  },
  roleActive: {
    backgroundColor: "#2D7BE5",
  },
  roleText: {
    color: "#1E293B",
  },
  roleTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2D7BE5",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
