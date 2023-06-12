import * as ImagePicker from "expo-image-picker";
import * as DocPicker from "expo-document-picker";
import "react-native-get-random-values";
import { v4 as uuid } from 'uuid';
import {ref, uploadBytes, getDownloadURL ,uploadBytesResumable,uploadString} from 'firebase/storage'
import { storage } from "./src/firebase"
import { Buffer } from "buffer";
import {writeAsStringAsync,readAsStringAsync,documentDirectory,makeDirectoryAsync,getInfoAsync,StorageAccessFramework,EncodingType,getContentUriAsync} from 'expo-file-system'
import {createAssetAsync,usePermissions,createAlbumAsync} from 'expo-media-library'
import { nanoid } from "nanoid";
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
     mediaTypes: ImagePicker.MediaTypeOptions.Images,
     allowsEditing: false,
     quality: 0.2,
     base64:true,
     
   });


   return result ; 
 }
 export async function pickVideoChat(){

  // let result = await ImagePicker.launchCameraAsync(); 

   let result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.Videos,
     allowsEditing: false,
     quality: 0.2,
     base64:true,
     
   });


   return result ; 
 }



 export async function pickFileChat(){


  //the result contain the file uri and data
   let result = await DocPicker.getDocumentAsync()
   return result ; 
 }

export async function askForPermission(){
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
  return status ; 
}





/* export async function uploadImage(image, path, fName) {

  const imageupload = await new Promise((resolve, reject) => {
    
  let imageByte = new Buffer.from(image.base64, "base64");
  const fileName = fName || uuid();
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);
  const uploadTask = uploadBytesResumable(imageRef, imageByte, {
    contentType: "image/jpeg",
  });
  
  
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
 */

export async function uploadVideotwo(video, path, fName) {

  const myprom =  await new Promise(async (resolve, reject) => {
    try{

      const fileName = fName ||nanoid();
    const imageRef = ref(storage, `${path}/${fileName}.mp4`);
    console.log('print in uploadVideo')
    console.log(video)
    const response = await fetch(video.uri);
  
      const blob = await response.blob();
  
      const snapshot = await uploadBytesResumable(imageRef, blob, {
        contentType: "video/mp4",
      });
    if(snapshot){
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);

        const myob = {url:downloadURL,fileName:fileName}
        resolve(myob) 
      });
    } 
      
    }catch(err){
      console.log(err)
      reject(err)
    }
    
  })
  

  return myprom
 
}
export async function uploadImagetwo(image, path, fName) {


  const fileName = fName ||nanoid();
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);
  console.log('print in uploadImagetwo')

  const response = await fetch(image.uri);

    const blob = await response.blob();

    const snapshot = await uploadBytes(imageRef, blob, {
      contentType: "image/jpeg",
    }); 
  const url = await getDownloadURL(snapshot.ref);
    
  return { url, fileName };
 
}



/* export async function uploadFile(file, path, fName) {

  console.log(file)
  const fileName = fName ||nanoid();
  const imageRef = ref(storage, `${path}/${fileName}.pdf`);
  console.log('print in uploadFile')

  const response = await fetch(file.uri);
  

    const blob = await response.blob();

    const snapshot = await uploadBytes(imageRef, blob, {
      contentType: file.mimeType,
    }); 
  const url = await getDownloadURL(snapshot.ref);
    
  return { url, fileName ,file};
 
} */



export async function uploadFile(file, path, fName) {

  const myprom =  await new Promise(async (resolve, reject) => {
    try{

      const fileName = fName ||nanoid();
    const fileref = ref(storage, `${path}/${fileName}.pdf`);
    console.log('print in file upload')
    console.log(file)
    const response = await fetch(file.uri);
  
      const blob = await response.blob();
  
      const snapshot = await uploadBytesResumable(fileref, blob, {
        contentType: file.mimeType,
      });
    if(snapshot){
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);

        const myob = {url:downloadURL,fileName:fileName}
        resolve(myob) 
      });
    } 
      
    }catch(err){
      console.log(err)
      reject(err)
    }
    
  })
  

  return myprom
 
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
      //console.log('printing the public key :')
      //console.log(publicKey)
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
  getInfoAsync(fileUri).then(res=>{
    //console.log(res)
  })
  readAsStringAsync(fileUri,{ encoding:EncodingType.UTF8 }).then((res)=>{
    console.log('retrieved data successfully readUserData utils ')
   // console.log(res)
    resovlve(res)
   }).catch(err=>{
    console.log('retrieved data Failed readUserData utils')
    reject(err)
  })

  })
  
 return saved

}



export async function EncrypGroupKeys(data){

  try{
    console.log("start of EncrypGroupKeys ")
    const {roomAESkey,participants} =data //participants is the map object from the selected participants in creategroup and the aes key
    const Aeskeys = {}
    console.log('printing the roomaeskey')
    //console.log(roomAESkey)
    const success=  await Promise.all(Array.from(participants.values()).map(async (user)=>{
      //console.log('printing the user')
      //console.log(user)
      const encryptedAESkey = await EncryptAESkey(user.RSApublicKey ,roomAESkey )
      Aeskeys[user.email] = encryptedAESkey
      })
    )
    if(success){
      return Aeskeys
    }
    

      
    }catch(err){
    console.log(err)
    return {"error":err}
    }


} ;// this function takes the participants object and their pk and encrypt the aes key for each one of them and returns it as an object
 






function decode(input) {
  // Replace non-url compatible chars with base64 standard chars
  input = input
      .replace(/-/g, '+')
      .replace(/_/g, '/');

  // Pad out with standard base64 required padding characters
  var pad = input.length % 4;
  if(pad) {
    if(pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }
    input += new Array(5-pad).join('=');
  }

  return input;
}



export function jsonToBase64(object) {
  const json = JSON.stringify(object);
  return Buffer.from(json).toString("base64");
}


export function base64ToJson(base64String) {
  const json = Buffer.from(base64String, "base64").toString();
  return JSON.parse(json);
}