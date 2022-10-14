import { View, LogBox, Text } from 'react-native'
import React , {useContext,useState ,useEffect} from 'react'
import GlobalContext from '../../Context/Context'
import useContacts from '../hooks/useHooks'

LogBox.ignoreLogs([
    "Setting a timer",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
  ]);
//this screen is just for loading contacts and set up the global context with the contacts 
export default function LoadingContacts() {
    const contacts = useContacts() 
    const {myContacts ,setMyContacts , loadingContacts ,setLoadingContacts} = useContext(GlobalContext)

    useEffect(()=>{
        if(contacts.length){
            console.log('loading contacts after the hook finished ')
            setMyContacts(contacts)
            setLoadingContacts(false)
        }
    },[contacts])


  
    
  return (
    <View style={{alignContent:'center' , alignItems:'center' , alignSelf:'center' ,flex:1}}>
      <Text>LoadingContacts ... </Text>
    </View>
  )
}