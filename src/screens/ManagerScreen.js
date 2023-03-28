import React, { useContext, useState } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import MyButton from '../components/MyButton'
import GlobalContext from '../../Context/Context';
import LoginScreen from './LoginScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { NavigationHelpersContext } from '@react-navigation/native';
import {EncryptAESkey,DecryptAESkey} from '../../utils.js'


function ManagerScreen(props) {
    const {currentUser}=auth 

    const {theme:{colors},setCurrentUser} = useContext(GlobalContext) 
    const publicKey=`-----BEGIN RSA PUBLIC KEY-----MIIBCgKCAQEAvRY8D3feCyzrkMwobdyC6sTlnOlJoh8trZKdtT3L3xLleUOhqW8xHsfb4EkHseQGBkVLdiqsaT/mWWdQmTryhHWy2j77H99PpB7TCEfS5QafQz+HtqM/QyYPe6/jBVd3XRswsosGnB4kJlcqLX1y744dCN8/eAhMKSbTSKi47MJ37bmCWE7kgy+ZEmhVjiVvKghUfLYOu3tvkApIQwvjT7T9IH9BTPBUu9/078QF8HovQ8BkQuHf1t1QGEteEptOXA/IGW3Zo2IPKbrFvBvsYzSGv37kpDv/YT30KYndvDxKcNHAO/p2rtm8w3fi+WFX4WOtgN8SNkdyY20ssOmsIwIDAQAB-----END RSA PUBLIC KEY-----`
    const privateKey =`-----BEGIN RSA PRIVATE KEY-----MIIEpQIBAAKCAQEAvRY8D3feCyzrkMwobdyC6sTlnOlJoh8trZKdtT3L3xLleUOhqW8xHsfb4EkHseQGBkVLdiqsaT/mWWdQmTryhHWy2j77H99PpB7TCEfS5QafQz+HtqM/QyYPe6/jBVd3XRswsosGnB4kJlcqLX1y744dCN8/eAhMKSbTSKi47MJ37bmCWE7kgy+ZEmhVjiVvKghUfLYOu3tvkApIQwvjT7T9IH9BTPBUu9/078QF8HovQ8BkQuHf1t1QGEteEptOXA/IGW3Zo2IPKbrFvBvsYzSGv37kpDv/YT30KYndvDxKcNHAO/p2rtm8w3fi+WFX4WOtgN8SNkdyY20ssOmsIwIDAQABAoIBAQCVbU/TbYfEzx/t0tkUUNII08cc5GMzQm5nn9kP1KEbTaSY2zCTZHKt/4UsTqpNE4ULSZGj9X9AwaW4+2N/ZE0pDpZj0KfF/UTDzzQ4dAIeycfsbfVDCOlCmH5d4ZaHryJ+KrGmNyXnFA6/WdzUDDJbS7R4QWy3397IGo2X+vYA6yX7d7fbKdJ/vjwxLjHxOl80dHGnsmhc1VeUS8rTkkSedk/LnMyUeQcDfhn+VFZzgkphSVhsuPs83gSNpmEclSM3EaLvsu+fxJlFh12vAYuFpDGYGbsWCqPBctt8xFM/1lbB/tYCD825QotniZB81q7CbjOdcsfJwa1Sr1ysexVZAoGBANy4r5ZfAQH/x4J66V+DylN62auHePWkbwrapX+Bbh26pHL0mPbo7K3eFCc41wM0Y3J74cRXcZE9nP1NUrll0uYgT6XhBE7EOxRbD6FOxk4Ww6WiSZDn+QmgYkL3MAqBCTPCJLlH5yilLlVHHh2RM7UR5CpwL3I3j7nePeIatHbvAoGBANtPJhwal3PLI9EOraRDJhVCY8qI4Q9ixpjUKWOhu90Owp4uTwzmLH4yvrZWVYkGfwi56YAmqwEypPWspEX5J7A3apJAIj+w4+EKAqavyAPmXtx01dBMd+ZgG14T97AWC6Vakt58bWz3KCpx5sS6TzNXdr4zCFg+2Z05OR8AKn4NAoGBAJgdN/Wb9+fWzTqhVqCbBR9PNSA/tx8jeduzIAelvawDaz5GT/0qPaL9wEnfpF7zBe5qbgeQdBYyrjTryy02fYhXkEyzrPJTzpuSvkzfK0+55JAMLkMNe9YkkFOyY4t5rkvbas++PBMI88uVva2G2mnZsLOGqUw/+m+QOHnRCbpFAoGAVjA47fqVYvCG1vZJz7CEGv7IcSRyLrXHDvDygzFgv3O5kKjqcEtVWRNgWBB99SgUbL2DwtVvhzz8D4EV3loY+uwMegWycA14wUxJ1nBmzwGObl2MWhxzUpqaptJ6GT3Qvd9msQF9j8Fii6vP4ajGz4qkJAOyV9v7cgq3JDPQf1ECgYEAv4T+IbwSyCL6N5PavjfFCisfsOWQlPZf3E3vZV+B1w0Yj2q6YyNs3kJgfBf9+BisQQAUmqUDJOTaa8zOvdXso3ibiMNZ+ZVN+bin+f773ZDWczEUddeN6M0ux/FMom0x+qyegPx+PILBYYSQDTeTNDnKj7LQF4LLKLjNbNzircI=-----END RSA PRIVATE KEY-----`
    const aeskey='1231231231231231'
    const [encaeskey,setencAESKey] =useState(null)
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

    async function encAES(){

        EncryptAESkey(publicKey,aeskey).then(res=>{
            console.log('encrypted aes key')
            console.log(res)
            setencAESKey(res)
        }).catch(err=>{
            console.log(err)
        })

    }
    async function decAES(){

        DecryptAESkey(privateKey,encaeskey).then(res=>{

            console.log('decrypted aes key')

            console.log(res)
        }).catch(err=>{
            console.log(err)
        })

    }
    return (
        <SafeAreaView>
            <MyButton title={'Help'} onPress={help}/>
            <MyButton title={'SignOut'} onPress={SignOutfun}/>
            <MyButton title={'testAESkeyenc'} onPress={encAES}/>
            <MyButton title={'testAESkeydec'} onPress={decAES}/>

        </SafeAreaView>
    )
}

export default ManagerScreen;