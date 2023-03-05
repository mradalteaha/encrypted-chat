import React ,{useState} from "react";
import {Text, View,SafeAreaView, StyleSheet,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Keyboard, TouchableOpacity} from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper"; // to avoid fields falling underneath the keyboard
import {signUp ,signIn} from '../firebase'
function SignUpScreen (props) {
    const [email ,setEmail]= useState('')
    const [password ,setPassWord]= useState('')
    const [conPassword ,setconPassWord]= useState('')
    async function handleClick(){
        await signUp(email,password)
    
    }
    
    function gotosignin(){
        props.navigation.navigate('LogInScreen')
    }

return (
    <KeyboardAvoidingWrapper>
    <SafeAreaView style = {styles.container}>
   
           
        <View style= {styles.TopView}>

              <Text style={styles.Header} >Sign Up</Text>
        </View>
        
        <View style= {styles.BottomView}>
        <Text style={styles.WelcomeTitle} >Welcome to Secret Chat </Text>
        <Text style={styles.WelcomeText} >Our App provides you full privacy with real end-end encryption ! </Text>
            
            <View style={styles.FormView}>
           

            <TextInput value={email} onChangeText={setEmail} style={styles.TextInput} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'Email'} />
            <TextInput value={password} onChangeText={setPassWord} style={styles.TextInput} secureTextEntry={true} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'PassWord'} />
            <TextInput value={conPassword} onChangeText={setconPassWord} style={styles.TextInput} secureTextEntry={true} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'PassWord Confirm'} />

            <View style={styles.ButtonsView}>
                <TouchableOpacity style={{
                    backgroundColor:"rgb(15, 52, 96)",
                    margin:20,
                    borderRadius:15,
                    height:50,
                    alignContent:'center',
                    
                    
                }} title={'Sign Up'} disabled={(!email || !password || !conPassword) ||(password!==conPassword)  } onPress={handleClick}> 
                <Text style={{ 
                fontSize:35,
                marginLeft:5,
                
                color:'rgb(185, 255, 248)',
                }}>sign Up </Text>

                </TouchableOpacity>
                    
            </View>

            <View style={styles.Registered}>
            <Text style={styles.WelcomeText} >I already have account ! </Text>
                    <TouchableOpacity>
                        <Text onPress={gotosignin} style={styles.Signin}>sign In </Text>
                    </TouchableOpacity>
            </View>
            </View> 
            
        
    
        </View> 


</SafeAreaView>
</KeyboardAvoidingWrapper>

    
    

)

}
const styles =StyleSheet.create({
    container : {
        marginTop:40,
        width:'100%',
        flexDirection :'column',
        justifyContent:"center",
        backgroundColor:'#fff'
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
    },
    Header:{
        fontSize:50,
        alignSelf:'center',
        color:'rgb(185, 255, 248)',
        fontStyle:'italic',
    },
    Signin:{
        fontSize:30,
       
        color:'rgb(185, 255, 248)',
       
    },
    FormView:{
        height:'60%',
        alignSelf:'flex-end',
        alignItems:'center',
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        marginTop:40,
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
        marginTop:20,
        
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

    },
    WelcomeText:{
        paddingLeft:10,

        fontSize:25,
        alignSelf:'flex-start',
        color:'rgb(185, 255, 248)',
        fontStyle:'italic',
    },
    Registered:{
        flex:1,
        marginTop:20 ,
        flexDirection:'row',
        

    },



})

export default SignUpScreen ;