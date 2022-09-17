import React, { useContext, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useState } from "react";
import { Image, Button, Text, View, SafeAreaView, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import MyButton from '../components/MyButton'
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper"; // to avoid fields falling underneath the keyboard
import { auth, db } from '../firebase'
import { Constants } from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import FormInput from '../components/FormInput'
import { pickImage, askForPermission, uploadImage } from '../../utils'
import { theme } from '../../utils';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import GlobalContext from '../../Context/Context';
import ServerApi from '../Api/ServerApi';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';




const uploadProfilePhotoAPI = async (imageURI) => {

    const formData = new FormData();
    formData.append('file', {
        name: new Date() + '_profile',
        uri: imageURI,
        type: 'image/jpg',
    });;



    try {

        const response = await ServerApi.post('/ProfilePhotoUpload', formData, {
            headers: {

                'Content-Type': 'multipart/form-data',

            },
        })

        if (response) {
            console.log(response.data)
            return response.data.url
        }
    } catch (err) {
        console.log(err)

        console.log('uploading the photo failed')
        return err

    }



}


async function updateProfileAPI(userData) {

    console.log('inside update profile api printing the userdata')
    console.log(userData)
    /*
        const formData = new FormData();
    
        userData.enteries.array.forEach(element => {
            formData.append(element.key(),element.val());
        });
        console.log('printing the form Data in update profile API')
        console.log(formData)*/

}


export default function Profile(props) {

    const [displayName, setDisplayName] = useState('');
    const [selectImage, setSelectedImage] = useState(null);
    const [permissionStatus, permissionStatusUpdate] = useState(null);
    const { theme: { colors }, currentUser } = useContext(GlobalContext)

    const navigation = useNavigation()

    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    }, [])




    const handlePress = async () => {
        const user = currentUser;

        const userData = {
            displayName: displayName,
            email: user.email
        }

        if (selectImage) {
            try {
                console.log(selectImage.uri)
                const photoURL = await uploadProfilePhotoAPI(selectImage.uri);
                if (photoURL) {
                    console.log(photoURL)
                }

            } catch (err) {
                console.log('failed !!')
                console.log(err)
            }
            /*
            photoURL =await uploadProfilePhotoAPI(selectImage.uri).then(async(photo)=>{
                if(photo){
                    userData.photoURL = photo
                }
            }).then(async ()=>
                await updateProfileAPI(userData) 
            ).catch(err=>{console.log(err)}).finally(()=>{
                console.log('finally block')
                //navigation.navigate('HomeScreen')
            })*/
        }


    }



    async function handleProfileImage() {
        const result = await pickImage()
        if (!result.cancelled) {
            setSelectedImage(result)
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
                            <Button title={'Next'} onPress={handlePress} disabled={!displayName || !selectImage} />

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

