import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function SelectLocation() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

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
       <TouchableOpacity
  style={styles.confirmBtn}
  onPress={() => {
    router.replace({
      pathname: "/home",
      params: {
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
      },
    });
  }}
>
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
