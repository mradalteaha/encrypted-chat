import { collection, onSnapshot, query, QuerySnapshot, where ,deleteDoc,doc} from 'firebase/firestore';
import React, { useContext, useEffect ,useState} from 'react';
import { SafeAreaView,Text ,StyleSheet , View,TouchableOpacity } from 'react-native';
import GlobalContext from '../../Context/Context';
import { useNavigation } from '@react-navigation/native'
import {Grid,Row,Col} from 'react-native-easy-grid'
import Avatar from '../components/Avatar';
import {auth, db} from '../firebase'
import {EvilIcons,Octicons } from "@expo/vector-icons";

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

    function getContactedUser(user){
        // console.log(`evaluating my contacts ${myContacts}`)
        if(myContacts){
         /*    console.log('printing myContacts user  at getContactedUser ')
            console.log(rooms)
            console.log(user)
            console.log(myContacts) */
            const userContact = myContacts.get(user.email);
        /*     console.log('printing contacted user  at getContactedUser ')
            console.log(userContact) */
            return userContact
           
        }
       

    }
    useEffect(()=>{},[rooms])


    //need to initialize the room with reciever photo `

    return (
        <SafeAreaView style={styles.container}>
            {rooms.map((room) => {
                if(typeof(room.contactedUser) !=='undefined'){

                    return( typeof(room) !=='undefined' &&
                <ChatItemList type='ChatScreen' description={room.lastMessage.text}
                key={room.id}
                room={room}
                time={room.lastMessage.createdAt}
                unreadMessages={room.unreadMessages[currentUser.uid]}
                user={getContactedUser(room.contactedUser,myContacts)} 
            /> 
               ) 
                }
               
            })}



        </SafeAreaView>
    )
}




function ChatItemList({type,description,user,style,time ,room ,image,unreadMessages}) {
      const [unread , setUnread] =useState(0)
      const navigation = useNavigation()
      const {theme:{colors} ,setRooms} = useContext(GlobalContext)
      const [selected ,setSelected]=useState(false)
   
    // console.log(user);


   
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
        deleteDoc(doc(db, "rooms", room.id)).then(()=>{
            setRooms(prev => prev.filter( currGroup => currGroup.id !== room.id))
            alert(`chat with : ${room.user}  deleted successfully`)
        })
      }
  
    return (
      <TouchableOpacity style={{height:80,borderRadius:30, backgroundColor: selected? 'red': "white",...style}} onLongPress={()=>handleLongPress()} onPress={()=>navigation.navigate("ChatScreen",{user,room,image})}>
          <Grid style={{maxHeight:80}} >
            <Col style={{width:80,alignItems:'center',justifyContent:'center'}}>
              <Avatar user={user} size={60}/>
            </Col>
            <Col style={{marginLeft:10}}>
              <Row style={{alignItems:'center'}}>
                  <Col>
                    <Text style={{fontWeight:'bold',fontSize:16,color:colors.text}}>
                      {user.displayName}
                    </Text>
                  </Col>
                  
                    {time && (<Col style={{alignItems:"flex-end", }}>
                      <Text style={{color:colors.secondaryText}}>{new Date(time.seconds *1000).toLocaleDateString()}</Text>
                    </Col>)}
                    {selected &&(
                        <Col style={{alignItems:"flex-end", }}>
                   <EvilIcons onPress={()=>deleteGroup()} style={{display: selected ? 'flex':'none'}} name='trash' size={35}/>
                  </Col>
                    )}
                    {(unreadMessages>0) && !selected &&(
                        <Col style={{alignItems:"flex-end", }}>
                   <Text style={{display:'flex' ,marginRight:30 ,backgroundColor:'rgba(0, 252, 185,0.8)',borderRadius: 120,width:35,height:25,justifyContent:'center',textAlign:'center',flexDirection:'column',}} size={55}>{unreadMessages}</Text>
                  </Col>
                    )}
                   
              </Row>
              {description &&(
                <Row style={{marginTop:-5}}>
                <Text style={{color:colors.secondaryText}}>{description}</Text>
                </Row>
              )}
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