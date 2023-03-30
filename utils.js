import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuid } from 'uuid';
import {ref, uploadBytes, getDownloadURL ,uploadBytesResumable} from 'firebase/storage'
import { storage } from "./src/firebase"
import { Buffer } from "buffer";
import {writeAsStringAsync,readAsStringAsync,documentDirectory,makeDirectoryAsync,getInfoAsync,StorageAccessFramework,EncodingType} from 'expo-file-system'
import {createAssetAsync,usePermissions,createAlbumAsync} from 'expo-media-library'

const crypto = require('./crypto-custom.js');


export async function pickImage(){
  
 // let result = await ImagePicker.launchCameraAsync(); 
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 0.2,
    base64:true,
  });
  
  
  return result ; 
}

export async function pickImageChat(){

  // let result = await ImagePicker.launchCameraAsync(); 

   let result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.All,
     allowsEditing: false,
     quality: 0.2,
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



export async function EncryptAESkey(contactedUserPK,roomAESkey){//function to encrypt the AES key using RSA
  
  const encryptedAESkey = await new Promise((resolve,reject)=>{
    try{

      const data = roomAESkey
      const publicKey = contactedUserPK
      console.log('printing the public key :')
      console.log(publicKey)
      const encryptedData = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        // We convert the data string to a buffer using `Buffer.from`
        Buffer.from(data)
      );
      
      // The encrypted data is in the form of bytes, so we print it in base64 format
      // so that it's displayed in a more readable form
      //console.log("encypted data: ", encryptedData.toString("base64")); 

         const encryptedAESkey = encryptedData.toString("base64")// that string represent the encrypted data we save in the database
         console.log("successfully encrypted the key")
         
         resolve(encryptedAESkey)
    }catch(err){
      console.log('encryption failed')
      reject(err);
    }



  })

  return encryptedAESkey

}




export async function DecryptAESkey(contactedUserPr,roomAESEnckey){ //function to decrypt the AES key using RSA
  
  const decryptedAESkey = await new Promise((resolve,reject)=>{
    try{

      const data = roomAESEnckey
      const privateKey = contactedUserPr
  
      const test1buffer = Buffer.from(data,'base64') //buffer array of the encrypted AES key from the database we need to decrypt and return
 
       const decryptedData = crypto.privateDecrypt(
          {
            key: privateKey,
            // In order to decrypt the data, we need to specify the
            // same hashing function and padding scheme that we used to
            // encrypt the data in the previous step
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          test1buffer
        );
        
        // The decrypted data is of the Buffer type, which we can convert to a
        // string to reveal the original data
        console.log("decrypted data: ", decryptedData.toString());
        const decryptedAESkey = decryptedData.toString()
        console.log("successfully Decrypted the key");
        resolve(decryptedAESkey)
    }catch(err){
      reject(err);
    }



  })

  return decryptedAESkey

}



export async function saveUserData(userid,datatoSave) { //this function saves a given data to local storage 
  

    const saved = new Promise(async (resovlve,reject)=>{
     // const local = JSON.stringify(datatoSave)
    let fileUri = documentDirectory + `${userid}.txt`;
     writeAsStringAsync(fileUri, datatoSave, { encoding:EncodingType.UTF8 }).then(()=>{
      console.log('data saved successffully saveUserData utils')
      resovlve('data saved successfully')
     }).catch(err=>{
      console.log('data saved failed saveUserData utils ')
      reject(err)
    })

    })
    
   return saved
  
}

export async function readUserData(userid) { //this function saves a given data to local storage 
  

  const saved = new Promise(async (resovlve,reject)=>{
    
  let fileUri = documentDirectory + `${userid}.txt`;
  readAsStringAsync(fileUri,{ encoding:EncodingType.UTF8 }).then((res)=>{
    console.log('retrieved data successfully readUserData utils ')
    
    console.log(res)
    resovlve(res)
   }).catch(err=>{
    console.log('retrieved data Failed readUserData utils')
    reject(err)
  })

  })
  
 return saved

}

