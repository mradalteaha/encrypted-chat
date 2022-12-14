import { View, LogBox, Text } from 'react-native'
import React , {useContext,useState ,useEffect} from 'react'
import GlobalContext from '../../Context/Context'
import useContacts from '../hooks/useHooks'
import * as Contacts from 'expo-contacts'


LogBox.ignoreLogs([
    "Setting a timer",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
  ]);
//this screen is just for loading contacts and set up the global context with the contacts 
export default function LoadingContacts() {
    const contacts = useContacts() 
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
             setMyContacts(
                   data.filter(
                       c => c.firstName && c.emails && c.emails[0].email

                   ).map(mapContactToUser)
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
    return {
        contactName : contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName,
        Image:contact.image ? contact.image: require('../../assets/icon-square.png'),
        email : contact.emails[0].email
    }
}