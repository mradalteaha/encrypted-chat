import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuid } from 'uuid';
import {ref, uploadBytes, getDownloadURL ,uploadBytesResumable} from 'firebase/storage'
import { storage } from "./src/firebase"
import { Buffer } from "buffer";

export async function pickImage(){
  
 // let result = await ImagePicker.launchCameraAsync(); 
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
    base64:true,
  });
  
  
  return result ; 
}

export async function pickImageChat(){

  // let result = await ImagePicker.launchCameraAsync(); 

   let result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.All,
     allowsEditing: false,
     quality: 1,
     base64:true
   });


   return result ; 
 }

export async function askForPermission(){
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
  return status ; 
}



export async function uploadImage(image, path, fName) {

  const imageupload = await new Promise((resolve, reject) => {
    
  let imageByte = new Buffer.from(image.base64, "base64");
  const fileName = fName || uuid();
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);
  const uploadTask = uploadBytesResumable(imageRef, imageByte, {
    contentType: "image/jpeg",
  });
  console.log('passed line 69')
  
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      console.log(error)
      reject(new TypeError(error))
    }, 
    () => {
    
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        const url = downloadURL

        resolve({url,fileName})
        
      }).catch(err => {
        reject(new TypeError(err))
      });
    }
  );
  })
    
  return imageupload
 
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
