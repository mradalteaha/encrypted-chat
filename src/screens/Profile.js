import React, { useContext, useEffect } from 'react'
import { useState } from "react";
import { Image, Button, Text, View, SafeAreaView, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper"; // to avoid fields falling underneath the keyboard
import { auth, db ,GenKey, GenAESKey,storage} from '../firebase'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Context from '../../Context/Context'
import { pickImage, askForPermission, uploadImage,saveUserData } from '../../utils'
import { theme } from '../../utils';
import { updateProfile } from 'firebase/auth';
import {ref, getDownloadURL ,uploadBytesResumable,uploadBytes} from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import {Buffer} from 'buffer'
import CryptoJS from "react-native-crypto-js";
import { async, map } from '@firebase/util';
import AsyncStorageStatic from '@react-native-async-storage/async-storage'
const crypto = require('../../crypto-custom.js');
 

export default function Profile(props) {


    const [displayName, setDisplayName] = useState('');
    const [selectImage, setSelectedImage] = useState(null);
    const [RSAkeys, setRSAkeys] = useState(null);
    const [permissionStatus, permissionStatusUpdate] = useState(null);
    const { theme: { colors } } = useContext(Context)
    const navigation = useNavigation()
    const [imageUploadProgress, setImageUploadProgress]=useState(0)
    




    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    }, [])

    async function handlePress() {
        

        try{
            console.log('clicked on handle preess for next button')
        
        const user = auth.currentUser;
        let photoURL
        if (selectImage) {
           /*  console.log('error on upload image')
            //console.log(selectImage)
            const { url } = await uploadImage(selectImage, `Images/${user.uid}`, "profilePicture")
            console.log('photo uploaded')
            console.log(url) */
            console.log("uploading image")
            console.log('printing the image base 64')
            console.log(selectImage.base64)
  
            let imageByte = new Buffer.from(selectImage.base64, "base64");
            const fileName = "profilePicture" || uuid();
            
            const path = `images/${user.uid}`
            const imageRef = ref(storage, `${path}/${fileName}.jpeg`);
            const uploadTask = uploadBytesResumable(imageRef, imageByte, {
              contentType: "image/jpeg",
            });
/* 
            const uploadProfileImage =  uploadBytes(imageRef, imageByte, {
                contentType: "image/jpeg",
              }).then(async (res) => {

                photoURL = await getDownloadURL(res.ref)

                console.log('Generating Keys : \n')
                const result = await GenKey()
                    const RsaKeys=result.data;
                    
                   // EncryptedStorage.setItem(auth.currentUser.uid,JSON.stringify(RsaKeys));
        
                   //  EncryptedStorage.getItem("user_session");
                   let rooms =  new Map();
                   const userLocal ={RsaKeys , rooms}
                  const settingItem =  AsyncStorageStatic.setItem(auth.currentUser.uid,JSON.stringify(userLocal))
                    if(RsaKeys){
                        console.log(RsaKeys)
                        setRSAkeys(RsaKeys)
                    }
        
                  const userData = {
                    displayName,
                    email: user.email,
                    RSApublicKey:RsaKeys.publicKey
                }
               
                if (photoURL) {
                    userData.photoURL = photoURL
                }
                await Promise.all([settingItem,updateProfile(user, userData), setDoc(doc(db, 'users', user.uid), { ...userData, uid: user.uid })])
                console.log('i have updated the user necesserly profile elemens at Profile ')
                console.log(userData)
                navigation.navigate('HomeScreen')
              }) */
            
            uploadTask.on('state_changed', 
              (snapshot) => {
                const progress =(snapshot.bytesTransferred / snapshot.totalBytes)
                //imageUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress*100 + '% done');
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
                console.log('error occured on uploading')
                console.log(error)
              }, 
              async() => {
              
                photoURL = await getDownloadURL(uploadTask.snapshot.ref)

                console.log('Generating Keys : \n')
                const result = await GenKey()
                    const RsaKeys=result.data;//object from the backend {publicKey ,privateKey}
                    
                   
                   let rooms = {};
                   const userLocal ={RsaKeys , rooms}

                    const settingItem =  await saveUserData(auth.currentUser.uid,JSON.stringify(userLocal))
                  
                    if(RsaKeys){
                        console.log('rsa keys generated successfully on profile')
                        setRSAkeys(RsaKeys)
                    }
        
                  const userData = {
                    displayName,
                    email: user.email,
                    RSApublicKey:RsaKeys.publicKey
                }
               
                if (photoURL) {
                    userData.photoURL = photoURL
                }
                await Promise.all([settingItem,updateProfile(user, userData), setDoc(doc(db, 'users', user.uid), { ...userData, uid: user.uid })])
                console.log('i have updated the user necesserly profile elemens at Profile ')
                console.log(userData)
                navigation.navigate('HomeScreen')
              }
            );
            
           

        }
      
       
    }catch(e){
        console.log('error occured')
        console.log(e)
    }

    }

///for test onlyy !!!!
   async function handlePress2(){


     /*    const data = "my secret data";

        const publicKey=`-----BEGIN RSA PUBLIC KEY-----MIIBCgKCAQEAvRY8D3feCyzrkMwobdyC6sTlnOlJoh8trZKdtT3L3xLleUOhqW8xHsfb4EkHseQGBkVLdiqsaT/mWWdQmTryhHWy2j77H99PpB7TCEfS5QafQz+HtqM/QyYPe6/jBVd3XRswsosGnB4kJlcqLX1y744dCN8/eAhMKSbTSKi47MJ37bmCWE7kgy+ZEmhVjiVvKghUfLYOu3tvkApIQwvjT7T9IH9BTPBUu9/078QF8HovQ8BkQuHf1t1QGEteEptOXA/IGW3Zo2IPKbrFvBvsYzSGv37kpDv/YT30KYndvDxKcNHAO/p2rtm8w3fi+WFX4WOtgN8SNkdyY20ssOmsIwIDAQAB-----END RSA PUBLIC KEY-----`
        const privateKey =`-----BEGIN RSA PRIVATE KEY-----MIIEpQIBAAKCAQEAvRY8D3feCyzrkMwobdyC6sTlnOlJoh8trZKdtT3L3xLleUOhqW8xHsfb4EkHseQGBkVLdiqsaT/mWWdQmTryhHWy2j77H99PpB7TCEfS5QafQz+HtqM/QyYPe6/jBVd3XRswsosGnB4kJlcqLX1y744dCN8/eAhMKSbTSKi47MJ37bmCWE7kgy+ZEmhVjiVvKghUfLYOu3tvkApIQwvjT7T9IH9BTPBUu9/078QF8HovQ8BkQuHf1t1QGEteEptOXA/IGW3Zo2IPKbrFvBvsYzSGv37kpDv/YT30KYndvDxKcNHAO/p2rtm8w3fi+WFX4WOtgN8SNkdyY20ssOmsIwIDAQABAoIBAQCVbU/TbYfEzx/t0tkUUNII08cc5GMzQm5nn9kP1KEbTaSY2zCTZHKt/4UsTqpNE4ULSZGj9X9AwaW4+2N/ZE0pDpZj0KfF/UTDzzQ4dAIeycfsbfVDCOlCmH5d4ZaHryJ+KrGmNyXnFA6/WdzUDDJbS7R4QWy3397IGo2X+vYA6yX7d7fbKdJ/vjwxLjHxOl80dHGnsmhc1VeUS8rTkkSedk/LnMyUeQcDfhn+VFZzgkphSVhsuPs83gSNpmEclSM3EaLvsu+fxJlFh12vAYuFpDGYGbsWCqPBctt8xFM/1lbB/tYCD825QotniZB81q7CbjOdcsfJwa1Sr1ysexVZAoGBANy4r5ZfAQH/x4J66V+DylN62auHePWkbwrapX+Bbh26pHL0mPbo7K3eFCc41wM0Y3J74cRXcZE9nP1NUrll0uYgT6XhBE7EOxRbD6FOxk4Ww6WiSZDn+QmgYkL3MAqBCTPCJLlH5yilLlVHHh2RM7UR5CpwL3I3j7nePeIatHbvAoGBANtPJhwal3PLI9EOraRDJhVCY8qI4Q9ixpjUKWOhu90Owp4uTwzmLH4yvrZWVYkGfwi56YAmqwEypPWspEX5J7A3apJAIj+w4+EKAqavyAPmXtx01dBMd+ZgG14T97AWC6Vakt58bWz3KCpx5sS6TzNXdr4zCFg+2Z05OR8AKn4NAoGBAJgdN/Wb9+fWzTqhVqCbBR9PNSA/tx8jeduzIAelvawDaz5GT/0qPaL9wEnfpF7zBe5qbgeQdBYyrjTryy02fYhXkEyzrPJTzpuSvkzfK0+55JAMLkMNe9YkkFOyY4t5rkvbas++PBMI88uVva2G2mnZsLOGqUw/+m+QOHnRCbpFAoGAVjA47fqVYvCG1vZJz7CEGv7IcSRyLrXHDvDygzFgv3O5kKjqcEtVWRNgWBB99SgUbL2DwtVvhzz8D4EV3loY+uwMegWycA14wUxJ1nBmzwGObl2MWhxzUpqaptJ6GT3Qvd9msQF9j8Fii6vP4ajGz4qkJAOyV9v7cgq3JDPQf1ECgYEAv4T+IbwSyCL6N5PavjfFCisfsOWQlPZf3E3vZV+B1w0Yj2q6YyNs3kJgfBf9+BisQQAUmqUDJOTaa8zOvdXso3ibiMNZ+ZVN+bin+f773ZDWczEUddeN6M0ux/FMom0x+qyegPx+PILBYYSQDTeTNDnKj7LQF4LLKLjNbNzircI=-----END RSA PRIVATE KEY-----`
        
       
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
        console.log("encypted data: ", encryptedData.toString("base64"));
        
        /*
        console.log("printing type of enc data")
        console.log( encryptedData)*/
        
 /*        const test1 = encryptedData.toString("base64")
        const test1buffer = Buffer.from(test1,'base64')
        const test2 = test1buffer.toString('base64')
        
        console.log("is it equal strings ")
        console.log(test2 === test2)
        console.log(encryptedData.length) 
        
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
          console.log("decrypted data: ", decryptedData.toString());  */ 
/* 
          try{
            const result = await GenKey()
            console.log("success")
            console.log(result.data)
            const RsaKeys=result.data;
            console.log(RsaKeys)
           // EncryptedStorage.setItem(auth.currentUser.uid,JSON.stringify(RsaKeys));

           //  EncryptedStorage.getItem("user_session");
           let rooms = new Map();
           const userLocal ={RsaKeys , rooms}
          const settingItem = await  AsyncStorageStatic.setItem(auth.currentUser.uid,JSON.stringify(userLocal))
 
          }catch(err){

            console.log("error occured on the genKey:")
            console.error(err)
          } */

    }

    async function handleProfileImage() {
        
        const result = await pickImage()
        if (result.assets[0]) {
            console.log('image has been successfully uploaded on handle profile picture')
            setSelectedImage(result.assets[0])
        }
    }
    if (!permissionStatus) {
        return <Text>Loading ...</Text>
    }
    if (permissionStatus !== 'granted') {
        return <Text> you need to grant permission </Text>
    }

    return (
        <React.Fragment>
            <KeyboardAvoidingWrapper>
                <SafeAreaView style={styles.container}>


                    <View style={styles.TopView}>

                        <Text style={styles.Header} >Set Up your profile </Text>
                        <Text style={styles.WelcomeTitle} >Please Provide displayName and Profile Image </Text>

                    </View>

                    <View style={styles.BottomView}>
                        <TouchableOpacity onPress={handleProfileImage} style={{ marginTop: 50, borderRadius: 120, width: 120, height: 120, backgroundColor: colors.foreground, alignItems: 'center', justifyContent: 'center' }}>
                            {!selectImage ? (<MaterialCommunityIcons name='camera-plus' color={colors.iconGray} size={45} />) :

                                <Image source={{ uri: selectImage.uri }} style={{ width: '100%', height: '100%', borderRadius: 120 }} />}
                        </TouchableOpacity>
                        <TextInput value={displayName} onChangeText={setDisplayName} style={styles.TextInput} placeholderTextColor={'rgb(185, 255, 248)'} placeholder={'Enter your display name '} />



                        <View style={styles.ButtonsView}>
                            <Button title={'Next'} onPress={() => handlePress(selectImage)} disabled={!displayName || !selectImage } />
                            <Button title={'Generate'} onPress={handlePress2}  />

                        </View>

                        <View style={{Padding:50 , justifyContent:'center' , marginBottom:20 , height:150}}>
                        <Progress.Bar progress={imageUploadProgress} width={200} />
                        </View>






                    </View>


                </SafeAreaView>
            </KeyboardAvoidingWrapper>

        </React.Fragment>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        width: '100%',
        flexDirection: 'column',
        justifyContent: "center",
        backgroundColor: '#fff',
    },
    TopView: {
        width: '100%',
        height: '20%',
        backgroundColor: theme.colors.skyblue,
        justifyContent: "center",
        display: 'flex',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,


    },
    BottomView: {
        width: '100%',
        height: '80%',
        backgroundColor: theme.colors.skyblue,
        alignItems: 'center',
    },
    Header: {
        fontSize: 50,
        alignSelf: 'center',
        color: 'rgb(185, 255, 248)',
        fontStyle: 'italic',
    },
    Signin: {
        fontSize: 30,

        color: 'rgb(185, 255, 248)',

    },
    FormView: {
        height: '60%',
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 0,
        backgroundColor: 'rgb(61, 178, 255)'

    },
    TextInput: {
        width: '90%',
        borderWidth: 1,
        borderColor: 'rgb(185, 255, 248)',
        height: 50,
        color: 'rgb(185, 255, 248)',
        fontSize: 25,

        borderRadius: 10,
        paddingLeft: 20,
        marginTop: 50,
        borderBottomWidth: 2,

    },
    ButtonsView: {
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: 'rgb(61, 178, 255)'
    },
    WelcomeTitle: {
        fontSize: 30,
        paddingLeft: 10,
        fontWeight: 'bold',

        alignSelf: 'flex-start',
        color: 'rgb(185, 255, 248)',
        fontStyle: 'italic',


    },
    WelcomeText: {
        paddingLeft: 10,

        fontSize: 25,
        alignSelf: 'flex-start',
        color: 'rgb(185, 255, 248)',
        fontStyle: 'italic',
    },




})

