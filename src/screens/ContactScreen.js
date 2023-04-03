import { collection, onSnapshot, query, QuerySnapshot, where,getDocs,getDoc } from 'firebase/firestore';
import React, { cloneElement, useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList ,TouchableOpacity } from 'react-native';
import GlobalContext from '../../Context/Context';
import { auth, db } from '../firebase'
import useContacts from '../hooks/useHooks';
import ItemList from '../components/ItemList';
import { useRoute } from '@react-navigation/native';

function ContactScreen(props) {

    const {myContacts,currentUser,setMyContacts,setLoadingContacts} = useContext(GlobalContext)

   
    useEffect(()=>{ //adding users when new one registered
        const usersRef = collection(db,'users')
            const unsubscribe = onSnapshot(usersRef,querysnapshot=>{
            
               querysnapshot.docChanges().filter(({type})=>type ==='added').map(
                ({doc})=>{
                    
                  setMyContacts(myContacts.set(doc.data().email,doc.data()))
                })
                setLoadingContacts(false)
        });
        return ()=>unsubscribe();
          
    
      },[])
    


    if (!myContacts) {
        return (<SafeAreaView style={styles.container}>
            <Text>Loading contacts...</Text>
        </SafeAreaView>
        )
    }else{
      /*   console.log('printing my contacts')
        console.log(Array.from(myContacts.values())) */
        return (
        <SafeAreaView style={styles.container} >
      
            {myContacts ?    
                <FlatList style={{ flex: 1, padding: 10 }} data={Array.from(myContacts.values() ).filter((c)=> c.email!=currentUser.email )} keyExtractor={(item, i) => item.email}

                    renderItem={({ item }) => <ContactPreview contact={item}  />}
                /> : null}
        </SafeAreaView>
    )
            }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 5,
        paddingRight: 10,


    },


    header: {
        color: 'red',
        fontSize: 50,
        alignSelf: 'center',
    },

});


function ContactPreview({ contact}) {
    const { unfilteredRooms } = useContext(GlobalContext);

  
    return (
    <ItemList style={{marginTop:7}} type='contacts' user={contact} image={contact.photoURL} room={unfilteredRooms.find((room) => room.participantsArray.includes(contact.email))} />
    )

}

export default ContactScreen;