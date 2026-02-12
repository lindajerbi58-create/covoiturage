import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


const BASE_URL = "http://192.168.1.13:5000/api";

export default function PublishRide() {
  const router = useRouter();
  const params = useLocalSearchParams();

const [departureCoords, setDepartureCoords] = useState<any>(null);
const [destinationCoords, setDestinationCoords] = useState<any>(null);

  // FORM STATE
  const [departure, setDeparture] = useState("Monastir");
  const [destination, setDestination] = useState("");

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const [seats, setSeats] = useState(4);
  const [price, setPrice] = useState(4.5);

  // PREFERENCES
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [noSmoking, setNoSmoking] = useState(false);
  const [airCondition, setAirCondition] = useState(false);
  const [softJazz, setSoftJazz] = useState(false);
const [femaleOnly, setFemaleOnly] = useState(false);

  const estimatedEarnings = Number.isFinite(price) ? price * 4 : 0;
useFocusEffect(
    
  React.useCallback(() => {
    console.log("🔥 useFocusEffect triggered");

    const loadLocation = async () => {
      const stored = await AsyncStorage.getItem("selectedLocation");

      if (!stored) return;

      const location = JSON.parse(stored);

      console.log("📍 LOADED LOCATION:", location);

      if (location.type === "departure") {
        setDeparture(location.address);
        setDepartureCoords({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }

      if (location.type === "destination") {
        setDestination(location.address);
        setDestinationCoords({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }

      await AsyncStorage.removeItem("selectedLocation");
    };

    loadLocation();
  }, [])
);

const onPublish = async () => {
  
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    // 🔥 CHECK ROLE
    console.log("CURRENT USER:", user);

    if (user.role !== "driver") {
      Alert.alert(
        "Driver Account Required",
        "You must switch to Driver and upload your license to publish a ride.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update Profile",
            onPress: () => router.push("/profile"),
          },
        ]
      );
      return;
    }

    // 🔥 CHECK LICENSE
    if (!user.licensePhoto) {
      Alert.alert(
        "License Required",
        "Please upload your driving license in your profile."
      );
      return;
    }

    console.log("🚀 SENDING:", {
      departure,
      departureCoords,
      destination,
      destinationCoords,
    });

    const response = await axios.post(`${BASE_URL}/rides`, {
      ownerId: user._id,
      departure,
      destination,
      departureCoords,
      destinationCoords,
      dateTime: date.toISOString(),
      price: Number(price),
      seatsTotal: Number(seats),
      femaleOnly,
      petsAllowed,
      noSmoking,
      airCondition,
      softJazz,
    });

    console.log("CREATED RIDE:", response.data);

    Alert.alert("Success", "Ride published successfully 🚗");

    router.replace("/available-rides");

  } catch (error: any) {
    console.log("PUBLISH ERROR", error.response?.data || error.message);
    Alert.alert("Error", "Failed to publish ride");
  }
};


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Publish a Ride</Text>
        </View>

        {/* STEP PROGRESS */}
        <Text style={styles.stepText}>Step 3 of 4: Ride Details</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        {/* BLUE INFO BOX */}
        <View style={styles.infoBox}>
          <Ionicons name="sparkles-outline" size={18} color="#137fec" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Great choice, Professor!</Text>
            <Text style={styles.infoSub}>Sharing your ride helps campus sustainability.</Text>
          </View>
        </View>

        {/* ROUTE INFO */}
        <Text style={styles.section}>ROUTE INFORMATION</Text>

   <Field label="DEPARTURE POINT">
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => {
      console.log("DEPARTURE CLICKED");
      Alert.alert(
        "Departure Location",
        "Choose option",
        [
          {
            text: "Enter Manually",
            onPress: () => console.log("Manual"),
          },
          {
            text: "Choose on Map",
            onPress: () =>
              router.push("/select-location-publish?type=departure"),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }}
  >
    <View style={styles.input}>
      <Text style={{ color: "#0F172A", fontWeight: "600" }}>
        {departure || "Tap to select departure"}
      </Text>
    </View>
  </TouchableOpacity>
</Field>

<Field label="DESTINATION">
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() =>
      Alert.alert(
        "Destination Location",
        "Choose option",
        [
          {
            text: "Enter Manually",
            onPress: () => console.log("Manual destination"),
          },
          {
            text: "Choose on Map",
            onPress: () =>
              router.push("/select-location-publish?type=destination"),
          },
          { text: "Cancel", style: "cancel" },
        ]
      )
    }
  >
    <View style={styles.input}>
      <Text style={{ color: "#0F172A", fontWeight: "600" }}>
        {destination || "Tap to select destination"}
      </Text>
    </View>
  </TouchableOpacity>
</Field>



        {/* DATE & TIME */}
        <Text style={styles.section}>SCHEDULE</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.input, styles.rowItem]} onPress={() => setShowDate(true)}>
            <Text style={styles.rowValue}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.input, styles.rowItem]} onPress={() => setShowTime(true)}>
            <Text style={styles.rowValue}>
              {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEATS */}
        <Text style={styles.section}>SEATS & CONTRIBUTION</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Available Seats</Text>

          <View style={styles.seatRow}>
            <TouchableOpacity onPress={() => setSeats(Math.max(1, seats - 1))}>
              <Ionicons name="remove-circle-outline" size={26} color="#0F172A" />
            </TouchableOpacity>

            <Text style={styles.seatNumber}>{seats}</Text>

            <TouchableOpacity onPress={() => setSeats(Math.min(6, seats + 1))}>
              <Ionicons name="add-circle" size={26} color="#137fec" />
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>Tip: Keep at least 1 seat for yourself.</Text>
        </View>

        {/* PRICE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price per Seat</Text>

          <View style={styles.priceRow}>
            <Text style={styles.currency}>D</Text>
            <TextInput
              value={String(price)}
              onChangeText={(v) => {
                // allow empty / dots gracefully
                const cleaned = v.replace(",", ".").replace(/[^0-9.]/g, "");
                const n = Number(cleaned);
                setPrice(Number.isFinite(n) ? n : 0);
              }}
              keyboardType="decimal-pad"
              style={styles.priceInput}
              placeholder="4.50"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Text style={styles.earning}>
            Estimated Total Earning: D{estimatedEarnings.toFixed(2)}
          </Text>
        </View>

        {/* EXTRA INFO */}
        <Text style={styles.section}>EXTRA INFO</Text>
        <View style={styles.extraBox}>
          <TextInput
            placeholder="Add any extra info..."
            placeholderTextColor="#94A3B8"
            multiline
            style={styles.extraInput}
          />
        </View>

        {/* PREFERENCES */}
        <Text style={styles.section}>RIDE PREFERENCES</Text>

        <Preference label="Pets Allowed" value={petsAllowed} onChange={setPetsAllowed} />
        <Preference label="No Smoking" value={noSmoking} onChange={setNoSmoking} />
        <Preference label="Air Condition" value={airCondition} onChange={setAirCondition} />
        <Preference label="Soft Jazz" value={softJazz} onChange={setSoftJazz} />
<Preference
  label="Female Only"
  value={femaleOnly}
  onChange={setFemaleOnly}
/>

        {/* PUBLISH BUTTON */}
        <TouchableOpacity style={styles.publishBtn} onPress={onPublish}>
          <Text style={styles.publishText}>Publish Ride</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* PICKERS */}
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(e, d) => {
            setShowDate(false);
            if (d) setDate(d);
          }}
        />
      )}

      {showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          onChange={(e, d) => {
            setShowTime(false);
            if (d) setDate(d);
          }}
        />
      )}
    </View>
  );
}

/* SMALL COMPONENTS */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.inputBox}>
      <Text style={styles.inputLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Preference({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.prefRow}>
      <Text style={styles.prefText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },
  content: { padding: 16 },

  header: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 6, borderRadius: 16 },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10, color: "#0F172A" },

  stepText: { marginTop: 15, color: "#64748B" },

  progressBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: { width: "75%", height: "100%", backgroundColor: "#137fec" },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E0ECFF",
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    gap: 10,
    alignItems: "center",
  },
  infoTitle: { fontWeight: "bold", color: "#137fec" },
  infoSub: { fontSize: 12, color: "#475569", marginTop: 2 },

  section: { marginTop: 20, fontSize: 12, fontWeight: "bold", color: "#94A3B8" },

  inputBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  inputLabel: { fontSize: 10, color: "#94A3B8", marginBottom: 6 },

  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontWeight: "600",
    color: "#0F172A",
  },

  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  rowItem: { flex: 1 },
  rowValue: { fontWeight: "600", color: "#0F172A" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  cardTitle: { fontWeight: "600", color: "#0F172A" },

  seatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  seatNumber: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  helperText: { marginTop: 10, fontSize: 12, color: "#64748B" },

  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  currency: { fontSize: 18, fontWeight: "bold", color: "#137fec", marginRight: 6 },
  priceInput: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontWeight: "700",
    color: "#0F172A",
  },

  earning: { fontSize: 12, color: "#64748B", marginTop: 10, fontWeight: "600" },

  extraBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  extraInput: { minHeight: 90, color: "#0F172A", fontWeight: "500" },

  prefRow: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prefText: { fontWeight: "600", color: "#0F172A" },

  publishBtn: {
    backgroundColor: "#137fec",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },
  publishText: { color: "#fff", fontWeight: "bold" },
});
