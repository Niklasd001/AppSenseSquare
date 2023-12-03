import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions} from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';



export default function HomePage({navigation}){
  const[hasPermission, setHasPermission]= useState(null);
  const[type,setType] = useState(Camera.Constants.Type.back);
  const[photoUri, setPhotoUri] = useState(null);
  const[camera, setCamera] = useState(null);
  const[zoom, setZoom] = useState(0); // Valore iniziale dello zoom
  const[flash,setFlash] = useState(Camera.Constants.FlashMode.off);// valore in off inzialmente
  const[cameraDimensions,setCameraDimensions] = useState({ width: 0, height: 0 });
  const isFocused = useIsFocused();
 

  


  //calcolare dinamicamente la grandezza dello schermo per adattarsi al meglio
  useEffect(() => {
    const cameraWidth = Dimensions.get('window').width;
    const cameraHeight = Dimensions.get('window').height;

    setCameraDimensions({ width: cameraWidth, height: cameraHeight });

  }, []);

  //richiesta dei permessi
  useEffect(() => {

    Camera.requestCameraPermissionsAsync() 
    .then(result => {
      
      console.log(result);
      setHasPermission(result.granted)
    
      }) 
    .catch(e => {

      console.log(e);

    })

  },[]);

// funzione per scattare la foto
const takePhoto = async () => {

    try {
  
      if (hasPermission && camera) {
        const photo = await camera.takePictureAsync({quality: 0.5, ratio:'4:3'});
        setPhotoUri(photo.uri);
        
      }
      
    } catch (error) {
        console.log(error);    
    }
  };

const handleCameraRef = (ref) => {
  setCamera(ref);
};

 const handleZoomChange = (value) => {
  
  setZoom(value);
  
}; 

//controllo dei permessi
if(hasPermission == null || !isFocused){
  return <View/>
}
if(hasPermission == false){
  return <Text> ACCESSO ALLA CAMERA NEGATO</Text>
}
return (
  <View style={styles.container}>
    <Camera style={{ width: cameraDimensions.width, height: cameraDimensions.height }} 
    type={type} autoFocus={Camera.Constants.AutoFocus.on} ratio={"16:9"} zoom={zoom} flashMode={flash} ref={handleCameraRef}>
      <View style={styles.overlay}>

        
        <View style={styles.buttonContainer}>
           <IconButton
           icon="camera-rear"
           onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}
           color="black"
           backgroundColor="#34eb9b"/>
           <IconButton
            icon="camera" 
            onPress={takePhoto}
            color="black"
            backgroundColor="#34eb9b"/>
            <IconButton
             icon={flash === Camera.Constants.FlashMode.off ? "flash-off" : "flash"} 
            onPress={() => setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)}
            color="black"
            backgroundColor="#34eb9b"/>
        </View>


        <View style={styles.buttonContainer}>
          <Slider
            style={{ width: 200, marginTop: 10 }}
            value={zoom}
            minimumValue={0}
            maximumValue={1}
            onValueChange={handleZoomChange}
            minimumTrackTintColor="#34eb9b"
            maximumTrackTintColor="#0000FF"
          />  
        </View>


        <View style={styles.navigationButtonContainer}>
        <IconButton
          icon={() => <MaterialCommunityIcons name="arrow-right" size={24} color="black" backgroundColor="#34eb9b" />} 
           onPress={() => navigation.navigate('Lista', photoUri)}
          color="black"/>
          <Button title="Scansiona" onPress={() => navigation.navigate('Web' ,photoUri)} color="#34eb9b" />
        </View>


      </View>
    </Camera>
    
  </View>
);
    

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    top: 50,
    
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'flex-end', // Posiziona i pulsanti in basso
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10, // Ridotto il padding verticale
   
  },
  navigationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10, // Ridotto il padding verticale
    backgroundColor: 'transparent',
  },
  
});