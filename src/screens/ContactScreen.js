import { collection, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import GlobalContext from '../../Context/Context';
import MyButton from '../components/MyButton'
import {auth, db} from '../firebase'
import Contacts from '../components/Contacts';
import useContacts from '../hooks/useHooks';
function ContactScreen(props) {
    
    const contacts =useContacts()

    return (
        <SafeAreaView style={styles.container}>
      <Text style={styles.header}> {JSON.stringify(contacts)} </Text>
     
      
         
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container :{
        backgroundColor : '#fff',
        flex:1,
        padding:5,
        paddingRight:10,


    },

    header : {
        color : 'red' ,
        fontSize : 50 ,
        alignSelf : 'center',
    },

});

export default ContactScreen;