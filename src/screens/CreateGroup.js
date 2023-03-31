import React, { useContext, useState ,useEffect} from 'react';
import MyButton from '../components/MyButton'
import GlobalContext from '../../Context/Context';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {createAssetAsync,usePermissions,createAlbumAsync} from 'expo-media-library'
import {writeAsStringAsync,readAsStringAsync,documentDirectoryEncodingType} from 'expo-file-system'
import * as Permissions from 'expo-permissions';
import { Image, Button, Text, View, SafeAreaView, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { pickImage, askForPermission ,uploadImagetwo,theme} from '../../utils'
import { TextInput } from "react-native-gesture-handler";



export default function CreateGroup(props){

    const {currentUser}=auth 

    const {theme:{colors},setCurrentUser} = useContext(GlobalContext)


    const [selectImage, setSelectedImage] = useState(null);
    const [permissionStatus, permissionStatusUpdate] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [RSAkeys, setRSAkeys] = useState(null);
    const [groupName ,setGroupName]= useState('')

    
    const [imageUploadProgress, setImageUploadProgress]=useState(0)

    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    }, [])



    async function uploadImage(){
        try{
            if (selectImage) {
                console.log('error on upload image')
                //console.log(selectImage)
                const { url } = await uploadImagetwo(selectImage, `Images/${currentUser.uid}`, "profilePicture")
                console.log('photo uploaded')
                console.log(url)
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

    function goBack(){
        
            console.log('navigating to back')
            props.navigation.navigate('HomeScreen')
    
        
    }


    return( <SafeAreaView style={{flex:1,flexDirection:'column'}}>
    <View style={{flex:1,backgroundColor:'red',flexDirection:'row' ,height:50}}>
    <TouchableOpacity onPress={handleProfileImage} style={{ marginTop: 25,marginLeft:15, borderRadius: 120, width: 120, height: 120, backgroundColor: colors.foreground, alignItems: 'center', justifyContent: 'center'  ,alignSelf:'flex-start' }}>
            {!selectImage ? (<MaterialCommunityIcons name='camera-plus' color={colors.iconGray} size={45} />) :
                <Image source={{ uri: selectImage.uri }} style={{ width: '100%', height: '100%', borderRadius: 120 }} />}
        </TouchableOpacity> 
        <KeyboardAvoidingView style={{borderBottomColor:'red',alignSelf:'center',marginTop:0,borderColor:'black',borderWidth:10,marginLeft:20}} >
        <TextInput value={groupName} onChangeText={setGroupName}   placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'Enter Group Name'} />
        </KeyboardAvoidingView>
        
       <View style={{marginBottom:0,alignSelf:'flex-end',flex:1,flexDirection:'row' ,height:35}}>
       <Button style={{height:20,width:20 }} title={'uploadImage'} onPress={uploadImage}/>
        <Button title={'goback'} onPress={goBack}/>
       </View>
    </View>
         
       <View style={{flex:1,height:300,backgroundColor:'green'}}>


       </View>
  
        
  
        

    </SafeAreaView>)

}