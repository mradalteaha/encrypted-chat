import React, { useContext } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import MyButton from '../components/MyButton'
import GlobalContext from '../../Context/Context';
import LoginScreen from './LoginScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';


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
  
    function goToChat(){


     }

    return (
        <SafeAreaView>
 <MyButton title={'SignOut'} onPress={SignOutfun}/>
<LoginScreen/>



        </SafeAreaView>
    )
}

export default ManagerScreen;