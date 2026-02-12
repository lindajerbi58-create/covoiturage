import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const BASE_URL = "http://192.168.1.13:5000/api";

export default function MapRides() {
  const router = useRouter();

  const params = useLocalSearchParams();
  console.log("PARAMS:", params);

  const [rides, setRides] = useState<any[]>([]);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  /* ================= GET REAL LOCATION ================= */

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    let location = await Location.getCurrentPositionAsync({});
    console.log("REAL LOCATION:", location.coords);

    setUserLat(location.coords.latitude);
    setUserLng(location.coords.longitude);
  };

  console.log("USER LAT:", userLat);
  console.log("USER LNG:", userLng);

  /* ================= DISTANCE FUNCTION ================= */

  const getDistanceInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  /* ================= FETCH NEARBY ================= */

  const fetchNearby = async () => {
    if (!userLat || !userLng) return;

    try {
      const res = await axios.get(`${BASE_URL}/rides`);

      console.log("ALL RIDES:", res.data.rides);
      console.log("USER COORDS:", userLat, userLng);

  const filtered = res.data.rides.filter((ride: any) => {
  console.log("CHECKING RIDE:", ride);

  // ❌ Ignore si pas de coords
  if (!ride.departureCoords) {
    console.log("NO departureCoords:", ride);
    return false;
  }

  // ❌ Ignore si date passée
  const rideDate = new Date(ride.dateTime);
  const now = new Date();

  if (rideDate <= now) {
    console.log("RIDE EXPIRED:", ride._id);
    return false;
  }

  // ✅ Calcul distance
  const distance = getDistanceInMeters(
    userLat,
    userLng,
    ride.departureCoords.latitude,
    ride.departureCoords.longitude
  );

  console.log("DISTANCE:", distance);

  return distance <= 10000; // 10km
});

      setRides(filtered);
    } catch (err) {
      console.log("MAP RIDES ERROR", err);
    }
  };

  /* ================= EFFECTS ================= */

  // Get location on mount
  useEffect(() => {
    getLocation();
  }, []);

  // Fetch rides when location ready
  useEffect(() => {
    if (userLat && userLng) {
      console.log("FETCH NEARBY TRIGGERED");
      fetchNearby();
    }
  }, [userLat, userLng]);

  /* ================= RENDER ================= */

  if (!userLat || !userLng) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Getting location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* MAP */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: userLat,
          longitude: userLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {rides.map((ride) => {
          if (!ride.departureCoords) return null;

          return (
            <Marker
              key={ride._id}
              coordinate={{
                latitude: ride.departureCoords.latitude,
                longitude: ride.departureCoords.longitude,
              }}
              onPress={() => {
                console.log("MARKER PRESSED:", ride._id);

                router.push({
                  pathname: "/ride/[id]",
                  params: { id: ride._id },
                });
              }}
            >
              <View
                style={{
                  backgroundColor: "#137fec",
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {ride.price}D
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* BOTTOM SHEET */}
      {/* IMPORTANT: pointerEvents="auto" pour que les cards reçoivent bien les clicks */}
      <View style={styles.sheet} pointerEvents="auto">
        <View style={styles.dragBar} />

        <View style={styles.headerRow}>
          <Text style={styles.title}>Nearby Rides</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{rides.length} AVAILABLE</Text>
          </View>
        </View>

        {rides.length === 0 ? (
          <Text style={styles.noRide}>No rides within 10km</Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {rides.map((ride) => (
              // ✅ ICI: View -> TouchableOpacity (cliquable)
              <TouchableOpacity
                key={ride._id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => {
                  console.log("CARD PRESSED:", ride._id);

                  router.push({
                    pathname: "/ride/[id]",
                    params: { id: ride._id },
                  });
                }}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="car" size={18} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{ride.destination}</Text>
                  <Text style={styles.cardSub}>
                    {ride.seatsTotal - ride.passengers.length} seats left
                  </Text>
                </View>

                <Text style={styles.price}>{ride.price}D</Text>

                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "55%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  dragBar: {
    width: 50,
    height: 5,
    backgroundColor: "#CBD5E1",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#E0ECFF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: "#137fec",
    fontWeight: "600",
    fontSize: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    gap: 12,
  },
  iconBox: {
    backgroundColor: "#137fec",
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  cardSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  price: {
    fontWeight: "bold",
    color: "#137fec",
    marginRight: 6,
  },
  noRide: {
    textAlign: "center",
    marginTop: 30,
    color: "#64748B",
  },
});
