import * as MediaLibrary from "expo-media-library";
import {Cloudinary} from "@cloudinary/url-gen";
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

export default function App() {
  const cld = new Cloudinary({cloud: {cloudName: 'dtrtyocpz'}});
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

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

  async function handleUpload(){
    const photo = selectedPhotos[0];

    const info = await MediaLibrary.getAssetInfoAsync(photo);

    console.log({info});

    const data = FormData();
    data.append('file', {uri: info.localUri, name: info.filename});
    data.append('upload_preset', 'ml_default');
    data.append('cloud_name', 'dtrtyocpz');

    fetch('https://api.cloudinary.com/v1_1/dtrtyocpz/upload', {
      method:'post',
      body: data,
    })
    .then((res) => res.json())
    .then((data)=>{
      console.log(data.secure_url);
    })
    .catch((err) => {
      alert('an error occured while uploading')
    })
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
<View>
<FlatList
      onEndReached={LoadMorePhotos}
      numColumns={3}
      data={photos}
      renderItem={({ item, index }) => ( 
      <ImageItem  
       onSelect={() => setSelectedPhotos([...selectedPhotos, item])} 
       onRemovse = {() => setSelectedPhotos(selectedPhotos.filter((selected) => selected.id !== item.id))} 
       selected={selectedPhotos.findIndex((selected) => selected.id === item.id) + 1}
       photo = {item}
       index={index} />)}
      keyExtractor={(item) => item.uri}
    />

    {selectedPhotos.length > 0 &&(
      <TouchableOpacity onPress={handleUpload} style={{position:"absolute", bottom:20, right: 20, backgroundColor : "black", padding: 20, borderRadius: 20, alignItems:'center'}} >
        <Text style={{color: 'white'}} >Send</Text>
      </TouchableOpacity>
    )}
</View>
  );}


function ImageItem({ photo, index, onSelect, onRemovse, selected }) {
  const marginHorizontal = index % 3 === 1 ? imageGap : 0;


  return (
    <TouchableOpacity onPress={() => (selected ? onRemovse() : onSelect())}>
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
        {!!selected && (
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

