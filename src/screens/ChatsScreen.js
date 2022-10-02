import { collection, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import GlobalContext from '../../Context/Context';
import MyButton from '../components/MyButton'
import Contacts from '../components/Contacts';
import ItemList from '../components/ItemList';
import useContacts from '../hooks/useHooks';
import ServerApi from '../Api/ServerApi';
import { useState } from 'react';
import {db} from '../firebase'

export default function ChatsScreen() {

    const { rooms, setRooms, setUnfilteredRooms, myContacts,currentUser } = useContext(GlobalContext) // getting the global context provider

    useEffect(() => { //onloading the page require all the requested chats for this user
       /* (async () => {
            try {

                const result = await ServerApi.get('/rooms') //fetching rooms data from the database
                const parsedChats = JSON.parse(result.data.chats);
                // console.log('result of parsedChats')
                console.log(parsedChats);


                setUnfilteredRooms(parsedChats)
                setRooms(parsedChats.filter((doc) => doc.lastMessage));

            } catch (err) {
                console.log('error occured on the useEffect chats screen');
                console.log(err)
            }

        })()

        const chatsQuery = query(// query on firestore collection to get all the current user chats
        collection(db,'rooms'),
        where('participantsArray','array-contains',currentUser.email)
        );
  */

        const chatsQuery = query(// query on firestore collection to get all the current user chats
        collection(db,'rooms'),
        where('participantsArray','array-contains',currentUser.email)
        );
  
        onSnapshot(chatsQuery,(QuerySnapshot)=>{
             const parsedChats = QuerySnapshot.docs.filter((doc)=>doc.data().lastMessage).map(
                (doc)=>({
                    ...doc.data(),
                    id:doc.id,
                    contactedUser:doc.data().participants.find(p=> p.email!== currentUser.email),
    
                })
            )
            //console.log('printing parsed chat')
            //console.log(parsedChats)
       
            setUnfilteredRooms(parsedChats)
            setRooms(parsedChats.filter((doc) => doc.lastMessage));
        });

    }, [])


    function getContactedUser(user) {
        const userContact = myContacts.find((c) => c.email === user.email);

        if (userContact && userContact.contactName) {
            return { ...user, contactName: userContact.contactName }
        }
        else {
            return user
        }

    }

    //need to initialize the room with reciever photo `

    return (
        <SafeAreaView style={styles.container}>
            {rooms.map((room) => <ItemList type='ChatScreen' description={room.lastMessage.text}
                key={room.id}
                room={room}
                time={room.lastMessage.createdAt}

                user={getContactedUser(room.contactedUser)}
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