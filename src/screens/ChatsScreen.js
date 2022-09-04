import { collection, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import GlobalContext from '../../Context/Context';
import MyButton from '../components/MyButton'
import {auth, db} from '../firebase'
import Contacts from '../components/Contacts';

export default function ChatsScreen() {
    const {currentUser} = auth // grabing the current signed in user via firebase auth
  
    const {rooms,setRooms} = useContext(GlobalContext) // getting the global context provider
    const chatsQuery = query(// query on firestore collection 
        collection(db,'rooms'),
        where('participantArray','array-contains',currentUser.email)
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
            setRooms(parsedChats);      
        });

        return ()=> unsubscribe();
    },[])

    return (
        <SafeAreaView style={styles.container}>
      <Text style={styles.header}> Chats </Text>
      <Contacts/>
      
         
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