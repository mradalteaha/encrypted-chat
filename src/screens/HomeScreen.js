import React from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import MyButton from '../components/MyButton'

function HomeScreen(props) {

    function goToLogin(){
        console.log(props.navigation.navigate('LogInScreen'));

    }
    function goToSignUp(){
        console.log(props.navigation.navigate('SignUpScreen'));
    
    
    }

    return (
        <SafeAreaView>
      <Text style={styles.header}>  بسم  الله الرحمن الرحيم </Text>
      
        <MyButton title={'go To Sign In Screen'} onPress={goToLogin}></MyButton>
        <MyButton title={'go To Sign Up Screen'} onPress={goToSignUp}></MyButton>
         
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container :{
        backgroundColor : '#fff',


    },

    header : {
        color : 'red' ,
        fontSize : 50 ,
        alignSelf : 'center',
    },

});

export default HomeScreen;