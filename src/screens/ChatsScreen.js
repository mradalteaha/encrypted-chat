import { collection, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import GlobalContext from '../../Context/Context';
import {auth, db} from '../firebase'
import ItemList from '../components/ItemList';
import useContacts from '../hooks/useHooks';
import AsyncStorageStatic from '@react-native-async-storage/async-storage'

export default function ChatsScreen() {
    const {currentUser} = auth // grabing the current signed in user via firebase auth
    const {rooms,setRooms,setUnfilteredRooms,myContacts } = useContext(GlobalContext) // getting the global context provider
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
                    AESkey:doc.data().AESkey,
                    contactedUser:doc.data().participants.find(p=> p.email!== currentUser.email),
                })
            )
            setUnfilteredRooms(parsedChats)
            setRooms(parsedChats.filter((doc)=>doc.lastMessage));      
        });

        return ()=> unsubscribe();
    },[])

    function getContactedUser(user , myContacts){
        // console.log(`evaluating my contacts ${myContacts}`)
        if(myContacts){
            const userContact = myContacts.find((c)=>c.email ===user.email);
            if(userContact && userContact.displayName ){

                return userContact
            }
        }
       

    }
    useEffect(()=>{},[rooms])


    //need to initialize the room with reciever photo `

    return (
        <SafeAreaView style={styles.container}>
            {rooms.map((room) => <ItemList type='ChatScreen' description={room.lastMessage.text}
                key={room.id}
                room={room}
                time={room.lastMessage.createdAt}
                user={getContactedUser(room.contactedUser,myContacts)}
            />)}



        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 5,
        paddingRight: 10,


    },

    header: {
        color: 'blue',
        fontSize: 50,
        alignSelf: 'center',
    },

});