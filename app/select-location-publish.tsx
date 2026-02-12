import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
export default function SelectLocationPublish() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

const confirmLocation = async () => {
  if (!selectedLocation) return;

  const address = await Location.reverseGeocodeAsync({
    latitude: selectedLocation.latitude,
    longitude: selectedLocation.longitude,
  });

  let addressText = "Selected location";

  if (address.length > 0) {
    const place = address[0];
    addressText = `${place.name || ""} ${place.street || ""}`;
  }

  // 🔥 ON AJOUTE LES COORDONNÉES ICI
  await AsyncStorage.setItem(
    "selectedLocation",
    JSON.stringify({
      type: params.type,
      address: addressText,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    })
  );

  router.back();
};

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>

      {selectedLocation && (
        <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
          <Text style={{ color: "white" }}>Confirm Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  confirmBtn: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#137fec",
    padding: 15,
    borderRadius: 12,
  },
});
