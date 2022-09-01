import React, { useContext } from 'react'
import {StatusBar} from 'expo-status-bar'
import {useState} from "react";
import {Text, View,SafeAreaView, StyleSheet,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Keyboard, TouchableOpacity} from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import MyButton from '../components/MyButton'
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper"; // to avoid fields falling underneath the keyboard
import {signUp ,signIn} from '../firebase'
import { Constants } from 'expo-constants';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import Context from '../../Context/Context'
import FormInput from '../components/FormInput'

export default function Profile(props) {

    const [displayName , setDisplayName ] = useState('');
    const [selectImage , setSelectedImage] = useState(null);
    const {theme:{colors}} = useContext(Context)


    function handlePress(){

    }
  return (
    <React.Fragment>
   <KeyboardAvoidingWrapper>
    <SafeAreaView style = {styles.container}>
   
           
        <View style= {styles.TopView}>

              <Text style={styles.Header} >Set Up your profile </Text>
              <Text style={styles.WelcomeTitle} >Please Provide displayName and Profile Image </Text>

        </View>
        
        <View style= {styles.BottomView}>
            <TouchableOpacity style={{marginTop:30 , borderRadius:120 ,width:120 , height:120 , backgroundColor:colors.foreground ,alignItems:'center', justifyContent:'center' }}>
                {!selectImage ? (<MaterialCommunityIcons name='camera-plus' color={colors.iconGray} size={45} />) :

                 <Image source={{uri:selectImage}} style={{width:'100%', height:'100%' , borderRadius:120}} /> }
            </TouchableOpacity>
            <TextInput value={displayName} onChangeText={setDisplayName} style={styles.TextInput} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'Enter your display name '} />

           
        
            <View style={styles.ButtonsView}>
                <MyButton title={'Next'} onPress={handlePress} disabled={!displayName} />
                    
            </View>

            
           
            
        
    
        </View> 


</SafeAreaView>
</KeyboardAvoidingWrapper>
        
    </React.Fragment>
  )
}


const styles =StyleSheet.create({
    container : {
        marginTop:40,
        width:'100%',
        flexDirection :'column',
        justifyContent:"center",
        backgroundColor:'#fff',
    },
    TopView:{
        width:'100%',
        height:'20%',
        backgroundColor: 'rgb(61, 178, 255)',
        justifyContent:"center",
        display:'flex',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        

    },
    BottomView:{
        width:'100%',
        height:'80%',
        backgroundColor: 'rgb(61, 178, 255)',
        alignItems:'center'
    },
    Header:{
        fontSize:50,
        alignSelf:'center',
        color:'rgb(185, 255, 248)',
        fontStyle:'italic',
        fontFamily:'sans-serif-condensed'
    },
    Signin:{
        fontSize:30,
       
        color:'rgb(185, 255, 248)',
       
    },
    FormView:{
        height:'60%',
        alignSelf:'center',
        alignItems:'center',
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        marginTop:0,
        backgroundColor:'rgb(61, 178, 255)'

    },
    TextInput:{
        width:'90%',
        borderWidth:1,
        borderColor:'rgb(185, 255, 248)',
        height:50,
        color:'rgb(185, 255, 248)',
        fontSize:25,
        
        borderRadius:10,
        paddingLeft:20,
        marginTop:40,
        borderBottomWidth:2,
        multiline:false,
        
    },
    ButtonsView:{
        alignSelf:'center',
        alignItems:'center',
        width:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:0,
        backgroundColor:'rgb(61, 178, 255)'
    },
    WelcomeTitle:{
        fontSize:30,
        paddingLeft:10,
        fontWeight:'bold',

        alignSelf:'flex-start',
        color:'rgb(185, 255, 248)',
        fontStyle:'italic',
        fontFamily:'sans-serif-condensed'

    },
    WelcomeText:{
        paddingLeft:10,

        fontSize:25,
        alignSelf:'flex-start',
        color:'rgb(185, 255, 248)',
        fontStyle:'italic',
        fontFamily:'sans-serif-condensed'
    },




})

