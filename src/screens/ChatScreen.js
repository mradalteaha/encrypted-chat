//@refresh reset
import React, { useCallback, useContext, useEffect, useState } from "react";
import "react-native-get-random-values"; // to generate random ids 
import { Image, TouchableOpacity, View, StyleSheet, ImageBackground,Text ,Modal} from 'react-native';
import {WebView} from 'react-native-webview'
import GlobalContext from '../../Context/Context';//global variables to access via provider
import { auth, db,GenAESKey } from "../firebase"; // firebase instance 
import { useRoute } from "@react-navigation/native";
import { collection, onSnapshot, doc, addDoc, updateDoc, getDoc ,setDoc,deleteDoc} from 'firebase/firestore';
import { GiftedChat, Actions, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { Ionicons, Fontisto ,EvilIcons,AntDesign ,Entypo,FontAwesome5} from "@expo/vector-icons";
import { uploadImage, pickImageChat ,readUserData,saveUserData,askForPermission,pickVideoChat,uploadFile,pickFileChat} from '../../utils'
import ImageView from "react-native-image-viewing";
import {nanoid} from "nanoid"
import CryptoJS from "react-native-crypto-js";
import AsyncStorageStatic from '@react-native-async-storage/async-storage'
import {EncryptAESkey,DecryptAESkey,uploadImagetwo ,uploadVideotwo} from '../../utils.js'
import { v4 as uuid } from 'uuid';
import { usePreventScreenCapture } from 'expo-screen-capture';
import {Video,Audio} from 'expo-av';
import PDFView from 'react-native-view-pdf';


function ChatScreen(props) {
  usePreventScreenCapture();
  const {currentUser} = auth;
  const [roomHash, setroomHash] = useState('');//for generating path in the database 
  const [messages, setMessages] = useState([]);//to be able to access the data and manipulate the messages
  //these two states are related to view images 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFileVisible, setModalFileVisible] = useState(false);


  const [myrandID,setMyrandID]=useState(uuid())
  const [selectedImageView, setSeletedImageView] = useState("");
  const [selectedVideoView, setSelectedVideoView] = useState("");
  const [selectedFileView, setSelectedFileView] = useState("");


  const { theme: { colors } } = useContext(GlobalContext)
  const [permissionStatus, permissionStatusUpdate] = useState(null);
  const [pickSendType,setPickSendType] =useState('none')
  const [selectedItem,setSelectedItem] = useState({message:null ,file:null})


  const route = useRoute();
  const room = route.params.room  ;
  
  const selectedImage = route.params.image;
  const contactedUser = route.params.user;
  const contactedUserUid=contactedUser.uid


  const unreadMessages=new Map()
  unreadMessages.set(contactedUser.uid,0)
  unreadMessages.set(currentUser.uid,0)
  
  const currentUserUid=currentUser.uid
  const localbackGround = room ? room.backGround: require('../../assets/chatbg.png')

//console.log('chat screen is rendering ')
    useEffect(() => {
      (async () => {
          const status = await askForPermission();
          permissionStatusUpdate(status)
      })()
    }, [])

  const senderUser = currentUser.photoURL //asssigning the current user to the sender user
    ? {
      name: currentUser.displayName,
      _id: currentUser.uid,
      photoURL: currentUser.photoURL,
    }
    : { name: currentUser.displayName, _id: currentUser.uid   };

  const roomId = room ? room.id : myrandID; //if there are no existing room generate a new room id

 /*  console.log('printing the room id ')
  console.log(roomId) */

  const roomRef = doc(db, "rooms", roomId); //document of the room based on it's id
  const roomMessagesRef = collection(db, "rooms", roomId, "messages");//refrecnce for the messegaes on particular room

  const [AesKey,setAesKey] = useState(null)
  const [Loading,setLoading] = useState(true)


  useEffect(() => { //initialize room if there are no existing one within the rooms array.

    (async () => {
      if (!room) { //if the room doesn't exist we initialize it with the neceserly params
       
        const currentUserData = {
          displayName: currentUser.displayName,
          email: currentUser.email
        }
        if (currentUser.photoURL) {
          currentUserData.photoURL = currentUser.photoURL
        }
        const contactedUserData = {
          displayName: contactedUser.displayName ,
          email: contactedUser.email,

        }
        if (contactedUser.photoURL) {
          contactedUserData.photoURL = contactedUser.photoURL
        }
        
        const roomData = {
          participants: [currentUserData, contactedUserData],
          participantsArray: [currentUserData.email, contactedUserData.email],
          unreadMessages:Object.fromEntries(unreadMessages) ,
          roomId:roomId,
          backGround:null
        }
        try {
            //initializing the room

            GenAESKey().then(async (result) =>{

              //encrypt the ke
              console.log('generating the AES key passed key :')
            /*   console.log(contactedUser)
              console.log(result.data.AES) */
               const encKey = await EncryptAESkey(contactedUser.RSApublicKey,result.data.AES) //encrypting the aes key before saving it in the database
               console.log('encrypting  the AES key passed key :')
               /* console.log(encKey) */
               const LoadLocalStorage = await readUserData(currentUser.uid) // getting the current saved data .
               if(LoadLocalStorage){
               let userLocal = JSON.parse(LoadLocalStorage)
               let userLocalrooms = userLocal.rooms
               let RsaKeys =userLocal.RsaKeys
               
               userLocalrooms[roomId] = result.data.AES
               let finalizeLocalData = {RsaKeys:RsaKeys  , rooms:userLocalrooms}
               console.log('generated keys')
               const saveLocalData = await saveUserData(currentUser.uid, JSON.stringify(finalizeLocalData) )

              setDoc(roomRef, {...roomData,AESkey:encKey}).then(() => {


                readUserData(currentUser.uid).then(res =>{
                  let userLocal = JSON.parse(res)
                  console.log('printing the user local data')
                  //console.log(userLocal)
                  console.log('AESkey for the current room')
                  console.log(userLocal.rooms[roomId])
                  const localkey= userLocal.rooms[roomId]
                  setAesKey((prev)=> localkey)
                    setLoading(false)
                    return
                
              }).catch(err=>console.log(err))}).catch(err=>{console.log(err)})
 
            }
        }).catch(err=>{
          console.log(err)
        }) 

      }
      catch(err){
        console.log('error on initializing the room')
        console.log(err)
      }
    }
      else{ //if the room exist we import it's key since it 
        if(!AesKey){ //if the aes key is not setup this statement to prevent multiple access to the local storage and server storage

          const data = await readUserData(currentUser.uid)
          if(data){
            
            let parsedData = JSON.parse(data)
            if(parsedData.rooms[roomId]){
              const localkey= parsedData.rooms[roomId]
              setAesKey((prev)=> localkey) //set the room key from the local storage 
              setLoading(false)


            }else{//this room doesn't exist on the local storage 
              getDoc(roomRef).then(async (res) => {//query to get the key from the room data
                if (!res.exists) {
                  console.log("No such document!"); //Error
                } else {
                  
                    const encryptedkey = res.data().AESkey
                    const decryptedkey = await DecryptAESkey(parsedData.RsaKeys.privateKey,encryptedkey)
                      let userLocal = JSON.parse(data)
                      console.log(data)
                    let userLocalrooms = userLocal.rooms
                    let RsaKeys =userLocal.RsaKeys
                  userLocalrooms[roomId] = decryptedkey
                  let finalizeLocalData = {RsaKeys:RsaKeys  , rooms:userLocalrooms}
                  console.log('saving the new room into the local storage ')
                  saveUserData(currentUser.uid,JSON.stringify(finalizeLocalData) ).then(()=>{
                    setAesKey((prev)=> decryptedkey)
                    setLoading(false)
                  })

                }
      
              }).catch(err=>console.log(err))
            }
          }


        }

        
      }
      const emailHash = `${currentUser.email}:${contactedUser.email}`

      setroomHash(emailHash);
       if (selectedImage && selectedImage.uri) {
         await sendImage(selectedImage, emailHash);
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

//encrypt the message
  useEffect(()=>{
    const updateUnreadMessages = async () => {
    
    try{
      const currentdocData = await getDoc(roomRef)
      let {unreadMessages} =  currentdocData.data()
      unreadMessages[currentUser.uid]=0;
      updateDoc(roomRef, { unreadMessages })
  
    }
    catch(e){
      console.log(e)
    }

    };

    updateUnreadMessages();
    
    
   
  },[])

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
        const currentdocData = await getDoc(roomRef)
        let {unreadMessages} =  currentdocData.data()
        unreadMessages[contactedUser.uid]=unreadMessages[contactedUser.uid] +1
        
        writes.push(updateDoc(roomRef,{lastMessage ,unreadMessages}))//updating the last message for the look of chats screen
        await Promise.all(writes)
     
      }catch(err){
        console.log("error occured at onSend function at chatsScree")
        console.error(err)
      }

     
  }

  



  //need to be fixed to the new  
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



  async function sendFile(file, roomPath) {
    try{
      uploadFile(
      file,
      `Files/rooms/${roomPath || roomHash}`
    ).then(async (myob)=>{
      console.log('printing the file')
      console.log(file)

      const { url, fileName } = myob;
      console.log('file saved at:')
      console.log(url)
      
      const message = {
        _id: fileName,
        text: "",
        createdAt: new Date(),
        user: senderUser,
        fileType:file.mimeType,
        fileId:file.name,
        file:url
        
      };
      const lastMessage = { ...message, text: "file attatched" };
      await Promise.all([
        setDoc(doc(roomMessagesRef,message._id),message),
        updateDoc(roomRef, { lastMessage }),
      ]);     
   

    })
    

     
 
  }catch(error){
    console.log(error)
  }
  }


  function pickSendTypeFunction(){//this functoin
    console.log('paperclip clicked')
    setPickSendType(pre => pre=='none'?'flex':'none')
  }

//handle photo picker the pickphotoChat function  in utils.js
  async function handlePhotoPicker() {//just help function uses expo client to pick image from gallery
    const result = await pickImageChat();
    if (result.assets[0]) {
      await sendImage(result.assets[0],roomId);
    }
  }

  //handle video picker the pickVideoChat function in utils.js
  async function handleVideoPicker(){
    const result = await pickVideoChat();
    if (result.assets[0]) {
      await sendVideo(result.assets[0],roomId);
    }
  }
    //handle file picker the pickfileChat function in utils.js

  async function handleFilePicker(){
   
    try{
      console.log("File Pressed");
      const result = await pickFileChat();
      if (result) {
        await sendFile(result,roomId);
      }
      
    }catch(err){
      console.log(err)
    }
  }

   function onLongpressHandler(context,messagee){
     setSelectedItem(pre =>{
            const {message,file} = pre 
            let ob = new Object({message:messagee,file:file})
            return ob
            }  )
  }
 
 async function deleteMessage(message){
    console.log('message to delete')
    console.log(message)
    deleteDoc(doc(roomMessagesRef,message._id)).then(()=>{
      setMessages((previousMessaged) => previousMessaged.filter(m => m._id !==message._id)) // deletes the message locally after removing it from the database
      setSelectedItem(pre =>{
        const {message,file} = pre 
        let ob = new Object({message:null,file:file})
        return ob
        }  )

      console.log('deleted successfully')
    })
   
  }


    if (!permissionStatus) {
      return <Text>Loading ...</Text>
  }
  if (permissionStatus !== 'granted') {
      return <Text> you need to grant permission </Text>
  }
const test = 'https://firebasestorage.googleapis.com/v0/b/secret-chat-dev.appspot.com/o/files%2Frooms%2Fca624b04-095a-488f-b539-a4e6cc1ea061%2FLrPYWrE6GDEzbN_z2Vn5r.pdf?alt=media&token=2ab80ff1-4404-45c5-9fe0-b1974f610724&_gl=1*1txnjy0*_ga*NzgxMDA4MjczLjE2NTE2NjYxMjY.*_ga_CW55HF8NVT*MTY4NjU4MDQzNS40Ny4wLjE2ODY1ODA0MzUuMC4wLjA.'
 const some='http://docs.google.com/gview?embedded=true&url='
 return (Loading ?<Text>loading ...</Text>:<ImageBackground style={{ flex: 1 }} resizeMode="cover" source={room?{uri: room.backGround} :require('../../assets/chatbg.png')}>
      <GiftedChat
        onSend={onSend}
        messages={messages} //the messages needs to be rendered
        user={senderUser}
        renderAvatar={null}

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
          setSelectedItem(pre =>{
            const {message,file} = pre 
            let ob = new Object({message:message,file:file})
            return ob
            }  )
           

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
          setSelectedItem(pre =>{
            const {message,file} = pre 
            let ob = new Object({message:message,file:null})
            return ob
            }  )
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableOpacity: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginLeft: 5,
  },
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


  },
  container2: {
    flex: 1,
    paddingTop: 15,
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

export default ChatScreen; 