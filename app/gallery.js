import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    const stored = await AsyncStorage.getItem("photos");
    setPhotos(stored ? JSON.parse(stored) : []);
  }

  async function deletePhoto(index) {
    const updated = photos.filter((_, i) => i !== index);
    await AsyncStorage.setItem("photos", JSON.stringify(updated));
    setPhotos(updated);
  }

  async function deleteAllPhotos() {
    Alert.alert("Confirmar", "Deseja apagar todas as fotos?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("photos");
          setPhotos([]);
        },
      },
    ]);
  }

  if (photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma foto encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllPhotos}>
        <Text style={styles.deleteAllText}>Apagar todas as fotos</Text>
      </TouchableOpacity>

      <FlatList
        data={photos}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.photoContainer}>
            <Image source={{ uri: item }} style={styles.photo} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePhoto(index)}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.gallery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  gallery: { justifyContent: "center" },
  photoContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  photo: { width: "100%", height: "100%" },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
  deleteAllButton: {
    backgroundColor: "darkred",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteAllText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
