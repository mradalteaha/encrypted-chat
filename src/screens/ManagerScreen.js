import React, { useContext } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import MyButton from '../components/MyButton'
import GlobalContext from '../../Context/Context';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import ServerApi from '../Api/ServerApi.js'


function ManagerScreen(props) {

    const {theme:{colors},currentUser,setCurrentUser} = useContext(GlobalContext) 

   async function SignOutfun(){ // sign out function for future use 

        try{
            const res = await ServerApi.get('signOut')
            console.log(res.data)
            setCurrentUser(null);
        }
        catch(err){
            console.log(err)
        }
        
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