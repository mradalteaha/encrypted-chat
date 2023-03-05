import { View, LogBox, Text } from 'react-native'
import React , {useContext,useState ,useEffect} from 'react'
import GlobalContext from '../../Context/Context'
import { collection, onSnapshot, query, QuerySnapshot, where,getDocs,getDoc} from 'firebase/firestore'
import {auth ,db} from '../firebase.js'
import * as Contacts from 'expo-contacts'


LogBox.ignoreLogs([
    "Setting a timer",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
  ]);
//this screen is just for loading contacts and set up the global context with the contacts 
export default function LoadingContacts() {
    const {myContacts ,setMyContacts , loadingContacts ,setLoadingContacts} = useContext(GlobalContext)
    useEffect(()=>{
      (async()=>{
       const {status} = await Contacts.requestPermissionsAsync();
       if(status==='granted'){
           const {data} = await Contacts.getContactsAsync({
               fields:[Contacts.Fields.Emails , Contacts.IMAGE]
           })
           if(data.length>0){
            // console.log('inside loading contacts screen')
            // console.log(data.length)
            const usersRef = collection(db,'users') 
            const docsSnap = await getDocs(usersRef);
            const usersArray =[];
        
            docsSnap.forEach(doc => {

             
              data.forEach(d=>{
                if(d.emails){
                 // console.log('d.emails is not null')
                  if(d.emails[0].email == doc.data().email){
                   // console.log('loading contact retrieved data')
                    //console.log(doc.data())
                    usersArray.push(doc.data())
                  }
                }
                  
                })
              
                
              
            })

            
             setMyContacts(
              usersArray.map(mapContactToUser)/*
                   data.filter(
                       c => c.firstName && c.emails && c.emails[0].email

                   ).filter(c=>{
                    user=usersArray.find(x=>x.email==c.emails[0].email)
                    
                    if(user){
                     // console.log('userfound ')
                   // console.log(user)
                      return user
                    }
                     
                   })//.map(mapContactToUser)*/
               )
           }
           setLoadingContacts(false)


       }else{
        console.log('failed to load contacts')
       }
      })() 
   },[myContacts])


  
    
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
        email : contact.email
    }
}
