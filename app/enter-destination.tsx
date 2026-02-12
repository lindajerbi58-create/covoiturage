import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EnterDestination() {
  const router = useRouter();
  const [text, setText] = useState("");

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <TextInput
        placeholder="Enter destination"
        value={text}
        onChangeText={setText}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#137fec",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() => {
          router.replace({
            pathname: "/home",
            params: { destination: text },
          });
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Confirm
        </Text>
      </TouchableOpacity>
    </View>
  );
}
