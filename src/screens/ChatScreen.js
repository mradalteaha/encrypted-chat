//@refresh reset
import React, { useCallback, useContext, useEffect, useState } from "react";
import "react-native-get-random-values"; // to generate random ids 
import { nanoid } from 'nanoid'// to generate random ids
import { Image, TouchableOpacity, View, StyleSheet, ImageBackground } from 'react-native';
import GlobalContext from '../../Context/Context';//global variables to access via provider
import { auth, db } from "../firebase"; // firebase instance 
import { useRoute } from "@react-navigation/native";
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { GiftedChat, Actions, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { uploadImage, pickImageChat } from '../../utils'
import ImageView from "react-native-image-viewing";
import ServerApi from '../Api/ServerApi';

const randomId = nanoid()

function ChatScreen(props) {

  const [roomHash, setroomHash] = useState('');//for generating path in the database 
  const [messages, setMessages] = useState([]);//to be able to access the data and manipulate the messages
  //these two states are related to view images 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSeletedImageView] = useState("");
  const [counter, setCounter] = useState(0);
  const [loaded, setloaded] = useState(false);
  const { theme: { colors }, currentUser } = useContext(GlobalContext)

  const route = useRoute();
  const room = route.params.room;
  const selectedImage = route.params.image;
  const contactedUser = route.params.user;

  //console.log('printing the room')
  // console.log(room)


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


  


  useEffect(() => { //initialize room if there are no existing one within the rooms array.

    (async () => {
      if (!room) {
        const currentUserData = {
          displayName: currentUser.displayName,
          email: currentUser.email
        }
        if (currentUser.photoURL) {
          currentUserData.photoURL = currentUser.photoURL
        }
        const contactedUserData = {
          displayName: contactedUser.contactName || contactedUser.displayName || '',
          email: contactedUser.email
        }
        if (contactedUser.photoURL) {
          contactedUserData.photoURL = contactedUser.photoURL
        }
        const roomData = {
          participants: [currentUserData, contactedUserData],
          participantsArray: [currentUserData.email, contactedUserData.email]
        }
        try {
          await setDoc(roomRef, roomData) //initializing the room 
        } catch (err) {
          console.log(err)
        }

      }
      const emailHash = `${currentUser.email}:${contactedUser.email}`

      setroomHash(emailHash);
      /* if (selectedImage && selectedImage.uri) {
         await sendImage(selectedImage.uri, emailHash);
       }*/
    })()
  }, [])

  useEffect(() => { //this use effect run once on the start of the chat and loads the previeous messages 
    (async () => {
      if (!loaded) {



        try {
          const roomID = roomId
          const dataob = { roomID: roomID }
          const data = JSON.stringify(dataob);

          const response = await ServerApi.post('/getMessages', data, {
            headers: {

              'Content-Type': 'application/json',

            },
          })

          //      console.log(JSON.parse(response.data.messages))
          appendMessages(response.data.messages)
          setloaded(true)

        }
        catch (err) {
          console.log('error fetching last message ')
          console.log(err)
        }
      }
    })()

  }, [loaded])


  async function getNewMessage() {

    try {
      const roomID = roomId
      const dataob = { roomID: roomID }
      const data = JSON.stringify(dataob);

      const response = await ServerApi.post('/getNewMessage', data, {
        headers: {

          'Content-Type': 'application/json',

        },
      })

      //    console.log('inside get new message ');
      //  console.log(response.data.messages)
      const newMessage = []
      newMessage.push(response.data.messages)
      appendMessages(newMessage)


      return response.data.messages
    }
    catch (err) {
      console.log('error fetching last message ')
      console.log(err)
    }

  }

  /*
  useEffect(()=>{ //this use effect runs only when new message gets added it can be disposed when we implement subscription and ioSocket 
    (async ()=>{

      try{
        const roomID =roomId
        const dataob ={roomID:roomID}
        const data = JSON.stringify(dataob);
      
        const response = await ServerApi.post('/getNewMessage',data,{headers: {

          'Content-Type': 'application/json',

        },})

      console.log(response.data.messages)
//      appendMessages(response.data.messages)
      setMessages((previousMessaged)=>[...previousMessaged,response.data.messages])

      }
      catch(err){
        console.log('error fetching last message ')
        console.log(err)
      }

    })()

  },[counter])*/



  const appendMessages = useCallback((messages) => { // help function to append messages
    setMessages((previousMessaged) => GiftedChat.append(previousMessaged, messages))
  }, [messages])
/*
  async function onSend(messages = []) {

    try {

      console.log(messages)
      const roomID = roomId
      const messageob = JSON.stringify(messages)
      const dataob = { roomID: roomID, messageob }
      const data = JSON.stringify(dataob);

      const response = await ServerApi.post('/messageOnSend', data, {
        headers: {

          'Content-Type': 'application/json',

        },
      })


      console.log(response.data)
      //setCounter(counter+1);
      getNewMessage()
    } catch (err) {
      console.log('error on send message ')
      console.log(err)
    }

  }
*/

  // older implementation using firebase directly
  async function onSend(messages=[]){
    console.log('printing messages onSend function')
    console.log(messages)
      const writes  = messages.map(m=>addDoc(roomMessagesRef,m)) //adding the new message to the firestore
      const lastMessage= messages[messages.length -1]
      writes.push(updateDoc(roomRef,{lastMessage}))//updating the last message for the look of chats screen
      await Promise.all(writes)
  }


  //older implementation of the use hook to render the new messages recieved from the firebase room //

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


  




  //send image to chat //older implementation // currently doesn't work needs to be fixed after adding the graphql implementation 
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





  async function handlePhotoPicker() {//just help function uses expo client to pick image from gallery
    const result = await pickImageChat();
    if (!result.cancelled) {
      await sendImage(result.uri);
    }
  }


  return (
    <ImageBackground style={{ flex: 1 }} resizeMode="cover" source={require('../../assets/chatbg.png')}>
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
                backgroundColor: text ? colors.foreground : colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
              disabled={!text}
              onPress={() => {
                if (text && onSend) {
                  onSend(
                    {// represent of the message object 
                      text: text.trim(),
                      user,
                      _id: messageIdGenerator(),
                      createdAt: new Date(),
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


const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'column',
    justifyContent: "flex-start",
    backgroundColor: '#fff',
    height: '100%',
  },
  TopView: {
    backgroundColor: 'rgb(61, 178, 255)',
    marginTop: 25,
    width: '100%',
    height: 70,
    justifyContent: 'flex-start',
    flexDirection: 'row',


  },
  CenterView: {
    width: '100%',
    flexGrow: 1,

    backgroundColor: 'green',
    height: '88%',
    justifyContent: 'flex-end',
    flexDirection: 'column',

  },

  BottomView: {
    width: '100%',

    height: 40,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: 25,


  }
  ,
  TextInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgb(185, 255, 248)',
    height: 40,
    color: 'black',
    fontSize: 20,
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingLeft: 15,
    marginTop: 5,
    marginLeft: 10,
    multiline: false,


  },
  roundButton: {
    width: 45,
    height: 45,
    marginLeft: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'rgb(0, 103, 120)',

  },
  ChatView: {
    backgroundColor: 'red',
    width: '100%',
    height: '80%',

    backgroundColor: 'rgb(0, 103, 120)',

  },
})

export default ChatScreen; 