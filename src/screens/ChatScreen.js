//@refresh reset
import React ,{useCallback, useContext, useEffect,useState}from "react";
import "react-native-get-random-values"; // to generate random ids 
import { nanoid }from 'nanoid'// to generate random ids
import {Image,TouchableOpacity, View, StyleSheet,ImageBackground} from 'react-native';
import GlobalContext from '../../Context/Context';//global variables to access via provider
import { auth ,db} from "../firebase"; // firebase instance 
import { useRoute } from "@react-navigation/native";
import { collection, onSnapshot,doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import {GiftedChat, Actions, Bubble,InputToolbar} from 'react-native-gifted-chat'
import { Ionicons ,Fontisto } from "@expo/vector-icons";
import {uploadImage,pickImageChat} from '../../utils'
import ImageView from "react-native-image-viewing";

const randomId = nanoid()

function ChatScreen(props) {

    const [roomHash , setroomHash] = useState('') ;//for generating path in the database 
    const [messages , setMessages] = useState([]) ;//to be able to access the data and manipulate the messages
    //these two states are related to view images 
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageView, setSeletedImageView] = useState("");

    const {currentUser} = auth;
    const route = useRoute();
    const room = route.params.room;
    const selectedImage = route.params.image;
    const contactedUser = route.params.user;

    const {theme:{colors}} = useContext(GlobalContext)

    const senderUser = currentUser.photoURL //asssigning the current user to the sender user
    ? {
        name: currentUser.displayName,
        _id: currentUser.uid,
        avatar: currentUser.photoURL,
      }
    : { name: currentUser.displayName, _id: currentUser.uid };

  const roomId = room ? room.id : randomId; //if there are no existing room generate a new room id

  const roomRef = doc(db, "rooms", roomId); //document of the room based on it's id
  const roomMessagesRef = collection(db, "rooms", roomId, "messages");//refrecnce for the messegaes on particular room

  useEffect(()=>{ //creating room if there is not existed one 
    (async()=>{
        if(!room){
            const currentUserData ={
                displayName : currentUser.displayName,
                email: currentUser.email
            }
            if(currentUser.photoURL){
                currentUserData.photoURL=currentUser.photoURL
            }
            const contactedUserData={
                displayName : contactedUser.contactName || contactedUser.displayName || '',
                email : contactedUser.email
            }
            if(contactedUser.photoURL){
                contactedUserData.photoURL = contactedUser.photoURL
            }
            const roomData={
                participants :[currentUserData , contactedUserData] ,
                participantsArray: [currentUserData.email , contactedUserData.email]
            }
            try{
                await setDoc(roomRef,roomData) //initializing the room 
            }catch(err){
                console.log(err)
            }

        }
        const emailHash =`${currentUser.email}:${contactedUser.email}`

        setroomHash(emailHash);
        if (selectedImage && selectedImage.uri) {
          await sendImage(selectedImage.uri, emailHash);
        }
    })()
  },[])

  useEffect(()=>{ //query over the messages in the room at start and append new messages
    const unsubscribe = onSnapshot(roomMessagesRef,querysnapshot=>{
        const messagesFirestore = querysnapshot.docChanges().filter(({type})=>type ==='added').map(
            ({doc})=>{
                const message = doc.data()
                return {...message,createdAt : message.createdAt.toDate()}
            }).sort((a,b)=> b.createdAt.getTime() - a.createdAt.getTime())
            appendMessages(messagesFirestore) 
    });
    return ()=>unsubscribe();
  },[])

  const appendMessages = useCallback((messages)=>{ // help function to append messages
    setMessages((previousMessaged) => GiftedChat.append(previousMessaged,messages))
  },[messages])

      
    
    async function onSend(messages=[]){
        const writes  = messages.map(m=>addDoc(roomMessagesRef,m)) //adding the new message to the firestore
        const lastMessage= messages[messages.length -1]
        writes.push(updateDoc(roomRef,{lastMessage}))//updating the last message for the look of chats screen
        await Promise.all(writes)
    }


    async function sendImage(uri, roomPath) {
        const { url, fileName } = await uploadImage(
          uri,
          `images/rooms/${roomPath || roomHash}`
        );
        const message = {
          _id: fileName,
          text: "",
          createdAt: new Date(),
          user: senderUser,
          image: url,
        };
        const lastMessage = { ...message, text: "Image" };
        await Promise.all([
          addDoc(roomMessagesRef, message),
          updateDoc(roomRef, { lastMessage }),
        ]);
      }


      async function handlePhotoPicker() {
        const result = await pickImageChat();
        if (!result.cancelled) {
          await sendImage(result.uri);
        }
      }


    return (
        <ImageBackground style={{flex:1}} resizeMode="cover" source={require('../../assets/chatbg.png')}>
         <GiftedChat
        onSend={onSend}
        messages={messages} //the messages needs to be rendered
        user={senderUser}
        renderAvatar={null}
        renderActions={(props) => (
          <Actions
            {...props}
            containerStyle={{
              position: "absolute",
              right: 50,
              bottom: 5,
              zIndex: 9999,
            }}
            onPressActionButton={handlePhotoPicker}
            icon={() => (
              <Fontisto name="paperclip" size={25} color={colors.iconGray} />
            )}
          />
        )}
        timeTextStyle={{ right: { color: colors.iconGray } }} // time stamp on the bubble 
        renderSend={(props) => {//rendering the send button 
          const { text, messageIdGenerator, user, onSend } = props;
          return (
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: text ?  colors.foreground : colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
              disabled={!text}
              onPress={() => {
                if (text && onSend) {
                  onSend(
                    {
                      text: text.trim(),
                      user,
                      _id: messageIdGenerator(),
                    },
                    true
                  );
                }
              }}
            >
              <Ionicons name="send" size={20} color={colors.white} />
            </TouchableOpacity>
          );
        }}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 2,
              borderRadius: 20,
              paddingTop: 5,
            }}
            
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{ right: { color: colors.text } }} //right for sender side and left for the reciever
            wrapperStyle={{
              left: {
                backgroundColor: colors.white,
              },
              right: {
                backgroundColor: colors.tertiary,
              },
            }}
          />
        )}
        renderMessageImage={(props) => {
          return (
            <View style={{ borderRadius: 15, padding: 2 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setSeletedImageView(props.currentMessage.image);
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{
                    width: 200,
                    height: 200,
                    padding: 6,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: props.currentMessage.image }}
                />
                {selectedImageView ? (
                  <ImageView
                    imageIndex={0}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    images={[{ uri: selectedImageView }]}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          );
        }}
      />      
           
            </ImageBackground>
    
    
    )

}


const styles =StyleSheet.create({
    container : {
        marginTop:10,
        width:'100%',
        flexDirection :'column',
        justifyContent:"flex-start",
        backgroundColor:'#fff',
        height:'100%',
    },
    TopView:{
        backgroundColor: 'rgb(61, 178, 255)',
        marginTop:25,
        width:'100%',
        height:70,
        justifyContent:'flex-start',
        flexDirection:'row',
        

    },
    CenterView:{
        width:'100%',
        flexGrow: 1,
        
        backgroundColor:'green',
        height:'88%',
        justifyContent:'flex-end',
        flexDirection:'column',

    },

    BottomView:{
        width:'100%',
     
        height:40,
        justifyContent:'flex-start',
        flexDirection:'row',
        marginBottom:25,
       

    }
    ,
    TextInput:{
        width:'80%',
        borderWidth:1,
        borderColor:'rgb(185, 255, 248)',
        height:40,
        color:'black',
        fontSize:20,
        backgroundColor:'#fff',
        borderRadius:40,
        paddingLeft:15,
        marginTop:5,
        marginLeft:10,
        multiline:false,
        
        
    },
    roundButton:{
        width: 45,
        height: 45,
        marginLeft:10,
        marginTop:2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'rgb(0, 103, 120)',
        
    },
    ChatView :{
        backgroundColor : 'red' , 
        width : '100%', 
        height :'80%',

        backgroundColor : 'rgb(0, 103, 120)',

    } ,
})

export default ChatScreen ; 