import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const stored = await AsyncStorage.getItem("photos");
      if (stored) setPhotos(JSON.parse(stored));
    };
    loadPhotos();
  }, []);

  if (photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma foto salva ainda</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
      renderItem={({ item }) => (
        <Image source={{ uri: item }} style={styles.photo} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  photo: { width: 120, height: 120, margin: 4, borderRadius: 8 },
});