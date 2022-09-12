import { collection, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import GlobalContext from '../../Context/Context';
import MyButton from '../components/MyButton'
import {auth, db} from '../firebase'
import Contacts from '../components/Contacts';
import ItemList from '../components/ItemList';
import useContacts from '../hooks/useHooks';

export default function ChatsScreen() {
    // grabing the current signed in user via firebase auth
    const contacts =useContacts()

    const {rooms,setRooms,setUnfilteredRooms,currentUser} = useContext(GlobalContext) // getting the global context provider
   
   
    const chatsQuery = query(// query on firestore collection 
        collection(db,'rooms'),
        where('participantsArray','array-contains',currentUser.email)
    );

    useEffect(()=>{ //onloading the page require all the requested chats for this user
        const unsubscribe = onSnapshot(chatsQuery,(QuerySnapshot)=>{
            const parsedChats = QuerySnapshot.docs.filter((doc)=>doc.data().lastMessage).map(
                (doc)=>({
                    ...doc.data(),
                    id:doc.id,
                    contactedUser:doc.data().participants.find(p=> p.email!== currentUser.email),

                })
            )
            setUnfilteredRooms(parsedChats)
            setRooms(parsedChats.filter((doc)=>doc.lastMessage));      
        });

        return ()=> unsubscribe();
    },[])

    function getContactedUser(user , contacts){
        const userContact = contacts.find((c)=>c.email ===user.email);
        if(userContact && userContact.contactName ){
        
            return {...user , contactName : userContact.contactName}
        }
      
    }

  //need to initialize the room with reciever photo `

    return (
        <SafeAreaView style={styles.container}>
        {rooms.map((room)=> <ItemList type='ChatScreen' description={room.lastMessage.text} 
        key={room.id}
        room={room}
        time={room.lastMessage.createdAt}
       
        user={getContactedUser(room.contactedUser,contacts)}
         />)}

    
         
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
        color : 'blue' ,
        fontSize : 50 ,
        alignSelf : 'center',
    },

});