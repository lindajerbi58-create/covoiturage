import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BASE_URL = "http://192.168.1.13:5000/api";

export default function Payment() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSave = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user) return;

      const res = await axios.put(
        `${BASE_URL}/auth/update/${user._id}`,
        {
          cardNumber,
          cardName: name,
          expiry,
          cvv,
        }
      );

      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Card saved ✅");
      router.back();

    } catch (error: any) {
      console.log("CARD SAVE ERROR", error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Information</Text>

      <Input label="Card Number" value={cardNumber} onChange={setCardNumber} />
      <Input label="Name on Card" value={name} onChange={setName} />
      <Input label="Expiry Date (MM/YY)" value={expiry} onChange={setExpiry} />
      <Input label="CVV" value={cvv} onChange={setCvv} />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Save Card
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <View style={styles.inputBox}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f6f7f8" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  inputBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
  },

  label: { fontSize: 12, color: "#94A3B8" },

  input: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
  },

  saveBtn: {
    backgroundColor: "#137fec",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },
});
