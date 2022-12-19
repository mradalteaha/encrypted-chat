import React, { Component, Fragment } from 'react'
import { TextInput,h1,Text, SafeAreaView, View, StyleSheet } from 'react-native'
import "react-native-gesture-handler";
import MyButton from '../components/MyButton'



function ForgotPassword(props){
    return(
        <View>
                <Text style={styles.Header} >Enter your email to reset the password </Text>
                <TextInput style={styles.TextInput} placeholderTextColor ={'rgb(15, 15, 15)'} placeholder={'Email'} />
                <MyButton title={"Send email"}/>
   
        </View>
    )
} 


const styles = StyleSheet.create({
  

 
    Header:{
        fontSize:50,
        alignSelf:'center',
        color:'rgb(15, 15, 15)',
        fontStyle:'italic',
    },

    TextInput:{
        width:'90%',
        borderWidth:1,
        borderColor:'rgb(15, 15, 15)',
        height:50,
        color:'rgb(15, 15, 15)',
        fontSize:25,
        alignSelf:'center',
        borderRadius:10,
        paddingLeft:20,
        marginTop:20,
        
    },
})

export default ForgotPassword;