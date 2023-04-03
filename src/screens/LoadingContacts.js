import { View, LogBox, Text } from 'react-native'
import React , {useContext,useState ,useEffect} from 'react'
import GlobalContext from '../../Context/Context'
import { collection, onSnapshot, query, QuerySnapshot, where,getDocs,getDoc, doc} from 'firebase/firestore'
import {auth ,db} from '../firebase.js'
import * as Contacts from 'expo-contacts'
///////////////// need to convert myContacts into Map instead of array

LogBox.ignoreLogs([
    "Setting a timer",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
  ]);
//this screen is just for loading contacts and set up the global context with the contacts 
export default function LoadingContacts() {

  
    const {myContacts ,setMyContacts , loadingContacts ,setLoadingContacts} = useContext(GlobalContext)
    useEffect(()=>{
      async ()=>{
        const usersRef = collection(db,'users') 
        const docsSnap = getDocs(usersRef);
        docsSnap.forEach(doc => {
          setMyContacts(myContacts.set(doc.data().email,doc.data()))
        })   

      }
      setLoadingContacts(false)
     

   },[])


  
    
  return (
    <View style={{alignContent:'center' , alignItems:'center' , alignSelf:'center' ,flex:1}}>
      <Text>LoadingContacts ... </Text>
    </View>
  )
}



function mapContactToUser(contact){
//  console.log('print inside mapContactToUser ')
  //console.log(contact)

    return {
        displayName : contact.displayName,
        photoURL:contact.photoURL ? contact.photoURL: require('../../assets/icon-square.png'),
        email : contact.email,
        RSApublicKey:contact.RSApublicKey
    }
}
