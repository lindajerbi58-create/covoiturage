import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";
import { TextInput } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useCallback } from "react";

export default function MessagesScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const router = useRouter();

  const [conversations, setConversations] = useState<any[]>([]);
  const [myId, setMyId] = useState(""); // 🔥 ajouté

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [])
  );

  const fetchConversations = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user) return;

      setMyId(user._id); // 🔥 IMPORTANT

      const res = await axios.get(
        `http://192.168.1.13:5000/api/messages/conversations/${user._id}`
      );

      setConversations(res.data.conversations);
    } catch (err) {
      console.log("FETCH CONVERSATIONS ERROR", err);
    }
  };

  const filteredConversations = conversations
    .filter((conv) => {
      if (activeFilter === "Unread") {
        return conv.unread > 0;
      }

      if (activeFilter === "Upcoming") {
        return conv.subtitle?.includes("Upcoming");
      }

      return true;
    })
    .filter((conv) =>
      conv?.name?.toLowerCase().startsWith(search.toLowerCase())
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Messages</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#8E8E93" />
        <TextInput
          placeholder="Search chats or rides"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filters}>
        <Filter
          label="All"
          active={activeFilter === "All"}
          onPress={() => setActiveFilter("All")}
        />
      </View>

      {/* Conversations */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item, index) =>
          item.id?.toString() ||
          item._id?.toString() ||
          index.toString()
        }
        
        renderItem={({ item }) => {

  console.log("FULL ITEM:", item);
  console.log("ITEM SENDER:", item.senderId);
  console.log("MY ID:", myId);

  return (
          
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
              
              if (!item.id) return;

              router.push({
                pathname: "/chat/[id]",
                params: {
                  id: item.id,
                  rideId: item.rideId?.toString() || "",
                  phone: item.phone,
                  name: item.name,
                  avatar: item.avatar,
                },
              });
            }}
          >
            <View>
              <Image
                source={{
                  uri:
                    item.avatar && !item.avatar.startsWith("http")
                      ? item.avatar
                      : item.avatar || "https://i.pravatar.cc/150",
                }}
                style={styles.avatar}
              />

              {item.online && <View style={styles.onlineDot} />}
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.rowBetween}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>

                  {item.role && (
                    <View
                      style={[
                        styles.roleBadge,
                        item.role === "Faculty" && styles.facultyBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          item.role === "Faculty" && styles.facultyText,
                        ]}
                      >
                        {item.role}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.time}>
                  {item.time
                    ? new Date(item.time).toLocaleTimeString()
                    : ""}
                </Text>
              </View>

              {/* 🔥 ICI ON AJOUTE LE YOU */}
             <Text style={styles.message}>
  {item.senderId &&
  item.senderId._id &&
  item.senderId._id.toString() === myId.toString()
    ? `You: ${item.message}`
    : item.message}
</Text>



              {item.subtitle && (
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              )}
            </View>

              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
          </TouchableOpacity>
        )}}
      />
    </View>
  );
}

function Filter({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filter, active && styles.activeFilter]}
    >
      <Text style={[styles.filterText, active && styles.activeFilterText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9ECF3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 15,
  },
  filters: {
    flexDirection: "row",
    marginBottom: 20,
  },
  filter: {
    backgroundColor: "#E9ECF3",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: "#2979FF",
  },
  filterText: {
    color: "#444",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "white",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: "#2ECC71",
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "white",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
    marginRight: 6,
  },
  roleBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  facultyBadge: {
    backgroundColor: "#EDE7F6",
  },
  roleText: {
    fontSize: 10,
    color: "#2979FF",
  },
  facultyText: {
    color: "#6A1B9A",
  },
  message: {
    color: "#444",
    marginTop: 3,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#8E8E93",
  },
  unreadBadge: {
    backgroundColor: "#2979FF",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: "#333",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
