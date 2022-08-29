import React from "react";
import {Text,TouchableOpacity, View,SafeAreaView, StyleSheet,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Keyboard} from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import MyButton from '../components/MyButton'
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper"; // to avoid fields falling underneath the keyboard


function ChatScreen(props) {


    function buttonClickedHandler(){
        console.log('i got clicked i will send chat')
    }

    return (
        <KeyboardAvoidingWrapper>
       
        <SafeAreaView style = {styles.container}>
       
               
            <View style= {styles.TopView}>
    
                  <Text style={styles.Header} >Chat Screen</Text>
            </View>
            <KeyboardAvoidingView>
            <View style= {styles.CenterView}>
      
        <View style= {styles.BottomView}>

      
        <TextInput style={styles.TextInput} secureTextEntry={false} placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'Message'} />

            <TouchableOpacity
                onPress={buttonClickedHandler}
                style={styles.roundButton}>
                <Text>I'm a button</Text>
            </TouchableOpacity>


            </View>
           

            </View>
            </KeyboardAvoidingView>
           
    
    </SafeAreaView>
    </KeyboardAvoidingWrapper>
    
    
    )

}


const styles =StyleSheet.create({
    container : {
        marginTop:10,
        width:'100%',
        flexDirection :'column',
        justifyContent:"flex-start",
        backgroundColor:'#fff',
        height:'100%',
    },
    TopView:{
        backgroundColor: 'rgb(61, 178, 255)',
        marginTop:25,
        width:'100%',
        height:70,
        justifyContent:'flex-start',
        flexDirection:'row',
        

    },
    CenterView:{
        width:'100%',
        flexGrow: 1,
        
        backgroundColor:'green',
        height:'88%',
        justifyContent:'flex-end',
        flexDirection:'column',

    },

    BottomView:{
        width:'100%',
     
        height:40,
        justifyContent:'flex-start',
        flexDirection:'row',
        marginBottom:25,
       

    }
    ,
    TextInput:{
        width:'80%',
        borderWidth:1,
        borderColor:'rgb(185, 255, 248)',
        height:40,
        color:'black',
        fontSize:20,
        backgroundColor:'#fff',
        borderRadius:40,
        paddingLeft:15,
        marginTop:5,
        marginLeft:10,
        multiline:false,
        
        
    },
    roundButton:{
        width: 45,
        height: 45,
        marginLeft:10,
        marginTop:2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'rgb(0, 103, 120)',
        
    },

})

export default ChatScreen ; 