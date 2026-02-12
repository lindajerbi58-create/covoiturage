import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/AuthContext";
// ⚠️ ajuste le chemin selon ton dossier

const BASE_URL = "http://192.168.1.13:5000/api";

/* ================= TYPES ================= */

type FilterProps = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
};

type RideCardProps = {
  name: string;
  id:string;
  rating: string;
  role: string;
  price: string;
  start: string;
  end: string;
  from: string;
  to: string;
  car: string;
  seats: string;
  warning?: boolean;
  femaleOnly?: boolean;
};

type NavProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
};

/* ================= MAIN COMPONENT ================= */

export default function AvailableRides() {
  const router = useRouter();
const [rides, setRides] = useState<any[]>([]);
const [after4pm, setAfter4pm] = useState(false);
const { user } = useAuth();
 const { setUser } = useAuth();
const [minPrice, setMinPrice] = useState<number | null>(null);
const [maxPrice, setMaxPrice] = useState<number | null>(null);
const [femaleOnly, setFemaleOnly] = useState(false);
const [minRating, setMinRating] = useState<number | null>(null);
const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
console.log("USER:", user);
const fetchRides = async () => {
  try {
    const params: any = {};

    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;
    if (femaleOnly) params.femaleOnly = true;
    if (minRating !== null) params.minRating = minRating;
    if (after4pm) params.after4pm = true;

    const res = await axios.get(`${BASE_URL}/rides`, { params });

console.log("RIDES FROM API:", res.data.rides);

const now = new Date();
const myId = user?._id;

console.log("MY ID:", myId);

    const filteredRides = res.data.rides.filter((ride: any) => {
      const isFuture = new Date(ride.dateTime) > now;
      const notMine =
  ride.ownerId?._id?.toString() !== myId?.toString();

      const seatsLeft =
        ride.seatsTotal - (ride.passengers?.length || 0) > 0;

      return isFuture && notMine && seatsLeft;
    });

    setRides(filteredRides);

  } catch (error) {
    console.log("FETCH RIDES ERROR", error);
  }
};

useEffect(() => {
  if (user?._id) {
    fetchRides();
  }
}, [user, minPrice, maxPrice, femaleOnly, minRating, after4pm]);


const sortedRides = [...rides];

if (priceSort === "asc") {
  sortedRides.sort((a, b) => a.price - b.price);
}

if (priceSort === "desc") {
  sortedRides.sort((a, b) => b.price - a.price);
}

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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#137fec" />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.route}>Tunisia</Text>
            <Text style={styles.time}>Available</Text>
          </View>

          <View style={styles.mapBtn}>
            <Ionicons name="map" size={18} color="#137fec" />
          </View>
        </View>

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
        >
          <Filter
  label="Price ≤ 5D"
  active={maxPrice === 5}
  onPress={() => setMaxPrice(maxPrice === 5 ? null : 5)}
/>

 <Filter
  label="After 4 PM"
  active={after4pm}
  onPress={() => setAfter4pm(!after4pm)}
/>

<Filter
  icon="female"
  label="Female Only"
  active={femaleOnly}
  onPress={() => setFemaleOnly(!femaleOnly)}
/>
<Filter
  icon="star"
  label="Rating 4.5+"
  active={minRating === 4.5}
  onPress={() => setMinRating(minRating === 4.5 ? null : 4.5)}
/>

        </ScrollView>

        {/* MAP PREVIEW */}
        <View style={styles.mapPreview}>
<Image
  source={require("../assets/images/hay.jpg")}
  style={styles.mapImage}
  resizeMode="cover"
/>


          <View style={styles.mapOverlay} />
          <View style={styles.mapBadge}>
            <View style={styles.dot} />
            <Text style={styles.mapText}>Drivers nearby</Text>
          </View>
        </View>

        {/* RESULTS HEADER */}
       <View style={styles.resultsHeader}>
  <Text style={styles.resultsText}>
    {sortedRides.length} Available Rides
  </Text>

  <TouchableOpacity
    style={styles.sort}
    onPress={() => {
      if (priceSort === null) setPriceSort("asc");
      else if (priceSort === "asc") setPriceSort("desc");
      else setPriceSort(null);
    }}
  >
    <Ionicons
      name="swap-vertical"
      size={16}
      color={priceSort ? "#ef4444" : "#137fec"}
    />
    <Text style={styles.sortText}>
      {priceSort === "asc"
        ? "Cheapest"
        : priceSort === "desc"
        ? "Most Expensive"
        : "Sort by Price"}
    </Text>
  </TouchableOpacity>
</View>


       
   {sortedRides.map((ride) => (

  <RideCard
    key={ride._id}
    id={ride._id} 
    name={ride.ownerId?.fullName || "Unknown"}
    rating={ride.rating ? ride.rating.toString() : "0"}
    role={ride.ownerId?.role || "User"}
    price={`D${ride.price}`}
    start={new Date(ride.dateTime).toLocaleTimeString()}
    end=""
    from={ride.departure}
    to={ride.destination}
    car={ride.car || "Car not specified"}
    seats={`${ride.seatsTotal || 0} seats`}
    femaleOnly={ride.femaleOnly}
  />
))}


      </ScrollView>
 <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push("/publish")}
    >
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <Nav icon="search" label="Explore" active />
        <Nav icon="calendar-outline" label="My Rides" />
        <Nav icon="chatbubble-outline" label="Inbox" />
        <Nav icon="person-outline" label="Account" />
      </View>
      
    </View>
  );
}

/* ================= COMPONENTS ================= */

function Filter({ label, icon, active = false, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filter, active && styles.filterActive]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={12}
          color={active ? "#fff" : "#137fec"}
        />
      )}
      <Text style={[styles.filterText, active && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}


function RideCard({
    id,
  name,
  rating,
  role,
  price,
  start,
  end,
  from,
  to,
  car,
  seats,
  warning,
  femaleOnly,
}: RideCardProps) {
    const router = useRouter();
return (
  <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/ride/[id]",
          params: { id },   // ✅ ENVOIE LE BON ID
        })
      }
    >
    <View style={styles.cardTop}>
      <View>
        <Text style={styles.name}>{name}</Text>
        {femaleOnly && (
          <Text style={styles.badge}>WOMEN ONLY</Text>
        )}
        <Text style={styles.sub}>
          {rating} ★ • {role}
        </Text>
      </View>

      <View>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.perSeat}>PER SEAT</Text>
      </View>
    </View>

    <View style={styles.times}>
      <Text>{start}</Text>
      <Text style={styles.line}>|</Text>
      <Text>{end}</Text>
    </View>

    <Text style={styles.place}>• {from}</Text>
    <Text style={styles.place}>• {to}</Text>

    <View style={styles.cardBottom}>
      <Text style={styles.car}>{car}</Text>
      <Text
        style={[
          styles.seats,
          warning && { color: "#f97316" },
        ]}
      >
        {seats}
      </Text>
    </View>
  </TouchableOpacity>
);
}
function Nav({ icon, label, active }: any) {
  const router = useRouter();

  const handlePress = () => {
    if (label === "Explore") {
      router.push("/available-rides");
    }

    if (label === "My Rides") {
      router.push("/my-rides");
    }

    if (label === "Inbox") {
      router.push("/messages");
    }

    if (label === "Account") {
      router.push("/profile");
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ alignItems: "center" }}
    >
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


/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },

  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  route: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  time: { fontSize: 16, fontWeight: "bold" },
  mapBtn: { backgroundColor: "#E0ECFF", padding: 8, borderRadius: 20 },

  filters: { paddingHorizontal: 12, marginBottom: 10 },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  filterActive: { backgroundColor: "#137fec" },
  filterText: { fontSize: 12, fontWeight: "600", color: "#137fec" },

  mapPreview: {
    height: 140,
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
mapImage: {
  width: "100%",
  
  height: 300,  // ou la hauteur que tu veux
  borderRadius: 15,
},

  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  mapBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#137fec",
    borderRadius: 4,
    marginRight: 6,
  },
  mapText: { color: "#fff", fontSize: 12 },

  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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

  resultsText: { color: "#64748B" },
  sort: { flexDirection: "row", alignItems: "center" },
  sortText: { color: "#137fec", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontWeight: "bold" },
  badge: {
    color: "#ec4899",
    fontSize: 10,
    fontWeight: "700",
  },
  sub: { fontSize: 12, color: "#64748B" },
  price: { fontSize: 18, fontWeight: "bold", color: "#137fec" },
  perSeat: { fontSize: 10, color: "#94A3B8" },

  times: { flexDirection: "row", marginTop: 10 },
  line: { color: "#137fec", marginHorizontal: 6 },
  place: { fontSize: 13, color: "#475569", marginTop: 4 },
avatar: {
  width: 50,
  height: 50,
  borderRadius: 25,
  resizeMode: "cover",
},

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  car: { fontSize: 12, color: "#64748B" },
  seats: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#137fec",
  },
fab: {
  position: "absolute",
  bottom: 80,
  right: 20,
  backgroundColor: "#137fec",
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
  elevation: 5,
},

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
});
