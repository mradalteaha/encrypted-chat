import { collection, onSnapshot, query, QuerySnapshot, where ,deleteDoc,doc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet ,TouchableOpacity} from 'react-native';
import GlobalContext from '../../Context/Context';
import {auth, db} from '../firebase'
import ItemList from '../components/ItemList';
import useContacts from '../hooks/useHooks';
import AsyncStorageStatic from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import {Grid,Row,Col} from 'react-native-easy-grid'
import GroupImage from '../components/GroupImage'; 
import {EvilIcons } from "@expo/vector-icons";
import { useState } from 'react';



export default function GroupChatsScreen(props) {
    const {currentUser} = auth // grabing the current signed in user via firebase auth
    const {rooms,setRooms,setUnfilteredRooms,myContacts,groups ,setUnfilteredGroups,setGroups} = useContext(GlobalContext) // getting the global context provider
    const chatsQuery = query(// query on firestore collection 
        collection(db,'groups'),
        where('participantsArray','array-contains',currentUser.email)
    );
    
    
    useEffect(()=>{ //onloading the page require all the requested chats for this user
        const unsubscribe = onSnapshot(chatsQuery,(QuerySnapshot)=>{
            const parsedChats = QuerySnapshot.docs.filter((doc)=>doc.data()).map(
                (doc)=>({
                    ...doc.data(),
                    id:doc.id,
                    AESkeys:doc.data().Aeskeys,
                })
            )
            setUnfilteredGroups(parsedChats)
            setGroups(parsedChats);      
        });

        return ()=> unsubscribe();
    },[])

  
    useEffect(()=>{},[groups])


    function CreateGroupChat(){
        console.log('navigating to create groupchat')
        props.navigation.navigate('CreateGroup')

    }

    return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={()=>CreateGroupChat()} style={{backgroundColor:'rgb(15, 52, 96)' ,height:50 ,borderRadius:30, alignContent:'center',alignItems:"center"}} >
      <Text style={{fontSize:25,textAlignVertical:'center',marginTop:5 ,color:'#ffff'}}>Create GroupChat</Text>
    </TouchableOpacity>
            {groups.map((room) => <GroupItem 
                key={room.id}
                room={room}
            />)}



        </SafeAreaView>
    )
}


function GroupItem(props){

    const navigation = useNavigation()
    const {theme:{colors} ,setGroups} = useContext(GlobalContext)
    const {room} = props
    const [selected ,setSelected]=useState(false)
   
  // console.log(user);

  function handleClick(){
    navigation.navigate("GroupChat",{room})
  }
  async function handleLongPress(){
    console.log('long press')
    if(selected){
        setSelected(!selected)
    }else{

        console.log('')
        setSelected(!selected)
    }

  }

  async function deleteGroup(){
    console.log('room deleted')
    console.log(room.id)
    deleteDoc(doc(db, "groups", room.id)).then(()=>{
        setGroups(prev => prev.filter( currGroup => currGroup.id !== room.id))
        alert(`group : ${room.groupName}  deleted successfully`)
    })
  }
  
  return (
    <TouchableOpacity style={{height:80,borderRadius:30 ,backgroundColor: selected? 'red': "white", marginTop:7}} onLongPress={()=>handleLongPress()} onPress={()=>handleClick() }>
    <Grid style={{maxHeight:80}} >
        <Col style={{width:80,alignItems:'center',justifyContent:'center'}}>
        <GroupImage backgroundImage={room.groupImage} size={60}/>
        </Col>
        <Col style={{marginLeft:10}}>
        <Row style={{alignItems:'center'}}>
            <Col>
                <Text style={{fontWeight:'bold',fontSize:16,color:colors.text}}>
                {room.groupName}
                </Text>
            </Col>
            <Col style={{alignItems:"flex-end", }}>
                   <EvilIcons onPress={()=>deleteGroup()} style={{display: selected ? 'flex':'none'}} name='trash' size={35}/>
                  </Col>

        </Row>
        </Col>
    </Grid>  
</TouchableOpacity>
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