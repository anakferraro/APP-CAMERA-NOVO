import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("photos");
      setPhotos(stored ? JSON.parse(stored) : []);
    })();
  }, []);

  if (photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma foto encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {photos.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.photo} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, alignItems: "center" },
  photo: { width: 200, height: 200, marginVertical: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
