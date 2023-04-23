import React, { useContext, useState ,useEffect} from 'react';
import MyButton from '../components/MyButton'
import GlobalContext from '../../Context/Context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, QuerySnapshot, where ,deleteDoc,doc,updateDoc} from 'firebase/firestore';
import {createAssetAsync,usePermissions,createAlbumAsync} from 'expo-media-library'
import {writeAsStringAsync,readAsStringAsync,documentDirectoryEncodingType} from 'expo-file-system'
import * as Permissions from 'expo-permissions';
import { Image, Button, Text, View, SafeAreaView, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { pickImage, askForPermission ,uploadImagetwo,theme,readUserData,saveUserData} from '../../utils'





function ManagerScreen(props) {
    const {currentUser}=auth 

    const {theme:{colors},setCurrentUser} = useContext(GlobalContext)
    const [selectImage, setSelectedImage] = useState(null);
    const [permissionStatus, permissionStatusUpdate] = useState(null);
   

//    const {granted} =StorageAccessFramework.requestDirectoryPermissionsAsync(`${documentDirectory}localData/`)


   async function SignOutfun(){ // sign out function for future use 
    signOut(auth).then(() => {
        setCurrentUser(null)
    }).catch((error) => {
        // An error happened.
      });
    }

    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    }, [])
   

    function help(){
        //here we go to create help function will take us to help page 

    }

    if (!permissionStatus) {
        return <Text>Loading ...</Text>
    }
    if (permissionStatus !== 'granted') {
        return <Text> you need to grant permission </Text>
    }

    async function readFile(){
        let filename =documentDirectory + "text.txt"
        readAsStringAsync(filename).then((res)=>{
            console.log('reading successfull successfully')
            let results = res
            console.log('retrieved data')
            console.log(results)
        }).catch(err=>{
            console.log('error occured writing to the file')
            console.log(err)
        })
      

    }
  


    async function test(){
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
        let fileUri = FileSystem.documentDirectory + "text.txt";
        await FileSystem.writeAsStringAsync(fileUri, "Hello World", { encoding: FileSystem.EncodingType.UTF8 });
        const asset = await createAssetAsync(fileUri)
        await createAlbumAsync("Download", asset, false)
    }
    }

    async function saveFile() {
        if(permissionStatus){
            const id =currentUser.uid
            userLocal
            await saveUserData(id,JSON.stringify(userLocal))
          
        }
           
        
    }

    async function getData(){
        const data = await readUserData(currentUser.uid)
        console.log('type of data')
        let test = JSON.parse(data)
        console.log(typeof(test))
        console.log(test)

    }

    async function uploadImage(){
        try{
            if (selectImage) {
                
                const { url } = await uploadImagetwo(selectImage, `Images/${currentUser.uid}`, "profilePicture")
                console.log('photo uploaded successfully')
                console.log(url)
                updateDoc(doc(db,"users",currentUser.uid) ,{photoURL:url}).then(()=>{
                    alert('profile picture updated')
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
            <Text style={{fontSize:25}}>Select New Profile Picture</Text>
        </View>
         
            <TouchableOpacity onPress={handleProfileImage} style={{ marginTop: 50, borderRadius: 120, width: 120, height: 120, backgroundColor: colors.foreground, alignItems: 'center', justifyContent: 'center'  ,alignSelf:'center' }}>
                {!selectImage ? (<MaterialCommunityIcons name='camera-plus' color={colors.iconGray} size={45} />) :

                    <Image source={{ uri: selectImage.uri }} style={{ width: '100%', height: '100%', borderRadius: 120 }} />}
            </TouchableOpacity> 
      
           
            <MyButton title={'Update Picture'} onPress={uploadImage}/>
            <MyButton title={'SignOut'} onPress={SignOutfun}/>
          


            

        </SafeAreaView>
    )
}

export default ManagerScreen;





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