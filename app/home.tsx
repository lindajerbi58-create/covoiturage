import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [currentAddress, setCurrentAddress] = useState("Getting location...");
const [pickup, setPickup] = useState("");
const [destination, setDestination] = useState("Where to?");
const params = useLocalSearchParams();
const [destinationCoords, setDestinationCoords] = useState<any>(null);

// 🔥 Recharge user quand on revient sur Home
useFocusEffect(
  useCallback(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();
  }, [])
);

// 🔥 Location seulement au premier render
useEffect(() => {
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setCurrentAddress("Permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (address.length > 0) {
      const place = address[0];
      const addressText = `${place.name || ""} ${place.street || ""}`;
      setCurrentAddress(addressText);
      setPickup(addressText);
    }
  };

  getLocation();
}, []);

useEffect(() => {
  if (params.destination) {
    setDestination(params.destination as string);
  }

  if (params.lat && params.lng) {
    const lat = Number(params.lat);
    const lng = Number(params.lng);

    setDestinationCoords({
      latitude: lat,
      longitude: lng,
    });

    getAddressFromCoords(lat, lng);
  }
}, [params.lat, params.lng, params.destination]);


const getAddressFromCoords = async (lat: number, lng: number) => {
  const address = await Location.reverseGeocodeAsync({
    latitude: lat,
    longitude: lng,
  });

  if (address.length > 0) {
    const place = address[0];
    const addressText = `${place.name || ""} ${place.street || ""}`;
    setDestination(addressText);
  }
};

const handlePickupPress = () => {
  Alert.alert(
    "Change Pickup Location",
    "Choose an option",
    [
      {
        text: "Use Current Location",
        onPress: () => setPickup(currentAddress),
      },
      {
        text: "Enter Manually",
        onPress: () => {
          Alert.prompt(
            "Enter Pickup Location",
            "Type your location",
            (text) => {
              if (text) setPickup(text);
            }
          );
        },
      },
      { text: "Cancel", style: "cancel" }
    ]
  );
};



  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.goodMorning}>GOOD MORNING,</Text>
            <Text style={styles.name}>
  {user ? user.fullName : "Loading..."}
</Text>

          </View>

          <View style={styles.avatarWrapper}>
         <Image
  source={{
    uri:
      user?.avatar ||
      "https://i.pravatar.cc/150",
  }}
  style={styles.avatar}
/>

            <View style={styles.notificationDot}>
              <Text style={styles.notificationText}>2</Text>
            </View>
          </View>
        </View>

        {/* SEARCH CARD */}
        <View style={styles.card}>
          
          {/* Vertical line */}
          <View style={styles.verticalLine} />

          {/* PICKUP */}
       <TouchableOpacity onPress={handlePickupPress}>
  <View style={styles.locationRow}>
    <View style={styles.iconCircleBlue}>
      <Ionicons name="locate" size={14} color="#137fec" />
    </View>
    <View>
      <Text style={styles.smallLabel}>PICKUP POINT</Text>
      <Text style={styles.inputText}>
        {pickup || "Current location"}
      </Text>
    </View>
  </View>
</TouchableOpacity>


          {/* DESTINATION */}
        <TouchableOpacity
  activeOpacity={0.7}
 onPress={() =>
  Alert.alert(
    "Choose Destination",
    "How do you want to set destination?",
    [
      {
        text: "Enter Manually",
        onPress: () => router.push("/enter-destination"),
      },
      {
        text: "Choose on Map",
        onPress: () => router.push("/select-location?type=destination"),
      },
      { text: "Cancel", style: "cancel" },
    ]
  )
}

  style={{ zIndex: 999 }} // force le touch
>
  <View style={styles.locationRow}>
    <View style={styles.iconCircleGreen}>
      <Ionicons name="location" size={14} color="#10b981" />
    </View>

    <View>
      <Text style={styles.smallLabel}>DESTINATION</Text>
      <Text style={styles.inputText}>
        {destination}
      </Text>
    </View>
  </View>
</TouchableOpacity>

          {/* DATE + FILTER */}
          <View style={styles.dateRow}>
            <TouchableOpacity style={styles.dateBtn}>
              <Ionicons name="calendar" size={18} color="#64748B" />
              <Text style={styles.dateText}>Today, Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="options" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* FIND BUTTON */}
 <TouchableOpacity
  style={styles.findBtn}
  onPress={() =>
    Alert.alert(
      "Find a Ride",
      "How do you want to search?",
      [
        {
          text: "Show Nearby (100m)",
          onPress: () => {
            if (!destinationCoords) {
              Alert.alert("Please select a destination first");
              return;
            }

            router.push({
              pathname: "/map-rides",
              params: {
                lat: destinationCoords.latitude,
                lng: destinationCoords.longitude,
              },
            });
          },
        },
        {
          text: "See All Available Rides",
          onPress: () => router.push("/available-rides"),
        },
        { text: "Cancel", style: "cancel" },
      ]
    )
  }
>
  <Ionicons name="search" size={18} color="#fff" />
  <Text style={styles.findText}>Find a Ride</Text>
</TouchableOpacity>

        </View>

        {/* RECENT SEARCHES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Search all</Text>
          <Text style={styles.clearAll}>Everywhere</Text>
        </View>

        {["Tunis", "Monastir"].map((item, index) => (
          <View key={index} style={styles.recentCard}>
            <View style={styles.historyCircle}>
              <Ionicons name="time-outline" size={18} color="#94A3B8" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>{item}</Text>
              <Text style={styles.recentSub}>Isimm</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </View>
        ))}

        {/* POPULAR ROUTES */}
        <Text style={styles.sectionTitle}>Popular Routes</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2].map((item) => (
            <View key={item} style={styles.routeCard}>
              <Image
                source={{
                  uri:
                    "https://rami.tn/wp-content/uploads/2023/07/ISIMM.webp",
                }}
                style={styles.routeImage}
              />
              <Text style={styles.routeLabel}>FASTEST ROUTE</Text>
              <Text style={styles.routeTitle}>
                Student  ➜  Library
              </Text>
              <View style={styles.routeTime}>
                <Ionicons name="time-outline" size={12} />
                <Text style={styles.timeText}>12 mins</Text>
              </View>
            </View>
          ))}
        </ScrollView>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" active />
        <TouchableOpacity
  style={{ alignItems: "center" }}
  onPress={() => router.push("/my-rides")}
>
  <Ionicons name="car" size={22} color="#94A3B8" />
  <Text style={{ fontSize: 10, color: "#94A3B8" }}>
    My Rides
  </Text>
</TouchableOpacity>

        <NavItem
  icon="chatbubble-outline"
  label="Messages"
  onPress={() => router.push("/messages")}
/>
        <NavItem
  icon="person-outline"
  label="Account"
  onPress={() => router.push("/profile")}
/>

      </View>
    </View>
  );
}

type NavItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  ctive?: boolean;
  onPress?: () => void;
};

function NavItem({ icon, label, active = false, onPress }: NavItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: "center", flex: 1 }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={active ? "#137fec" : "#94A3B8"}
      />
      <Text
        style={{
          fontSize: 10,
          marginTop: 2,
          color: active ? "#137fec" : "#94A3B8",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F8" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginTop: 50,
  },

  goodMorning: { fontSize: 12, color: "#94A3B8" },
  name: { fontSize: 24, fontWeight: "bold" },

  avatarWrapper: { position: "relative" },
  avatar: { width: 45, height: 45, borderRadius: 22 },
  notificationDot: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#137fec",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: { color: "#fff", fontSize: 10 },
dateText: {
  fontSize: 14,
  color: "#475569",
  fontWeight: "500",
},

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },

  verticalLine: {
    position: "absolute",
    left: 34,
    top: 40,
    height: 55,
    width: 2,
    backgroundColor: "#E2E8F0",
  },

  locationRow: { flexDirection: "row", gap: 15, alignItems: "center" },
  iconCircleBlue: {
    backgroundColor: "#DBEAFE",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleGreen: {
    backgroundColor: "#D1FAE5",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  smallLabel: { fontSize: 10, color: "#94A3B8" },
  inputText: { fontSize: 16, fontWeight: "500" },

  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
    marginLeft: 45,
  },

  dateRow: { flexDirection: "row", marginTop: 15, gap: 10 },

  dateBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  filterBtn: {
    width: 45,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  findBtn: {
    backgroundColor: "#137fec",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  findText: { color: "#fff", fontWeight: "bold" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 20 },

  clearAll: { color: "#137fec" },

  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  historyCircle: {
    backgroundColor: "#F1F5F9",
    width: 35,
    height: 35,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  recentTitle: { fontWeight: "bold" },
  recentSub: { fontSize: 12, color: "#94A3B8" },

  routeCard: {
    backgroundColor: "#fff",
    width: 200,
    marginLeft: 20,
    padding: 15,
    borderRadius: 15,
  },

  routeImage: { height: 90, borderRadius: 10, marginBottom: 10 },

  routeLabel: { fontSize: 10, color: "#137fec", fontWeight: "bold" },
  routeTitle: { fontWeight: "bold", fontSize: 14 },

  routeTime: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5 },
  timeText: { fontSize: 12 },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
});
