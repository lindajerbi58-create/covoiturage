import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BASE_URL = "http://192.168.1.13:5000/api";

export default function Profile() {
  const router = useRouter();
  useEffect(() => {
  const checkAuth = async () => {
    const storedUser = await AsyncStorage.getItem("user");

    if (!storedUser) {
      router.replace("/");
    }
  };

  checkAuth();
}, []);

const [user, setUser] = useState<any>(null);
const [rides, setRides] = useState<any[]>([]);

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    base64: true,
  });

  if (!result.canceled) {
    const imageUri = result.assets[0].uri;

    await updateAvatar(imageUri);
  }
};

const updateAvatar = async (imageUri: string) => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) return;

    const res = await axios.put(
      "http://192.168.1.13:5000/api/auth/update/" + user._id,
      {
        avatar: imageUri,
      }
    );

    // 🔥 METTRE À JOUR STORAGE
    await AsyncStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    // 🔥 METTRE À JOUR CONTEXT SI TU UTILISE useAuth
    setUser(res.data.user);

    console.log("AVATAR SAVED:", res.data.user.avatar);

  } catch (error) {
    console.log("AVATAR UPDATE ERROR:", error);
  }
};


const fetchUserRides = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user) return;

    const res = await axios.get(
      `${BASE_URL}/rides/user/${user._id}`
    );

    setRides(res.data.rides);

  } catch (error) {
    console.log("PROFILE RIDES ERROR", error);
  }
};useFocusEffect(
  useCallback(() => {
    fetchUserRides();
  }, [])
);


useEffect(() => {
  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  loadUser();
}, []);
if (!user) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Loading profile...</Text>
    </View>
  );
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
          <Text style={styles.title}>Profile</Text>
         <TouchableOpacity onPress={() => router.push("/edit-profile")}>
  <Text style={styles.edit}>Edit</Text>
</TouchableOpacity>

        </View>

        {/* PROFILE IMAGE */}
        <View style={styles.avatarContainer}>
          <Image
  source={
    user.avatar
      ? { uri: user.avatar }
      : require("../assets/images/default-avatar.jpg")
  }
  style={styles.avatar}
/>

         <TouchableOpacity
  style={styles.cameraIcon}
  onPress={pickImage}
>
  <Ionicons name="camera" size={16} color="#fff" />
</TouchableOpacity>

        </View>

       <Text style={styles.name}>{user.fullName}</Text>


{user?.isVerified ? (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>Driver Verified ✅</Text>
  </View>
) : (
  <View style={[styles.badge, { backgroundColor: "#FEE2E2" }]}>
    <Text style={[styles.badgeText, { color: "#EF4444" }]}>
      Not Verified
    </Text>
  </View>
)}


        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
 {rides.length}

</Text>

            <Text style={styles.statLabel}>TOTAL RIDES</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
  {user.rating ?? 5} <Ionicons name="star" size={16} color="#FACC15" />
<Text>
  {user?.rating?.toFixed(1) || "0.0"}
</Text>

</Text>

            <Text style={styles.statLabel}>OVERALL RATING</Text>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={styles.section}>ACCOUNT</Text>

<MenuItem
  icon="card-outline"
  title="Payment Method"
  subtitle={
    user?.paymentMethod === "card"
      ? "Card"
      : user?.paymentMethod === "cash"
      ? "Cash"
      : "Not set"
  }
  onPress={() => {
    if (user?.paymentMethod === "card") {
      router.push("/payment");
    } else {
      alert("Payment method is Cash");
    }
  }}
/>

<View style={styles.menuItem}>
  <Ionicons name="car-outline" size={20} color="#137fec" />
  <View style={{ flex: 1, marginLeft: 10 }}>
    <Text style={styles.menuTitle}>Vehicle Info</Text>
    <Text style={styles.menuSubtitle}>
      {user?.vehicleInfo || "Not set"}
    </Text>
  </View>
</View>



        {/* SETTINGS SECTION */}
        <Text style={styles.section}>APP SETTINGS</Text>
<View style={styles.menuItem}>
  <Ionicons name="options-outline" size={20} color="#137fec" />
  <View style={{ flex: 1, marginLeft: 10 }}>
    <Text style={styles.menuTitle}>Preferences</Text>
    <Text style={styles.menuSubtitle}>
      {[
        user?.preferences?.noSmoking && "No Smoking",
        user?.preferences?.petsAllowed && "Pets Allowed",
        user?.preferences?.airCondition && "Air Condition",
        user?.preferences?.softJazz && "Soft Jazz",
      ]
        .filter(Boolean)
        .join(" • ") || "No preferences"}
    </Text>
  </View>
</View>

       <MenuItem
  icon="help-circle-outline"
  title="Support"
  onPress={() =>
    Alert.alert(
      "Support Contact",
      "Email: lindajerbi58@gmail.com\nPhone: 26331540",
      [
        { text: "Close", style: "cancel" },
        {
          text: "Call",
          onPress: () => Linking.openURL("tel:26331540"),
        },
        {
          text: "Email",
          onPress: () =>
            Linking.openURL("mailto:lindajerbi58@gmail.com"),
        },
      ]
    )
  }
/>

        {/* SIGN OUT */}
 <TouchableOpacity
  style={styles.signOut}
  onPress={async () => {
    await AsyncStorage.removeItem("user");

   router.replace({
  pathname: "/",
});
// 👈 IMPORTANT
  }}
>



          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>CAMPUSRIDE v2.4.0</Text>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <Nav icon="car-outline" label="Rides" />
        <Nav icon="search-outline" label="Find" />
        <Nav icon="chatbubble-outline" label="Inbox" />
        <Nav icon="person" label="Account" active />
      </View>
    </View>
  );
}

/* ================= MENU ITEM ================= */

function MenuItem({ icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color="#137fec" />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

/* ================= NAV ================= */

function Nav({ icon, label, active }: any) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        if (label === "Rides") router.push("/available-rides");
        if (label === "Find") router.push("/available-rides");
        if (label === "Inbox") router.push("/messages");
        if (label === "Account") router.push("/profile");
      }}
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
  container: { flex: 1, backgroundColor: "#f6f7f8", padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 22, fontWeight: "bold" },

  edit: { color: "#137fec", fontWeight: "600" },

  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 120,
    backgroundColor: "#137fec",
    padding: 6,
    borderRadius: 20,
  },
backButton: {
  backgroundColor: "#E0ECFF",
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 12,
  alignSelf: "flex-start",
  marginBottom: 10,
},

backText: {
  color: "#137fec",
  fontWeight: "bold",
  fontSize: 14,
},

  name: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },

  badge: {
    backgroundColor: "#E0ECFF",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },

  badgeText: { color: "#137fec", fontSize: 12 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 5,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#137fec",
  },

  statLabel: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 4,
  },

  section: {
    marginTop: 25,
    fontSize: 12,
    fontWeight: "bold",
    color: "#94A3B8",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },

  menuTitle: { fontWeight: "600" },

  menuSubtitle: { fontSize: 12, color: "#64748B" },

  signOut: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 25,
    alignItems: "center",
  },

  signOutText: {
    color: "#ef4444",
    fontWeight: "600",
  },

  version: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 10,
    color: "#94A3B8",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
});
