import React, { useContext, useState ,useEffect} from 'react';
import MyButton from '../components/MyButton'
import GlobalContext from '../../Context/Context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, QuerySnapshot, where ,deleteDoc,doc,updateDoc} from 'firebase/firestore';
import {writeAsStringAsync,readAsStringAsync,documentDirectoryEncodingType} from 'expo-file-system'
import * as Permissions from 'expo-permissions';
import { Image, Button, Text, View, SafeAreaView, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { pickImage, askForPermission ,uploadImagetwo,theme,readUserData,saveUserData} from '../../utils'
import { useRoute } from '@react-navigation/native'



export default function ChatManager(props){
    const route = useRoute()
    const {currentUser}=auth 

    const {theme:{colors},setCurrentUser} = useContext(GlobalContext)
    const [selectImage, setSelectedImage] = useState(null);
    const [permissionStatus, permissionStatusUpdate] = useState(null);

   
    const {room} = route.params
    const {roomId , backGround} = room
    const localbackGround = backGround ? backGround: require('../../assets/chatbg.png')

    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    }, [])

    async function uploadImage(){
        try{
            if (selectImage) {
                
                const { url } = await uploadImagetwo(selectImage, `Images/${roomId}`, "backGround")
                console.log('photo uploaded successfully')
                console.log(url)
                updateDoc(doc(db,"rooms",roomId) ,{backGround:url}).then(()=>{
                    alert('Group Back Ground updated')
                })
            }


        }catch(err){
        console.log('error uploading')    
            console.log(err)
        }
     
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
        <SafeAreaView style={{flex:1,display:'flex', flexDirection:'column',justifyContent:'center',}}>
        <View style={{display:'flex',flex:0.25,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:25}}>Change theme</Text>
        </View>
         
            <TouchableOpacity onPress={handleProfileImage} style={{ marginTop: 50, width: 240, height: 240, backgroundColor: colors.foreground, alignItems: 'center', justifyContent: 'center'  ,alignSelf:'center' }}>
                {!selectImage ? (<MaterialCommunityIcons name='camera-plus' color={colors.iconGray} size={45} />) :

                    <Image source={{ uri:selectImage.uri ? selectImage.uri :localbackGround }} style={{ width: '100%', height: '100%',  }} />}
            </TouchableOpacity> 
      
           
            <MyButton title={'Change Background'} onPress={uploadImage}/>
          


            

        </SafeAreaView>
    )


}