import React, { useContext, useEffect } from 'react'
import {useState} from "react";
import {Image,Button,Text, View,SafeAreaView, StyleSheet,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Keyboard, TouchableOpacity} from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper"; // to avoid fields falling underneath the keyboard
import {auth, db} from '../firebase'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import Context from '../../Context/Context'
import {pickImage ,askForPermission,uploadImage} from '../../utils'
import { theme } from '../../utils';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
export default function Profile(props) {

    
    const [displayName , setDisplayName ] = useState('');
    const [selectImage , setSelectedImage] = useState(null);
    const [permissionStatus , permissionStatusUpdate] = useState(null);
    const {theme:{colors}} = useContext(Context)
    const navigation = useNavigation()


    useEffect(()=>{
        (async ()=>{
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    },[])
    async function handlePress(){
        const user = auth.currentUser;
        let photoURL 
        if(selectImage){
            const {url} = await uploadImage(selectImage.uri ,`Images/${user.uid}`,"profilePicture" )
            photoURL = url;
        }
        
        const userData = {
            displayName,
            email: user.email
        }
        if(photoURL){
            userData.photoURL = photoURL
        }
        await Promise.all([updateProfile(user,userData),setDoc(doc(db,'users',user.uid),{...userData,uid:user.uid})])
            
        navigation.navigate('HomeScreen')
    
    }
    async function handleProfileImage(){
        const result = await pickImage()
        if(!result.cancelled){
            setSelectedImage(result)
        }
    }
    if(!permissionStatus){
        return <Text>Loading ...</Text>
    }
    if(permissionStatus !== 'granted'){
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
        multiline: false,

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

