import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { nanoid }from 'nanoid'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { storage } from "./src/firebase"


export async function pickImage(){
  
 // let result = await ImagePicker.launchCameraAsync(); 

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  });
  
  
  return result ; 
}

export async function pickImageChat(){
  
  // let result = await ImagePicker.launchCameraAsync(); 
 
   let result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.All,
     allowsEditing: false,
     quality: 1,
   });
   
   
   return result ; 
 }

export async function askForPermission(){
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
  return status ; 
}



export async function uploadImage(uri, path, fName) {

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileName = fName || nanoid();
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);

  const snapshot = await uploadBytes(imageRef, blob, {
    contentType: "image/jpeg",
  });

  blob.close();

  const url = await getDownloadURL(snapshot.ref);

  return { url, fileName };
}

const palette = {
  tealBlue: "rgb(165, 241, 233)",
  tealBlueDark: "rgb(15, 52, 96)",
  Blue: "rgb(225, 255, 238)",
  Page: "rgb(255, 238, 175)",
  skyblue: "rgb(61, 178, 255)",
  
  smokeWhite: "#ece5dd",
  white: "white",
  gray: "#3C3C3C",
  lightGray: "#757575",
  iconGray: "#717171",
};

export const theme = {
  colors: {
    background: palette.smokeWhite,
    foreground: palette.tealBlueDark,
    primary: palette.tealBlue,
    tertiary: palette.Page,
    skyblue : palette.skyblue,
    secondary: palette.Blue,
    white: palette.white,
    text: palette.gray,
    secondaryText: palette.lightGray,
    iconGray: palette.iconGray,
  },
};
