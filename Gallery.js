import * as MediaLibrary from "expo-media-library";
import { useState, useEffect } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const imageWidth = windowWidth * 0.33;
const imageGap = windowWidth * 0.33;

export function Gallery() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState();

  async function loadInitialPhotos() {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: ["creationTime"],
      first: 20,
    });
    setPhotos(media.assets);
  }

  async function LoadMorePhotos() {
    let media = await MediaLibrary.getAssetsAsync({
      after: photos[photos.length - 1].id,
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: ["creationTime"],
      first: 20,
    });
    setPhotos([...photos, ...media.assets]);
  }

  useEffect(() => {
    if (permissionResponse && permissionResponse.granted) {
      loadInitialPhotos();
    }
  }, [permissionResponse]);

  if (!permissionResponse) {
    return <View />;
  }

  const { granted, canAskAgain } = permissionResponse;

  if (!granted && canAskAgain) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{ backgroundColor: "black", padding: 20, borderRadius: 10 }}
          onPress={requestPermission}
        >
          <Text style={{ color: "white" }}>request permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!granted && !canAskAgain) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{ backgroundColor: "black", padding: 20, borderRadius: 10 }}
        >
          <Text style={{ color: "white" }}>
            The permissiion has been denied, enable it in settings.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      onEndReached={LoadMorePhotos}
      numColumns={3}
      data={photos}
      renderItem={({ item }) => <ImageItem photo={item} />}
      keyExtractor={(item) => item.uri}
    />
  );
  // <View>
  //     {photo.map((photo) => (
  //         <Image source={{uri:photo.uri}} style={{backgroundColor:"#ccc", width : 100, height:100}} />
  //     ))}
  // </View>
}

function ImageItem({ photo }) {
  const marginHorizontal = index % 3 === 1 ? imageGap : 0;
  const [selected, setSelected] = useState(false);

  return (
    <TouchableOpacity onPress={() => setSelected(!selected)}>
      <View
        style={{
          width: imageWidth,
          height: imageWidth,
          marginBottom: imageGap,
          marginHorizontal,
          position: "relative",
        }}
      >
        <Image
          source={{ uri: photo.uri }}
          style={{
            width: imageWidth,
            height: imageWidth,
            backgroundColor: "#ccc",
          }}
        />
        {selected && (
            <View style={{position:"absolute", top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(255, 255, 255, 0.6)', justifyContent : 'center', alignItems: 'center'}}> 
                <View style = {{backgroundColor:"blue", width:30, height:30, borderRadius: 15, justifyContent:"center", alignItems:"center"}}>
                <Text style={{color:"white"}} >{selected}</Text>
                </View>
            </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
