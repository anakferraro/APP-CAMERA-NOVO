import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); // ✅ corrigido
  const [loading, setLoading] = useState(true);
  const [retryLoading, setRetryLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (err) {
        setPermissionError(err?.message || JSON.stringify(err));
        setHasPermission(false);
      }

      try {
        const savedType = await AsyncStorage.getItem("cameraType");
        if (savedType) {
          setCameraType(parseInt(savedType, 10)); // ✅ converte de volta para número
        }
      } catch (e) {
        console.log("Erro ao recuperar cameraType:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleCamera = async () => {
    try {
      const newType =
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back;

      setCameraType(newType);
      await AsyncStorage.setItem("cameraType", newType.toString()); // ✅ salva como string
      console.log("cameraType salvo:", newType);
    } catch (e) {
      console.log("Erro ao salvar cameraType:", e);
    }
  };

  const savePhoto = async (uri) => {
    try {
      const stored = await AsyncStorage.getItem("photos");
      const photos = stored ? JSON.parse(stored) : [];
      photos.push(uri);
      await AsyncStorage.setItem("photos", JSON.stringify(photos));
    } catch (e) {
      console.log("Erro ao salvar foto:", e);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      await savePhoto(photo.uri);
      router.push("/gallery");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Carregando...</Text>
        {permissionError && <Text style={{ color: "red" }}>Erro: {permissionError}</Text>}
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Permissão negada para câmera</Text>
        {permissionError && <Text style={{ color: "red" }}>Erro: {permissionError}</Text>}
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: "#007AFF",
            padding: 12,
            borderRadius: 8,
            opacity: retryLoading ? 0.7 : 1,
          }}
          disabled={retryLoading}
          onPress={async () => {
            setRetryLoading(true);
            setPermissionError(null);
            try {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === "granted");
            } catch (err) {
              setPermissionError(err?.message || JSON.stringify(err));
              setHasPermission(false);
            } finally {
              setRetryLoading(false);
            }
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {retryLoading ? "Solicitando..." : "Tentar novamente"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={cameraType} ref={cameraRef}>
        <TouchableOpacity style={styles.switchButton} onPress={toggleCamera}>
          <Ionicons name="camera-reverse" size={40} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture} />

        <TouchableOpacity style={styles.galleryButton} onPress={() => router.push("/gallery")}>
          <Text style={{ color: "#fff" }}>Galeria</Text>
        </TouchableOpacity>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  switchButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#00000088",
    padding: 8,
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
});
