import { collection, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import React, { cloneElement, useContext, useEffect, useState } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet ,FlatList} from 'react-native';
import GlobalContext from '../../Context/Context';
import MyButton from '../components/MyButton'
import {auth, db} from '../firebase'
import Contacts from '../components/Contacts';
import useContacts from '../hooks/useHooks';
import ItemList from '../components/ItemList';
import { useRoute } from '@react-navigation/native';
function ContactScreen(props) {
    
    const contacts =useContacts()
    const route = useRoute()
    const image = route.params && route.params.image

    return (
        <SafeAreaView style={styles.container}>

<FlatList style={{flex:1,padding:10}} data={contacts} keyExtractor={(item,i)=> item.email}
            
            renderItem={({item})=> <ContactPreview contact={item} image={image}/>}
             />   
      
         
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

function ContactPreview({contact , image}){
    const {unfilteredRooms} = useContext(GlobalContext);
    const [user, setUser] = useState(contact);

    useEffect(()=>{
        const q = query(collection(db,'users'),where('email','==',contact.email))
        
        const unsubscribe = onSnapshot(q,snapshot=>{
            if(snapshot.docs.length){
                const userDoc = snapshot.docs[0].data()
                setUser((prevUser)=>({...prevUser , userDoc}))
            }
        })
        return () => unsubscribe()
    },[])
    return (
        <ItemList style={{marginTop:7}} type='contacts' user={user} 
        image={image} room={unfilteredRooms.find((room) =>
        room.participantsArray.includes(contact.email)
      )} />
    )

}

export default ContactScreen;