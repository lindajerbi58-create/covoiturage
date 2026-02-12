import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RideDetails() {
const router = useRouter();
const { id } = useLocalSearchParams();
const [ride, setRide] = useState<any>(null);
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const [showRating, setShowRating] = useState(false);
const [rating, setRating] = useState(0);

const confirmBooking = async () => {
  try {

    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    const res = await axios.post(
      `http://192.168.1.13:5000/api/rides/${ride._id}/join`,
      { userId: user._id }
    );

    setRide(res.data.ride);


    Alert.alert("Success", "Seat booked successfully!");

    router.replace("/my-rides");

  } catch (error) {
    console.log("BOOK ERROR:", error);
  }
};

const handleBook = () => {
  Alert.alert(
    "Confirm Booking",
    "Are you sure you want to book this seat?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: confirmBooking,
      },
    ]
  );
}
const handleMessagePress = () => {
  Alert.alert(
    "Send Message",
    `Do you want to send a message to ${ride?.ownerId?.fullName}?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
         router.push({
  pathname: "/chat/[id]",
  params: {
    id: ride?.ownerId?._id,
    rideId: ride?._id,   // 🔥 IMPORTANT
    name: ride?.ownerId?.fullName,
    phone: ride?.ownerId?.phone,
    avatar: ride?.ownerId?.avatar,
  },
});

        },
      },
    ]
  );
};

useEffect(() => {
  if (id) {
    fetchRide();
  }
}, [id]);
useEffect(() => {
  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user) setCurrentUserId(user._id);
  };

  loadUser();
}, []);

useEffect(() => {
  if (!ride || !currentUserId) return;

  const isPassenger = ride.passengers?.some(
    (p: any) => p.toString() === currentUserId
  );

  const isCompleted = ride.status === "completed";

  if (isPassenger && isCompleted && !ride.ratedBy?.includes(currentUserId)) {
    setShowRating(true);
  }

}, [ride]);

const fetchRide = async () => {
  try {
    const res = await axios.get(
      `http://192.168.1.13:5000/api/rides/${id}`
    );
    setRide(res.data.ride);
   console.log("FULL RIDE OBJECT:", res.data.ride);
console.log("STATUS:", res.data.ride?.status);
console.log("PASSENGERS:", res.data.ride?.passengers);
console.log("RATED BY:", res.data.ride?.ratedBy);
  } catch (error) {
    console.log("FETCH RIDE ERROR", error);
  }
};
const alreadyBooked =
  ride?.passengers?.includes(currentUserId);

const isOwner =
  ride?.ownerId?._id === currentUserId;

const noSeatsLeft =
  ride?.passengers?.length >= ride?.seatsTotal;

  if (!ride) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Loading...</Text>
    </View>
  );
}
const submitRating = async () => {
  try {
    await axios.post(
      `http://192.168.1.13:5000/api/rides/${ride._id}/rate`,
      {
        userId: currentUserId,
        rating,
      }
    );

    setShowRating(false);
    Alert.alert("Thank you!", "Rating submitted ⭐");

  } catch (error) {
    console.log("RATE ERROR", error);
  }
};

  return (
    
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
           <TouchableOpacity
      style={styles.backButton}
      onPress={() => router.replace("/available-rides")}
    >
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>

        {/* MAP IMAGE */}
        <View>
        <Image
  source={{
   uri:
  ride?.ownerId?.avatar ||
  "https://i.pravatar.cc/150",

  }}
  style={{
    width: 45,
    height: 45,
    borderRadius: 22,
  }}
/>


          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-social-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* WHITE CARD */}
        <View style={styles.card}>

          {/* TAGS */}
          <View style={styles.tagsRow}>
            <View style={styles.blueTag}>
              <Text style={styles.blueTagText}>FACULTY PICK</Text>
            </View>
            <View style={styles.greenTag}>
              <Text style={styles.greenTagText}>ON-TIME</Text>
            </View>
          </View>

          {/* TITLE */}
          <Text style={styles.title}>
  {ride?.departure} → {ride?.destination}
</Text>

<Text style={styles.subtitle}>
  Departure at {new Date(ride?.dateTime).toLocaleTimeString()}
</Text>


          {/* DRIVER CARD */}
          <View style={styles.driverCard}>
            <View style={styles.driverLeft}>
              <Image
  source={{
    uri:
      ride?.ownerId?.avatar ||
      "https://i.pravatar.cc/150",
  }}
  style={styles.avatar}
/>

              <View>
  <TouchableOpacity onPress={handleMessagePress}>
  <Text style={[styles.driverName, { color: "#137fec" }]}>
    {ride?.ownerId?.fullName}
  </Text>
</TouchableOpacity>


                <Text style={styles.driverSub}>
                  Driver • Isimm
                </Text>
              </View>
            </View>

            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#FACC15" />
           <Text style={styles.ratingText}>
{ride?.ownerId?.rating?.toFixed(1) || "0.0"}

</Text>

            </View>
          </View>

          {/* PICKUP & DROPOFF */}
          <View style={styles.locationSection}>
            <View style={styles.dotBlue} />
            <View style={styles.lineVertical} />
            <View style={styles.dotDark} />

           <View style={styles.locationText}>
  <Text style={styles.pickup}>PICKUP</Text>

  <Text style={styles.location}>
    {ride?.departure}
  </Text>

  <Text style={[styles.pickup, { marginTop: 20 }]}>
    DROP-OFF
  </Text>

  <Text style={styles.location}>
    {ride?.destination}
  </Text>
</View>

          </View>

          {/* RIDE PREFERENCES */}
          <Text style={styles.sectionTitle}>Ride Preferences</Text>

        <View style={styles.preferences}>

  {ride?.femaleOnly && (
    <Pref icon="female-outline" label="Female Only" />
  )}

  {ride?.noSmoking && (
    <Pref icon="ban-outline" label="No Smoking" />
  )}

  {ride?.softJazz && (
    <Pref icon="musical-notes-outline" label="Soft Jazz" />
  )}

  {ride?.petsAllowed && (
    <Pref icon="paw-outline" label="Pets Welcome" />
  )}

  {ride?.airCondition && (
    <Pref icon="snow-outline" label="Air Condition" />
  )}

</View>



          {/* STATS */}
          <View style={styles.stats}>
           
            <Stat
  label="Seats Left"
  value={`${ride?.seatsTotal - ride?.passengers?.length}/${ride?.seatsTotal}`}
  highlight
/>

          </View>

          {/* PRICE + BUTTON */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalPrice}>
  D{ride?.price}
</Text>

              <Text style={styles.perSeat}>/SEAT</Text>
            </View>
<TouchableOpacity
  style={[
    styles.bookBtn,
    (alreadyBooked || isOwner || noSeatsLeft) && {
      backgroundColor: "#94A3B8",
    },
  ]}
  disabled={alreadyBooked || isOwner || noSeatsLeft}
  onPress={
    !alreadyBooked && !isOwner && !noSeatsLeft
      ? handleBook
      : undefined
  }
>
  <Text style={styles.bookText}>
    {isOwner
      ? "Your Ride"
      : noSeatsLeft
      ? "No Seats Left"
      : alreadyBooked
      ? "Already Booked"
      : "Book Seat"}
  </Text>
</TouchableOpacity>


          </View>

        </View>
          </ScrollView>

      {showRating && (
        <View style={styles.ratingOverlay}>
          <View style={styles.popupBox}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Rate your driver
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={30}
                    color="#FACC15"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.submitRating}
              onPress={submitRating}
            >
              <Text style={{ color: "#fff" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>

  );
}

/* SMALL COMPONENTS */

function Pref({ icon, label }: any) {
  return (
    <View style={styles.prefBox}>
      <Ionicons name={icon} size={16} color="#64748B" />
      <Text style={styles.prefText}>{label}</Text>
    </View>
  );
}

function Stat({ label, value, highlight }: any) {
  

  return (
    
    <View style={{ alignItems: "center" }}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[
          styles.statValue,
          highlight && { color: "#137fec" },
        ]}
      >
        {value}
      </Text>
      
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },

  map: { width: "100%", height: 280 },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
  },

  shareBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -30,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  tagsRow: { flexDirection: "row", gap: 8 },

  blueTag: {
    backgroundColor: "#E0ECFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},

submitRating: {
  marginTop: 15,
  backgroundColor: "#137fec",
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 10,
},
popupBox: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 16,
  alignItems: "center",
},

  blueTagText: { color: "#137fec", fontSize: 10 },

  greenTag: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  greenTagText: { color: "#16A34A", fontSize: 10 },

  title: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  subtitle: { color: "#64748B", marginBottom: 15 },

  driverCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  driverLeft: { flexDirection: "row", gap: 10, alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  driverName: { fontWeight: "bold" },
  driverSub: { fontSize: 12, color: "#64748B" },
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

  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: { fontWeight: "bold" },

  locationSection: { marginTop: 20 },
  dotBlue: {
    width: 10,
    height: 10,
    backgroundColor: "#137fec",
    borderRadius: 5,
    position: "absolute",
    left: 0,
    top: 8,
  },
  dotDark: {
    width: 10,
    height: 10,
    backgroundColor: "#0F172A",
    borderRadius: 5,
    position: "absolute",
    left: 0,
    top: 70,
  },
  lineVertical: {
    position: "absolute",
    left: 4,
    top: 18,
    height: 50,
    width: 2,
    backgroundColor: "#E2E8F0",
  },
  locationText: { marginLeft: 20 },
  pickup: { fontSize: 10, color: "#94A3B8" },
  location: { fontWeight: "600" },

  sectionTitle: { marginTop: 20, fontWeight: "bold" },

  preferences: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  prefBox: {
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  prefText: { fontSize: 12 },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statLabel: { fontSize: 10, color: "#94A3B8" },
  statValue: { fontWeight: "bold", marginTop: 4 },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  totalLabel: { fontSize: 12, color: "#94A3B8" },
  totalPrice: { fontSize: 22, fontWeight: "bold" },
  perSeat: { fontSize: 10, color: "#94A3B8" },

  bookBtn: {
    backgroundColor: "#137fec",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 14,
  },
  bookText: { color: "#fff", fontWeight: "bold" },
});
