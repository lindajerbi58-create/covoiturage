import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BASE_URL = "http://192.168.1.13:5000/api";

export default function MyRides() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");

  const [publishedRides, setPublishedRides] = useState<any[]>([]);
  const [participatedRides, setParticipatedRides] = useState<any[]>([]);

  const now = new Date();

  const upcomingRides = publishedRides.filter(
    (ride) => new Date(ride.dateTime) >= now
  );

  const historyRides = publishedRides.filter(
    (ride) => new Date(ride.dateTime) < now
  );

  const fetchMyRides = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user) return;

      const res = await axios.get(`${BASE_URL}/rides`);
      const allRides = res.data.rides;

      const published = allRides.filter(
        (ride: any) => ride.ownerId?._id === user._id
      );

      const participated = allRides.filter(
        (ride: any) => ride.passengers?.includes(user._id)
      );

      setPublishedRides(published);
      setParticipatedRides(participated);

    } catch (error) {
      console.log("MY RIDES ERROR", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyRides();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
           <TouchableOpacity
      style={styles.backButton}
      onPress={() => router.replace("/home")}
    >
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>My Rides</Text>
          <TouchableOpacity style={styles.bell}>
            <Ionicons name="notifications-outline" size={22} color="#137fec" />
          </TouchableOpacity>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={activeTab === "upcoming" ? styles.activeTab : styles.inactiveTab}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text>Upcoming as a driver </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={activeTab === "history" ? styles.activeTab : styles.inactiveTab}
            onPress={() => setActiveTab("history")}
          >
            <Text>History as a driver </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={activeTab === "participated" ? styles.activeTab : styles.inactiveTab}
            onPress={() => setActiveTab("participated")}
          >
            <Text>Participated</Text>
          </TouchableOpacity>
        </View>

        {/* RIDES DISPLAY */}
        {activeTab === "upcoming" &&
          upcomingRides.map((ride) => (
            <RideCard key={ride._id} ride={ride} />
          ))}

        {activeTab === "history" &&
          historyRides.map((ride) => (
            <RideCard key={ride._id} ride={ride} />
          ))}

        {activeTab === "participated" &&
          participatedRides.map((ride) => (
            <RideCard key={ride._id} ride={ride} />
          ))}

      </ScrollView>

      {/* FLOAT BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/publish")}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <Nav icon="home-outline" label="Home" />
        <Nav icon="car" label="My Rides" active />
        <Nav icon="chatbubble-outline" label="Messages" onPress={() => router.push("/messages")} />
        <Nav icon="person-outline" label="Profile" onPress={() => router.push("/profile")} />
      </View>
    </View>
  );
}

function RideCard({ ride }: any) {
  const router = useRouter();
  const isUpcoming = new Date(ride.dateTime) > new Date();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/ride/[id]",
          params: { id: ride._id },
        })
      }
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.time}>
            {new Date(ride.dateTime).toLocaleString()}
          </Text>
          <Text
            style={[
              styles.status,
              !isUpcoming && { color: "#ef4444" },
            ]}
          >
            {isUpcoming ? "Upcoming" : "Completed"}
          </Text>
        </View>

        <Text style={styles.price}>
          D{ride.price}
        </Text>
      </View>

      <View style={styles.route}>
        <Text style={styles.routeText}>From</Text>
        <Text style={styles.bold}>{ride.departure}</Text>
        <Text style={styles.routeText}>To</Text>
        <Text style={styles.bold}>{ride.destination}</Text>
      </View>

      <View style={styles.driverRow}>
        <Text style={styles.driver}>
          Driver: {ride.ownerId?.fullName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function Nav({ icon, label, active = false, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: "center" }}>
      <Ionicons
        name={icon}
        size={22}
        color={active ? "#137fec" : "#94A3B8"}
      />
      <Text
        style={{
          fontSize: 10,
          color: active ? "#137fec" : "#94A3B8",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8", padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 22, fontWeight: "bold" },

  bell: {
    backgroundColor: "#E0ECFF",
    padding: 10,
    borderRadius: 20,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    marginTop: 20,
    padding: 4,
  },

  activeTab: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  inactiveTab: {
    flex: 1,
    padding: 8,
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
  backgroundColor: "#E0ECFF",
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 10,
  alignSelf: "flex-start",
  marginBottom: 10,
},

backText: {
  color: "#137fec",
  fontWeight: "bold",
},


  time: { fontSize: 12, color: "#64748B" },

  status: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#22c55e",
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#137fec",
  },

  route: { marginTop: 12 },

  routeText: { fontSize: 12, color: "#94A3B8" },

  bold: { fontWeight: "600", marginBottom: 6 },

  driverRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },

  driver: { color: "#475569" },

  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#137fec",
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
});
