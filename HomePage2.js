import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, Alert} from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Dialog, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import Color from 'colorjs.io';

//converto immagine in base64
const convertImageToBase64 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return null;
  }
};

//funzione per convertire rgb in esadecimale
function rgbStringToHex(rgbString) {
  const rgbValues = rgbString.split(' ').map(Number);
  if (rgbValues.length === 3) {
    const hexColor = rgbValues
      .map((value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');
    return `#${hexColor}`;
  }
  return null; // Restituisci null in caso di formato RGB non valido
}




export default function HomePage2({navigation}){
  const[hasPermission, setHasPermission]= useState(null);
  const[type,setType] = useState(Camera.Constants.Type.back);
  const[photoUri, setPhotoUri] = useState(null);
  const[camera, setCamera] = useState(null);
  const[zoom, setZoom] = useState(0); // Valore iniziale dello zoom
  const[flash,setFlash] = useState(Camera.Constants.FlashMode.off);// valore in off inzialmente
  const[cameraDimensions,setCameraDimensions] = useState({ width: 0, height: 0 });
  const [base64Image, setBase64Image] = useState(null);
  const isFocused = useIsFocused();
 

  function interpolazione(data,colore){
    const showAlert = () => {
      Alert.alert(
        'Attenzione!',
        'Troppo pochi dati. Inserire almeno due parametri per effettuare analizzare',
        [{ text: 'Torna alla lista', onPress: () => 
        navigation.navigate('Lista')
         }],
        { cancelable: false }
      );
    };
    console.log("sto iniziando l elaborazione di interpolazione");
    if(data.length === 1){
      console.log("pochi dati");
      showAlert();
      return;
    }
    console.log(colore);
    let traccia1=0;
    let dist1=1000;
    let traccia2=0;
    let dist2=1000;
    let dist=0;
    const c= new Color(colore);

    //serve a trovare il colore più vicino
       for(i=0;i<data.length;i++){
        const c1= new Color(data[i].coloreEsadecimale);
        dist= c.distance(c1);
        console.log("distanza ",i , dist);
        if (dist<dist1){
          dist1 = dist;
          traccia1=i;
          } 
      } 
      //qui se ho il primo valore, il secondo più piccolo sarà il secondo nella lista
      let temp;
      if(traccia1===0){
        temp = new Color(data[i].coloreEsadecimale);
        traccia2 = 1;
        dist2 = c.distance(temp);
      } else if(traccia1===data.length-1){//qui considero il caso in cui sia l ultimo
        temp = new Color(data[data.length-2].coloreEsadecimale);
        dist2 = c.distance(temp);
        traccia2 = data.length-2;
      }else{//qui quando si trova nel mezzo
        
        let d1=0;
        d1=c.distance(data[traccia1-1].coloreEsadecimale);
        let d2=0;
        d2=c.distance(data[traccia1+1].coloreEsadecimale);
        console.log(d1,d2);
        if(d1<d2){
            traccia2=traccia1-1;
            dist2= d1;
        }else{
            traccia2=traccia1+1;
            dist2=d2;
        }
        
      }
      console.log("indice del primo più vicino",traccia1);
      console.log("indidice del secondo più vicno",traccia2);
      console.log(dist1,dist2);
    
    //qui parte l'interpolazione vera e propria
    let x =0;
    let y =0;
    
      if(dist1==dist2){
        x=50;
      }else if(dist1<dist2){
        x= (dist2*100)/(dist1+dist2);
      }else {
        x=(dist1*100)/(dist1+dist2);
      }
      console.log("x=",x);
      y=((data[traccia1].numeroAssociato - data[traccia2].numeroAssociato)*x)/100;
      console.log("y=",y);
    
  }


//recuperare i dati dallo storage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('my-key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };


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
        console.log("sto per convertire l immagine");
        setBase64Image(await convertImageToBase64(photo.uri));
      
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
    type={type} autoFocus={Camera.Constants.AutoFocus.on} zoom={zoom} flashMode={flash} ref={handleCameraRef}>
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
          <Button title="Scansiona colore" onPress={() => navigation.navigate('Web' ,photoUri)} color="black" />
        </View>


      </View>
    </Camera>

    {base64Image !== null && (
      
      <WebView
      originWhitelist={['*']}
        source={{html : `
        <head>
        <meta charset="utf-8">
        <title>Ciao OpenCV.js</title>
        </head>
        <body>
        <h2>Ciao OpenCV.js</h2>
        <p id="status">OpenCV.js sta caricandoooooo...</p>
        <div>
          <div class="inputoutput">
          <img id="imageSrc" src="${base64Image}" style="max-width: 100%; height: auto;" alt="nessun immagine" />
          </div>
          <div class="inputoutput">
            <canvas id="canvasOutput"></canvas>
            <div class="caption">canvasOutput</div>
          </div>
          <button id="rilevaCerchio" onclick="rilevaCerchio()">Calcola Cerchi</button>
          <p>Colore del Pixel Centrale: <span id="pixelColor"></span></p>
        </div>

        
        
        <script>  function onOpenCvReady() {
          document.getElementById('status').innerHTML = 'OpenCV.js status: Ready.';
         
      }</script>


      <script>
      let imgElement = document.getElementById('imageSrc');
      let inputElement = document.getElementById('fileInput');
      let pixelColorElement = document.getElementById('pixelColor');
     

      inputElement.addEventListener('change', (e) => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
      }, false);


      </script>

      
      <script async src="https://docs.opencv.org/4.5.4/opencv.js" onload="onOpenCvReady();" type="text/javascript"></script>
      </body>
      `}}


         injectedJavaScript='
         
          setTimeout(function() {
          if (typeof cv !== "undefined") {
          
          let src = cv.imread(imgElement);
    
          let circles = new cv.Mat();
          let color = new cv.Scalar(255, 0, 0);
          cv.resize(src,src,new cv.Size(src.rows/3,src.cols/2),0,0, cv.INTER_AREA);
          //console.log(matrice.Size);
          cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

          let dst = cv.Mat.zeros(src.rows,src.cols, cv.CV_8U);
          let tuttiCerchi = " ";
          let coordinate = new Array(); 
          cv.HoughCircles(src, circles, cv.HOUGH_GRADIENT, 1, 100, 20, 50, 100, 500);
          for (let i = 0; i < circles.cols; ++i) {
          
              let x = circles.data32F[i * 3];
              let y = circles.data32F[i * 3 + 1];
              let radius = circles.data32F[i * 3 + 2];
              let center = new cv.Point(x, y);
              cv.circle(dst, center, radius, color); 
              
              coordinate[i*2] = x;
              coordinate[i*2+1] = y;
              
          }
            cv.imshow("canvasOutput", dst);
             
              let mat = cv.imread(imgElement);
        
              cv.resize(mat,mat,new cv.Size(dst.rows,dst.cols),0,0, cv.INTER_AREA);
              for(let i=0; i<1; ++i){
              let colorX = Math.floor(coordinate[2*i]);
              let colorY = Math.floor(coordinate[2*i+1]);
             
              if (colorX >= 0 && colorX < mat.cols && colorY >= 0 && colorY < mat.rows) {
              let pixelData = mat.ucharPtr(colorY, colorX); // Cambiato l ordine delle coordinate
              
              
              tuttiCerchi = pixelData[0] + " " + pixelData[1] + " " + pixelData[2] + "\n";
              } else {
              tuttiCerchi += "rgb(cerchio" + i + ") Posizione fuori dai limiti dell immagine\n";
              }
            
              }
              window.ReactNativeWebView.postMessage(tuttiCerchi);
              pixelColorElement.textContent = tuttiCerchi;
              
            src.delete(); dst.delete(); circles.delete(); 
          }else{
            window.alert("errore");
          }
        }, 3000);
        '  


        onMessage={(event) => {
          const colore = event.nativeEvent.data;
          console.log(colore);
          const coloreHex = rgbStringToHex(colore);
          getData()
      .then(res => {
        const data = res;
        console.log(data);
        interpolazione(data,coloreHex);
      }
        )
      .catch(e =>{
        console.log("errore nel ricavare i dati persistenti in memoria",e);
      } )
          
        }}
        style={styles.webView}
      />
    )}

    
  </View>
);
    

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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