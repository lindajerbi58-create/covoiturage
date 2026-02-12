import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const id = params.id?.toString();
  const rideId = params.rideId?.toString();
  const name = params.name?.toString();
  const avatar = params.avatar?.toString();
const phone = params.phone?.toString();
console.log("PHONE RECEIVED:", phone);

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [myId, setMyId] = useState("");
console.log("CHAT PARAMS:", { id, name, rideId, avatar });
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (user) setMyId(user._id);
    };
    loadUser();
  }, []);
const handleCall = async () => {
  if (!phone) {
    Alert.alert("No phone number available");
    return;
  }

  const url = `tel:${phone}`;

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert("Calling not supported on this device");
  }
};

  const fetchMessages = async () => {
    if (!rideId) return;

    try {
      const res = await axios.get(
        `http://192.168.1.13:5000/api/messages/ride/${rideId}`
      );

      setChatMessages(res.data.messages);
    } catch (error) {
      console.log("FETCH ERROR", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [rideId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user) return;

    await axios.post("http://192.168.1.13:5000/api/messages", {
      senderId: user._id,
      receiverId: id,
      rideId: rideId,
      text: input,
    });

    setInput("");
    fetchMessages();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
<View style={styles.header}>
  {/* ⬅️ BACK A GAUCHE */}
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} />
  </TouchableOpacity>

  {/* 👤 AVATAR + NOM AU CENTRE */}
  <View style={styles.centerUser}>
    <Image
      source={{
        uri: avatar
          ? avatar
          : "https://i.pravatar.cc/150",
      }}
      style={styles.avatar}
    />
    <Text style={styles.name}>{name}</Text>
  </View>

  {/* 📞 TELEPHONE A DROITE */}
  <TouchableOpacity onPress={handleCall}>
    <Ionicons name="call-outline" size={24} color="#137fec" />
  </TouchableOpacity>
</View>


      {/* MESSAGES */}
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => {
          const isMine = item.senderId === myId;

          return (
            <View
              style={[
                styles.messageBubble,
                isMine ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text style={isMine ? styles.myText : styles.theirText}>
                {item.text}
              </Text>

              <Text style={styles.time}>
                {new Date(item.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          );
        }}
      />

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          style={styles.input}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F4F8" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
centerUser: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
},

  name: {
    fontWeight: "600",
    fontSize: 16,
  },

  messageBubble: {
    maxWidth: "75%",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },

  myMessage: {
    backgroundColor: "#2979FF",
    alignSelf: "flex-end",
  },

  theirMessage: {
    backgroundColor: "white",
    alignSelf: "flex-start",
  },

  myText: { color: "white" },
  theirText: { color: "#333" },

  time: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end",
    color: "#999",
  },

  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
  },

  input: {
    flex: 1,
    backgroundColor: "#F1F3F6",
    borderRadius: 25,
    paddingHorizontal: 15,
  },

  sendButton: {
    backgroundColor: "#2979FF",
    marginLeft: 10,
    padding: 13,
    borderRadius: 25,
  },
});
