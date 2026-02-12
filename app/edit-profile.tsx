import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
    const [licenseImage, setLicenseImage] = useState<string | null>(null);
const pickLicenseImage = async () => {
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.5,
  base64: true,
});


  if (!result.canceled) {
    setLicenseImage(result.assets[0].uri);
  }
};

   const handleSave = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) return;

    const res = await axios.put(
      `${BASE_URL}/auth/update/${user._id}`,
      {
        fullName,
        phone,
        paymentMethod: payment,
        vehicleInfo: vehicle,
        hasLicense,
        role: hasLicense ? "driver" : "student",
       preferences: {
  noSmoking,
  petsAllowed,
  airCondition,
  softJazz,
}
,
        licensePhoto: licenseImage, // 🔥 IMPORTANT (pas drivingLicense)
      }
    );

    // update local storage
    await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Profile updated ✅");

    router.replace("/profile");

  } catch (error: any) {
    console.log("UPDATE ERROR", error.response?.data || error.message);
  }
};

  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [payment, setPayment] = useState<"cash" | "card">("cash");

  const [vehicle, setVehicle] = useState("");
  const [hasLicense, setHasLicense] = useState(true);

  const [noSmoking, setNoSmoking] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [airCondition, setAirCondition] = useState(false);
  const [softJazz, setSoftJazz] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* PERSONAL INFO */}
        <Text style={styles.section}>PERSONAL INFO</Text>

        <Input label="Full Name" value={fullName} onChange={setFullName} />
        <Input label="Phone Number" value={phone} onChange={setPhone} />

        {/* PAYMENT */}
        <Text style={styles.section}>PAYMENT METHOD</Text>

        <View style={styles.row}>
          <PaymentButton
            label="Cash"
            active={payment === "cash"}
            onPress={() => setPayment("cash")}
          />
          <PaymentButton
            label="Card"
            active={payment === "card"}
            onPress={() => setPayment("card")}
          />
        </View>

        {/* VEHICLE */}
        <Text style={styles.section}>VEHICLE</Text>

        <Input
          label="Vehicle Info"
          placeholder="Toyota Corolla • White"
          value={vehicle}
          onChange={setVehicle}
        />

        <TouchableOpacity
  style={styles.uploadBtn}
  onPress={pickLicenseImage}
>
  <Text style={{ color: "#137fec", fontWeight: "600" }}>
    Upload License Photo
  </Text>
</TouchableOpacity>

{licenseImage && (
  <Image
    source={{ uri: licenseImage }}
    style={{ width: 120, height: 80, marginTop: 10, borderRadius: 10 }}
  />
)}


        {/* PREFERENCES */}
        <Text style={styles.section}>RIDE PREFERENCES</Text>

        <RowSwitch label="No Smoking" value={noSmoking} onChange={setNoSmoking} />
        <RowSwitch label="Pets Allowed" value={petsAllowed} onChange={setPetsAllowed} />
        <RowSwitch label="Air Condition" value={airCondition} onChange={setAirCondition} />
        <RowSwitch label="Soft Jazz" value={softJazz} onChange={setSoftJazz} />

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
  <Text style={styles.saveText}>Save Changes</Text>
</TouchableOpacity>

      </ScrollView>
    </View>
  );
}
const BASE_URL = "http://192.168.1.13:5000/api";


function Input({ label, value, onChange, placeholder }: any) {
  return (
    <View style={styles.inputBox}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
}

function RowSwitch({ label, value, onChange }: any) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function PaymentButton({ label, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.paymentBtn, active && styles.paymentActive]}
    >
      <Text style={[styles.paymentText, active && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8", padding: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  title: { fontSize: 20, fontWeight: "bold" },

  section: {
    marginTop: 25,
    fontSize: 12,
    fontWeight: "bold",
    color: "#94A3B8",
  },

  inputBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },

  inputLabel: { fontSize: 10, color: "#94A3B8", marginBottom: 6 },

  input: {
    fontSize: 16,
    fontWeight: "600",
  },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },

  paymentBtn: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
uploadBtn: {
  backgroundColor: "#E0ECFF",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10,
},

  paymentActive: {
    backgroundColor: "#137fec",
  },

  paymentText: {
    fontWeight: "600",
    color: "#0F172A",
  },

  switchRow: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchText: { fontWeight: "600" },

  saveBtn: {
    backgroundColor: "#137fec",
    padding: 16,
    borderRadius: 16,
    marginTop: 30,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontWeight: "bold" },
});
