import React, { useContext } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import MyButton from '../components/MyButton'
import GlobalContext from '../../Context/Context';
import LoginScreen from './LoginScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { NavigationHelpersContext } from '@react-navigation/native';


function ManagerScreen(props) {
    const {currentUser}=auth 

    const {theme:{colors},setCurrentUser} = useContext(GlobalContext) 

   async function SignOutfun(){ // sign out function for future use 


    signOut(auth).then(() => {
        setCurrentUser(null)
    }).catch((error) => {
        // An error happened.
      });
    }

    function help(){
        //here we go to create help function will take us to help page 

    }

    return (
        <SafeAreaView>
            <MyButton title={'Help'} onPress={help}/>
            <MyButton title={'SignOut'} onPress={SignOutfun}/>
        </SafeAreaView>
    )
}

export default ManagerScreen;