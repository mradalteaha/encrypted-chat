//@refresh reset
import React, { useCallback, useContext, useEffect, useState } from "react";
import "react-native-get-random-values"; // to generate random ids 
import { Image, TouchableOpacity, View, StyleSheet, ImageBackground,Text ,Modal} from 'react-native';
import GlobalContext from '../../Context/Context';//global variables to access via provider
import { auth, db,GenAESKey } from "../firebase"; // firebase instance 
import { useRoute } from "@react-navigation/native";
import { collection, onSnapshot, doc, addDoc, updateDoc, getDoc ,setDoc,deleteDoc} from 'firebase/firestore';
import { GiftedChat, Actions, Bubble, InputToolbar  ,GiftedAvatar} from 'react-native-gifted-chat'
import { Ionicons, Fontisto ,EvilIcons,AntDesign ,Entypo,FontAwesome5} from "@expo/vector-icons";
import { uploadImage, pickImageChat ,readUserData,saveUserData,askForPermission,pickVideoChat,uploadFile,pickFileChat} from '../../utils'
import ImageView from "react-native-image-viewing";
import {nanoid} from "nanoid"
import CryptoJS from "react-native-crypto-js";
import AsyncStorageStatic from '@react-native-async-storage/async-storage'
import {EncryptAESkey,DecryptAESkey,uploadImagetwo,uploadVideotwo} from '../../utils.js'
import { v4 as uuid } from 'uuid';
import * as ScreenCapture from 'expo-screen-capture';
import {Video,Audio} from 'expo-av';
import {WebView} from 'react-native-webview'






//import { v4 as uuid } from 'uuid'; //deprecated causing errors with expo SDK 48 ...

function GroupChat(props) {
  ScreenCapture.usePreventScreenCapture()
    const {currentUser} = auth;
  const [roomHash, setroomHash] = useState('');//for generating path in the database 
  const [messages, setMessages] = useState([]);//to be able to access the data and manipulate the messages
  //these two states are related to view images 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSeletedImageView] = useState("");
  const { theme: { colors } , myContacts } = useContext(GlobalContext)
  const [permissionStatus, permissionStatusUpdate] = useState(null);
  const [AesKey,setAesKey] = useState(null)
  const [Loading,setLoading] = useState(true)
  const [pickSendType,setPickSendType] =useState('none')
  const [selectedVideoView, setSelectedVideoView] = useState("");
  const [selectedFileView, setSelectedFileView] = useState("");
  const [selectedItem,setSelectedItem] = useState({message:null ,file:null})
  const [modalFileVisible, setModalFileVisible] = useState(false);





  const route = useRoute();
  const room = route.params.room  ;
  const selectedImage = route.params.image;

  const {groupImage,groupName,groupID,Aeskeys,participantsUsers,participantsArray,backGround} =room //destructuring the room
  //this section is for screenshot prevention 

  useEffect(() => {
    if (permissionStatus) {
      console.log('removing the screenshot')
      const subscription = ScreenCapture.addScreenshotListener(() => {
        alert('hehe no screenshot 😊');
      });
      return () => subscription.remove();
    }
  }, []);

  const activate = async () => {
    await ScreenCapture.preventScreenCaptureAsync();
  };


//console.log('chat screen is rendering ')
    useEffect(() => {
      (async () => {
          const status = await askForPermission();
          permissionStatusUpdate(status)
          await activate()
      })()
    }, [])

  

  const senderUser = participantsUsers.filter(e => e.email ===currentUser.email)[0]


  const roomRef = doc(db, "groups", groupID); //document of the room based on it's id
  const roomMessagesRef = collection(db, "groups", groupID, "messages");//refrecnce for the messegaes on particular room



  useEffect(() => { //initialize room if there are no existing one within the rooms array.

    (async () => {
        if(!AesKey){ //if the aes key is not setup this statement to prevent multiple access to the local storage and server storage
          try{

            console.log('no AES KEY')
            const data = await readUserData(currentUser.uid)
           /*  console.log(data) */
            if(data){
              /* console.log('data')
              console.log(data) */
              
              let parsedData = JSON.parse(data)
             /*  console.log('parsedData')
              console.log(parsedData) */
              if(parsedData.rooms[groupID]){
                console.log('the room key already saved in here')
                const localkey= parsedData.rooms[groupID]
                setAesKey((prev)=> localkey) //set the room key from the local storage 
                setLoading(false)
  
  
              }else{//this room doesn't exist on the local storage 
                let userLocal = JSON.parse(data)
                const encryptedkey = Aeskeys[currentUser.email]
                const decryptedkey = await DecryptAESkey(userLocal.RsaKeys.privateKey,encryptedkey)
                //console.log(userLocal)
              let RsaKeys =userLocal.RsaKeys
              let userLocalrooms = userLocal.rooms
              userLocalrooms[groupID] = decryptedkey
              /* console.log('rsa keys on else this room doesnt exist on the local storage ')
              console.log(RsaKeys)
              console.log('type of rsa keyss')
              console.log(typeof(RsaKeys)) */
              let finalizeLocalData = {RsaKeys:RsaKeys , rooms:userLocalrooms}
       /*        console.log('type of finalized data')
              console.log(typeof(finalizeLocalData))
              console.log('saving the new room into the local storage ') */
              saveUserData(currentUser.uid,JSON.stringify(finalizeLocalData) ).then(()=>{
                setAesKey((prev)=> decryptedkey)
                setLoading(false)
              })
  
               
              }
            }else{
              console.log('data isnt here')
            }

          }catch(error){
            console.log('error setting up the key')
            console.log(error)
          }
      


        }
      
      const emailHash = groupID

      setroomHash(emailHash);
       if (selectedImage && selectedImage.uri) {
         await sendImage(selectedImage.uri, emailHash);
       }
    })()
  }, [])




  //older implementation of the use hook to render the new messages recieved from the firebase room //

  useEffect(()=>{ //query over the messages in the room at start and append new messages

    if(AesKey!=null){    
        const unsubscribe = onSnapshot(roomMessagesRef,querysnapshot=>{
        
        const messagesFirestore = querysnapshot.docChanges().filter(({type})=>type ==='added').map(
            ({doc})=>{
                
                const message = doc.data()

              /*  console.log("printing key useeffect decrypt")  //printing the room AES key
                console.log(AesKey) */

                let decryptedText = CryptoJS.AES.decrypt(message.text, AesKey).toString(CryptoJS.enc.Utf8);
                return {...message,createdAt : message.createdAt.toDate() ,text:decryptedText}
            }).sort((a,b)=> b.createdAt.getTime() - a.createdAt.getTime())
            appendMessages(messagesFirestore) 
    });
    return ()=>unsubscribe();
      }

  },[AesKey])


  const appendMessages = useCallback((messages) => { // help function to append messages
    
//console.log('messages from firestore')
   // console.log(messages)
   // console.log('messages ammount ')
    //console.log(messages.length)
    setMessages((previousMessaged) => GiftedChat.append(previousMessaged, messages))
  }, [messages])

  
  // older implementation using firebase directly
  async function onSend(messages=[]){
    
      try{
        
        const writes  = messages.map(async(m)=>{
          console.log("printing key onSend")
          

          const encryptedText = CryptoJS.AES.encrypt(m.text, AesKey).toString();

          const encryptedMessage = {
            ...m,
            text: encryptedText
          };
          
          
          setDoc(doc(roomMessagesRef,encryptedMessage._id),encryptedMessage)
        
        }) //adding the new message to the firestore
        const lastMessage= messages[messages.length -1]
        writes.push(updateDoc(roomRef,{lastMessage}))//updating the last message for the look of chats screen
        await Promise.all(writes)
     
      }catch(err){
        console.log("error occured at onSend function at chatsScree")
        console.error(err)
      }

     
  }

  



  //send image to chat //older implementation // currently doesn't work needs to be fixed after adding the graphql implementation 
 async function sendImage(uri, roomPath) {
    const { url, fileName } = await uploadImagetwo(
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
      setDoc(doc(roomMessagesRef,message._id),message),
      updateDoc(roomRef, { lastMessage }),
    ]);
  }
  //send video
  async function sendVideo(uri, roomPath) {
    try{
    uploadVideotwo(
      uri,
      `videos/rooms/${roomPath || roomHash}`
    ).then(async (myob)=>{

      const { url, fileName } = myob;
      console.log('video saved at:')
      console.log(url)
      const message = {
        _id: fileName,
        text: "",
        createdAt: new Date(),
        user: senderUser,
        video: url,
      };
      const lastMessage = { ...message, text: "Video" };
      await Promise.all([
        setDoc(doc(roomMessagesRef,message._id),message),
        updateDoc(roomRef, { lastMessage }),
      ]);     
   

    })
    }catch(error){
      console.log(error)
    }
  }
//send file
  async function sendFile(file, roomPath) {
    const { url, fileName  } = await uploadFile(
      file,
      `files/rooms/${roomPath || roomHash}`
    );
    const message = {
      _id: fileName,
      text: "",
      createdAt: new Date(),
      user: senderUser,
      fileType:file.mimeType,
      fileId:file.name,
      file:url
      
    };
    const lastMessage = { ...message, text: "File" };
    await Promise.all([
      setDoc(doc(roomMessagesRef,message._id),message),
      updateDoc(roomRef, { lastMessage }),
    ]);
  }
  function onLongpressHandler(context,message){
    setSelectedItem(pre => {return { ...pre,message:message }}  )
  }

 async function deleteMessage(message){
    console.log('message to delete')
    console.log(message)
    deleteDoc(doc(roomMessagesRef,message._id)).then(()=>{
      setMessages((previousMessaged) => previousMessaged.filter(m => m._id !==message._id)) // deletes the message locally after removing it from the database
      setSelectedItem(pre =>{return {message:null , file:pre.file}}  )
      console.log('deleted successfully')
    })
   
  }

  function handleAvatar(props){
    console.log('handle avatar')
    console.log(props)
  } 

  function pickSendTypeFunction(){//this functoin
    console.log('paperclip clicked')
    setPickSendType(pre => pre=='none'?'flex':'none')
  }

  async function handlePhotoPicker() {//just help function uses expo client to pick image from gallery
    const result = await pickImageChat();
    if (result.assets[0]) {
      await sendImage(result.assets[0],groupID);
    }
  }
  async function handleVideoPicker(){
    const result = await pickVideoChat();
    if (result.assets[0]) {
      await sendVideo(result.assets[0],groupID);
    }
  }
    //handle file picker the pickfileChat function in utils.js

  async function handleFilePicker(){
   
    try{
      console.log("File Pressed");
      const result = await pickFileChat();
      if (result) {
        await sendFile(result,groupID);
      }
      
    }catch(err){
      console.log(err)
    }
  }

    if (!permissionStatus) {
      return <Text>Loading ...</Text>
  }
  if (permissionStatus !== 'granted') {
      return <Text> you need to grant permission </Text>
  }

  return (Loading ?<Text>loading ...</Text>:<ImageBackground  style={{ flex: 1 }} resizeMode="cover" source={backGround?{uri: room.backGround} :require('../../assets/chatbg.png')}>
      <GiftedChat
        
        onSend={onSend}
        messages={messages} //the messages needs to be rendered
        user={{_id:senderUser.uid ,avatar:senderUser.photoURL ,name:senderUser.displayName ,email:senderUser.email}}
        renderAvatar={(props)=>(
          <GiftedAvatar {...props}  user={{_id: myContacts.get(props.currentMessage.user.email).uid,avatar: myContacts.get(props.currentMessage.user.email).photoURL ,name:myContacts.get(props.currentMessage.user.email).displayName }}/>
        )}

        renderUsernameOnMessage={true}
        renderActions={(props) => (
          <Actions
            {...props}
            containerStyle={{
              position: "absolute",
              right: 50,
              bottom: 5,
              zIndex: 9999,
            }}
            onPressActionButton={pickSendTypeFunction}
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
        extraData={selectedItem}
        shouldUpdateMessage={(props, nextProps) =>props.extraData !== nextProps.extraData}
        isCustomViewBottom={true}

        renderBubble={(props) => (
          <Bubble {...props}
          onPress={()=>{setSelectedItem({message:null ,file:null})}}
            onLongPress={(context , message)=> onLongpressHandler(context,message)}
            textStyle={{ right: { color: colors.text } }} //right for sender side and left for the reciever
            wrapperStyle={{

            
              left: {
                backgroundColor: selectedItem.message === props.currentMessage ? 'red': colors.white,
              },
              right: {
                backgroundColor: selectedItem.message === props.currentMessage ? 'red': colors.tertiary,
              },
            }}
          />
        )}
        renderMessageVideo={(props) => {
          return (
            <View style={{ borderRadius: 15, padding: 2 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setSelectedVideoView(props.currentMessage.video);
                }}
              >
                <Video
                resizeMode="contain"
                useNativeControls
                shouldPlay={false}
                source={{ uri: props.currentMessage.video}}
                style={{
                    width: 200,
                    height: 200,
                    padding: 6,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
              />
                
              </TouchableOpacity>
            </View>
          );
        }}

   

        renderCustomView={(props)=>{

        if(selectedItem.message === props.currentMessage){
          return(<EvilIcons name="trash" size={35} onPress={()=>deleteMessage(props.currentMessage)}/>)
        }
        else if(props.currentMessage.fileType === 'application/pdf'){
          return (
          <View   style={{
                  width: 200,
                  height: 200,
                  padding: 6,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}>
            <TouchableOpacity
            
              onPress={() =>{
               setSelectedFileView(props.currentMessage.file);
               setSelectedItem(pre =>{return {message:pre.message , file:props.currentMessage.file}}  )
                

              }
              }
            >
            {selectedFileView && props.currentMessage.file === selectedFileView  ? (
              <Modal isVisible={modalFileVisible} style={styles.modal} 
                onRequestClose={() => {
                  setModalFileVisible(false)
                  }}
              >
              <TouchableOpacity

              onPress={() =>{
               setSelectedItem(pre =>{return {message:pre.message , file:null}})
                setSelectedFileView(null)
              }
              }
              style={{width:50,height:50,backgroundColor:'red',alignSelf:'flex-start' , marginTop:50}}
            ></TouchableOpacity>
              <WebView
              style={styles.container}
              source={{ uri:  props.currentMessage.file }}
            />
            </Modal>) 
            : <ImageBackground
                style={{width: 200,
                  height: 180,
                  padding: 6,
                  borderRadius: 15,
                  resizeMode: "cover",}}
                imageStyle={{ backgroundColor: 'rgba(255,0,0,.6)' ,borderRadius:30 ,paddingBottom:15 }}
                source={require('../../assets/pdfimage.png')}
              >
                
              </ImageBackground>}
              
            </TouchableOpacity>
            <Text>{props.currentMessage.fileId}</Text>
          </View>
        ); 
        }
        return 

        }}
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
      
      <View style={{backgroundColor:'white',flexDirection:'row' , flex:0.25  ,display:pickSendType ,justifyContent:'space-evenly' ,alignItems:'center', borderRadius:30,
      wrap:'nowrap'}} >
        <AntDesign onPress={()=>handlePhotoPicker()} name='picture' size={45} />
        <Entypo onPress={()=>handleVideoPicker()} name='video' size={45} />
        <FontAwesome5 onPress={()=>handleFilePicker()} name='file' size={45} />
      </View>
      

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
export default GroupChat;
