import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [camera, setCamera] = useState("back"); // "front" ou "back"
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState("");
  const router = useRouter();

  // Alternar câmera
  const toggleCamera = () => setCamera(prev => (prev === "back" ? "front" : "back"));

  // Alternar flash
  const toggleFlash = () => setFlash(prev => !prev);

  // Tirar foto e salvar
  const takePicture = async () => {
    if (!this.camera) return;

    const photo = await this.camera.takePictureAsync({ imageType: "png", quality: 1 });
    setPhotoUri(photo.uri);

    try {
      const stored = await AsyncStorage.getItem("photos");
      const photos = stored ? JSON.parse(stored) : [];
      photos.push(photo.uri);
      await AsyncStorage.setItem("photos", JSON.stringify(photos));
    } catch (e) {
      console.log("Erro ao salvar foto:", e);
    }
  };

  if (permission?.granted === false) {
    return (
      <View style={styles.center}>
        <Text>Permissão negada. Ative nas configurações do app.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: "#fff" }}>Solicitar permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {permission?.granted === true && (
        <>
          <CameraView
            style={styles.camera}
            facing={camera}
            flashMode={flash ? "on" : "off"}
            ref={ref => (this.camera = ref)}
          />

          {/* Botão alternar câmera */}
          <TouchableOpacity style={styles.switchButton} onPress={toggleCamera}>
            <Ionicons name="camera-reverse" size={35} color="#fff" />
          </TouchableOpacity>

          {/* Botão flash */}
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <Ionicons name={flash ? "flash" : "flash-off"} size={30} color="#fff" />
          </TouchableOpacity>

          {/* Botão tirar foto */}
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} />

          {/* Botão galeria */}
          <TouchableOpacity style={styles.galleryButton} onPress={() => router.push("/gallery")}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Galeria</Text>
          </TouchableOpacity>

          {/* Preview da última foto */}
          {photoUri !== "" && <Image source={{ uri: photoUri }} style={styles.preview} />}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  switchButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 30,
  },
  flashButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 30,
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    borderWidth: 5,
    borderColor: "#ccc",
  },
  galleryButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "#00000088",
    padding: 10,
    borderRadius: 8,
  },
  preview: {
    width: 150,
    height: 150,
    position: "absolute",
    bottom: 120,
    right: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
});

