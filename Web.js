import React, {useState} from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AddItemDialog from './AddItemDialog';



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

//funzione per gestire e inviare i dati
function handleSaveButton(navigation, valore1, valore2) {
  // Raccogli il colore esadecimale e il numero associato dall'utente
  const coloreEsadecimale = valore1; // Sostituisci con il tuo codice per ottenere il colore
  const numeroAssociato = valore2; // Sostituisci con il tuo codice per ottenere il numero
  
  // Invia il colore esadecimale e il numero a React Native
  const dataToSend = {
    coloreEsadecimale: coloreEsadecimale,
    numeroAssociato: numeroAssociato,
  };
  navigation.navigate('Lista', dataToSend);
}


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



//pagine effettiva
function Web({navigation,route}) {
  const [base64Image, setBase64Image] = useState(null);
  const [isAddItemDialogVisible, setAddItemDialogVisible] = useState(false);
  const imageUri = route.params;
  const [colore, setColore] = useState(''); // Aggiungi colore come variabile di stato

  const fetchAndSetBase64Image = async () => {
    const imageBase64 = await convertImageToBase64(imageUri);
    if (imageBase64) {
      setBase64Image(imageBase64);
    } else {
      console.error("Error converting image to Base64.");
    }
  };

  fetchAndSetBase64Image(); // Chiamata per avviare il processo di conversione
 

  return (
    <View style={styles.container}>
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
          //alert(event.nativeEvent.data);
          const colore = event.nativeEvent.data;
          console.log(colore);
          setColore(colore);
          setAddItemDialogVisible(true);

        }}
        style={styles.webView}
      />

       <AddItemDialog
      visible={isAddItemDialogVisible}
      onSave={(newItem) => {

        const hexColor = rgbStringToHex(colore);
        
        handleSaveButton(navigation, hexColor, newItem);
        setAddItemDialogVisible(false);
        // Qui puoi gestire il salvataggio dell'elemento nella tua lista
        // e chiudere il dialog box quando hai finito.
       
      }}
      onCancel={() => setAddItemDialogVisible(false)}
    /> 
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default Web;
