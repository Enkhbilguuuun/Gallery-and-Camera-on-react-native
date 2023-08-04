import { Camera, CameraType } from "expo-camera";

import { useRef, useState } from "react";

import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as MediaLibrary from "expo-media-library";

 

export default function App() {

  const [type, setType] = useState(CameraType.back);

  const [blackBgr, setBlackBgr] = useState(false);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [permissionResponse, RequestPermission] = MediaLibrary.usePermissions();

 

  const cameraRef = useRef();

 

  if (!permission) {

    // Camera permissions are still loading

    return <View />;

  }

 

  if (!permission.granted) {

    // Camera permissions are not granted yet

    return (

      <View style={styles.container}>

        <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>

        <Button onPress={requestPermission} title="grant permission" />

      </View>

    );

  }

 

  function toggleCameraType() {

    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));

  }

 

  async function takePicture() {

    setBlackBgr(true);

    setTimeout(() => {

      setBlackBgr(false);

    }, 300);

    const result = await cameraRef.current.takePictureAsync();

    MediaLibrary.saveToLibraryAsync(result.uri);

  }

 

  return (

    <View style={styles.container}>

      <Camera ratio="16 : 9" ref={cameraRef} style={{ flex: 1 }} type={type}>

        <View style={{ position: "absolute", backgroundColor: "black", top: 0, right: 0, left: 0, bottom: 0, display: blackBgr ? 'flex' : 'none' }}></View>

        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>

            <Text style={styles.text}>Flip Camera</Text>

          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePicture}>

            <Text style={styles.text}>take pic</Text>

          </TouchableOpacity>

        </View>

      </Camera>

    </View>

  );

}

 

const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: "center",

  },

  camera: {

    flex: 1,

  },

  buttonContainer: {

    flex: 1,

    flexDirection: "row",

    backgroundColor: "red",

    opacity: 0.5,

    margin: 64,

  },

  button: {

    flex: 1,

    alignSelf: "flex-end",

    alignItems: "center",

    backgroundColor: 'green',

    opacity: 0.5

  },

  text: {

    fontSize: 24,

    fontWeight: "bold",

    color: "white",

  },

});