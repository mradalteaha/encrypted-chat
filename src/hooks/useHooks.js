import {useEffect,useState} from 'react'
import * as Contacts from 'expo-contacts'

export default function useContacts(){

    const [contacts , setContacts] = useState([])
    useEffect(()=>{
       (async()=>{
        const {status} = await Contacts.requestPermissionsAsync();
        if(status==='granted'){
            const {data} = await Contacts.getContactsAsync({
                fields:[Contacts.Fields.Emails , Contacts.IMAGE]
            })
            if(data.length>0){
                setContacts(
                    data.filter(
                        c => c.firstName && c.emails && c.emails[0].email

                    ).map(mapContactToUser)
                )
            }
        }
       })() 
    },[])
    
    return contacts


}


function mapContactToUser(contact){
    return {
        displayName : contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName,
        photoURL:contact.image ? contact.image: require('../../assets/icon-square.png'),
        email : contact.emails[0].email
    }
}