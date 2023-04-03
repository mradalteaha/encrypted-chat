import { collection, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet ,TouchableOpacity} from 'react-native';
import GlobalContext from '../../Context/Context';
import {auth, db} from '../firebase'
import ItemList from '../components/ItemList';
import useContacts from '../hooks/useHooks';
import AsyncStorageStatic from '@react-native-async-storage/async-storage'

export default function GroupChatsScreen(props) {
    const {currentUser} = auth // grabing the current signed in user via firebase auth
    const {rooms,setRooms,setUnfilteredRooms,myContacts,groups ,setUnfilteredGroups,setGroups} = useContext(GlobalContext) // getting the global context provider
    const chatsQuery = query(// query on firestore collection 
        collection(db,'groups'),
        where('participantsArray','array-contains',currentUser.email)
    );
    useEffect(()=>{ //onloading the page require all the requested chats for this user
        const unsubscribe = onSnapshot(chatsQuery,(QuerySnapshot)=>{
            const parsedChats = QuerySnapshot.docs.filter((doc)=>doc.data().lastMessage).map(
                (doc)=>({
                    ...doc.data(),
                    id:doc.id,
                    AESkeys:doc.data().AESkeys,
                })
            )
            setUnfilteredGroups(parsedChats)
            setGroups(parsedChats.filter((doc)=>doc.lastMessage));      
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


    function CreateGroupChat(){
        console.log('navigating to create groupchat')
        props.navigation.navigate('CreateGroup')

    }

    return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={()=>CreateGroupChat()} style={{backgroundColor:'rgb(15, 52, 96)' ,height:50 ,borderRadius:30, alignContent:'center',alignItems:"center"}} >
      <Text style={{fontSize:25,textAlignVertical:'center',marginTop:5 ,color:'#ffff'}}>Create GroupChat</Text>
    </TouchableOpacity>
            {groups.map((room) => <ItemList type='ChatScreen' description={room.lastMessage.text}
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