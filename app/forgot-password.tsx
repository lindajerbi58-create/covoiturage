import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPassword() {
  const router = useRouter();
const [email, setEmail] = useState("");

const handleReset = async () => {
  try {
    await axios.post("http://192.168.1.13:5000/api/auth/forgot-password", {
      email,
    });

    alert("Reset link sent to your email 📧");

  } catch (error) {
    alert("Error sending reset link");
  }
};


  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your university email and we’ll send you a reset link
      </Text>

   <TextInput
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your .edu email"
  style={styles.input}
/>


      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "#64748B",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
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
