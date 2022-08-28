import React from "react";
import {Text, View,SafeAreaView, StyleSheet,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Keyboard} from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import MyButton from '../components/MyButton'
import AntDesign from 'react-native-vector-icons';
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper"; // to avoid fields falling underneath the keyboard


function SignUpScreen (props) {

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
           

            <TextInput style={styles.TextInput} spellCheck ={false} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'Full Name'} />
            <TextInput style={styles.TextInput} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'Email'} />
            <TextInput style={styles.TextInput} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'UserName'} />
            <TextInput style={styles.TextInput} secureTextEntry={true} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'PassWord'} />
            <TextInput style={styles.TextInput} secureTextEntry={true} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'PassWord Confirm'} />

            </View>
            
            <View style={styles.ButtonsView}>
                <MyButton title={'Sign Up'}/>
                    
                <MyButton title={ 'Cancel'}/>
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
        fontFamily:'sans-serif-condensed'
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
        marginTop:20,
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
    }


})

export default SignUpScreen ;