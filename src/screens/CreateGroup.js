import React, { useContext, useState ,useEffect} from 'react';
import GlobalContext from '../../Context/Context';
import {  db,auth,GenAESKey } from '../firebase';
import { Image, Button, Text, View,LogBox, SafeAreaView, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity,TextInput ,Platform,FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { pickImage, askForPermission ,uploadImagetwo,theme,EncrypGroupKeys,readUserData,saveUserData} from '../../utils'
import ItemList from '../components/ItemList';
import Avatar from '../components/Avatar';
import {Grid,Row,Col} from 'react-native-easy-grid'
import {Circle} from 'react-native-progress'
import { v4 as uuid } from 'uuid';
import { collection, onSnapshot, doc, addDoc, updateDoc, getDoc ,setDoc} from 'firebase/firestore';






export default function CreateGroup(props){

    const {currentUser}=auth 

    const {theme:{colors},setCurrentUser,myContacts,setMyContacts,setLoadingContacts} = useContext(GlobalContext)
    
    

    const [selectImage, setSelectedImage] = useState(null);
    const [permissionStatus, permissionStatusUpdate] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [RSAkeys, setRSAkeys] = useState(null);
    const [groupID,setGroupID]=useState(uuid())
    const [groupName ,setGroupName]= useState('')  
    const [creating , setCreating]=useState(false) // indicator to set loading screen after clicking the button of create Group
    const [selectedAmmount , setSelectedAmmount]=useState(0)
    const [selectedItem, setSelectedItem] = useState(new Map());
    const currentUserData = Array.from(myContacts.values() ).filter((c)=> c.email ===currentUser.email )[0]

   

    


    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    }, [])

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality']);
    }, [])
   


    async function uploadImage(groupID){
        try{
            if (selectImage) {
                console.log('error on upload image')
                //console.log(selectImage)
                const { url } = await uploadImagetwo(selectImage, `Images/${groupID}`, "groupPictrure")
                console.log('photo uploaded')
                console.log(url)
            }


        }catch(err){
        console.log('error uploading')    
            console.log(err)
        }
     
    }

    async function submitCreateGroup(){//this function is responsible for creating the group

         try{

            const groupRef = doc(db, "groups", groupID)

            setCreating(true)
            //console.log(selectedItem) // for the selected participants 
            if (selectImage) {
                console.log('error on upload image')
                const { url } = await uploadImagetwo(selectImage, `Images/${groupID}`, "groupPictrure") //for uploading the group image
                groupName // contain the group name 
                groupID //the group ID 
                
                const participantsArray=[] //for the users email and extracting the relevant rooms later on GroupChatsScreen
                const participantsUsers=[]
                selectedItem.forEach(item =>{
                    participantsUsers.push(item)
                    participantsArray.push(item.email)
                })
                GenAESKey().then(async (roomAESkey)=>{

                    console.log('generated AES key for the room ')
                    const data = {roomAESkey:roomAESkey.data.AES,participants:selectedItem}
                    EncrypGroupKeys(data).then(async (res)=>{
                        console.log('successfully encrypted the keys for the participants')
                        const Aeskeys=res;
                        const LoadLocalStorage = await readUserData(currentUser.uid) // getting the current saved data .
                        let userLocal = JSON.parse(LoadLocalStorage)
                        let userLocalrooms = userLocal.rooms
                        let RsaKeys =userLocal.RsaKeys
                        userLocalrooms[groupID] = roomAESkey.data.AES
                        let finalizeLocalData = {RsaKeys:RsaKeys , rooms:userLocalrooms}
                        const saveLocalData = await saveUserData(currentUser.uid, JSON.stringify(finalizeLocalData) )
                        const groupChatData={
                            groupImage:url,
                            groupName:groupName,
                            groupID:groupID,
                            Aeskeys:Aeskeys,
                            participantsUsers:participantsUsers,
                            participantsArray:participantsArray,

                        }
                        setDoc(groupRef,groupChatData).then(res=>{

                            props.navigation.navigate('HomeScreen')

                        })


                    })
                   

                })

                //now we 


              
            }

            




         }catch(error){
            console.log('an error occured in submitCreateGroup')
            console.log(error)
         }   
   


    }


    async function handleProfileImage() {
        
        const result = await pickImage()
        if (result.assets[0]) {
            console.log('image has been successfully uploaded on handle profile picture')
            setSelectedImage(result.assets[0])
        }
    }
    if (!permissionStatus) {
        return <Text>Loading ...</Text>
    }
    if (permissionStatus !== 'granted') {
        return <Text> you need to grant permission </Text>
    }

    function goBack(){
        
            console.log('navigating to back')
            props.navigation.navigate('HomeScreen')
    
        
    }



    
    function ContactPreview({ user}) {//this is a JSX element to render the contacts list elements
        const {theme:{colors} } = useContext(GlobalContext);
        const [selected,setSelected] = useState(false)


        function handleClick(){
            setSelectedItem(selectedItem.set(currentUserData.uid,currentUserData))
            if(!selected){
                setSelectedItem(selectedItem.set(user.uid,user))
                setSelected(pre => !pre)
                }
                else{
                    setSelectedItem(currentState => selectedItem.set(user.uid,null))
                    setSelected(pre => !pre)
    
                } 

           
            
        }

        return (
            <TouchableOpacity style={{height:80,borderRadius:30 ,backgroundColor:selected ? colors.skyblue:"white", marginTop:7}} onPress={()=>handleClick() }>
                <Grid style={{maxHeight:80}} >
                    <Col style={{width:80,alignItems:'center',justifyContent:'center'}}>
                    <Avatar user={user} size={60 }/>
                    </Col>
                    <Col style={{marginLeft:10}}>
                    <Row style={{alignItems:'center'}}>
                        <Col>
                            <Text style={{fontWeight:'bold',fontSize:16,color:colors.text}}>
                            {user.displayName}
                            </Text>
                        </Col>
        
                    </Row>
                    </Col>
                </Grid>  
            </TouchableOpacity>
            )


    }

    


    if (!myContacts || creating) {
        return (<View style={{flex:1 , alignContent:'center' ,alignSelf:'center'}}>
                <Text style={{fontSize:25 ,textAlign:'center',marginTop:30,color:colors.foreground}}> {!myContacts?"Loading Contacts" : "Creating group be patient"}</Text>
                <Circle size={100} borderWidth={10}  style={{alignSelf:"center",flex:1,borderRadius:20,marginTop:15 ,padding:20}}  indeterminate={true}/>

        </View>
        )}else{
            return( <ScrollView nestedScrollEnabled={true} style={{flex:1,flexDirection:'column'}}>
            <View style={{flex:0.5,flexDirection:'column' ,height:300 ,alignContent:'flex-start'}}>
            <View style={{flex:0.5 ,flexDirection:'row',height:400}}>
            <TouchableOpacity onPress={handleProfileImage} style={{ marginTop: 25,marginLeft:15, borderRadius: 120, width: 120, height: 120, backgroundColor: colors.foreground, alignItems: 'center', justifyContent: 'center'  ,alignSelf:'flex-start' }}>
                    {!selectImage ? (<MaterialCommunityIcons name='camera-plus' color={colors.iconGray} size={45} />) :
                        <Image source={{ uri: selectImage.uri }} style={{ width: '100%', height: '100%', borderRadius: 120 }} />}
                </TouchableOpacity> 
                <KeyboardAvoidingView style={{alignSelf:'flex-start',marginTop:60,borderBottomColor:'rgba(0,0,0,0.5)',marginLeft:20,width:170}} >
                <TextInput value={groupName} onChangeText={setGroupName}  placeholderTextColor ={'rgba(0,0,0,0.5)'} placeholder={'Enter Group Name'} />
                </KeyboardAvoidingView>
        
                </View>
        
                <View style={{ flex:0.25,marginTop:0,alignSelf:'flex-end',flexDirection:'row' ,height:0 ,alignContent:'center',alignItems:'flex-start',height:200,}}>
                <Button title={'Cancel'} onPress={goBack}/>
               <Button  title={'Create Group'} onPress={submitCreateGroup}/>
                
               </View>
               <View style={{ flex:0.25,marginTop:0,alignSelf:'center',flexDirection:'row' ,height:0 ,alignContent:'center',alignItems:'flex-start',height:200,}}>
               <Text style={{fontSize:25 ,marginTop:15}}>Select participants</Text>
               </View>
               
              
            </View>
           
               <View style={{flex:1}}>
               

               {myContacts ?    
                        <FlatList nestedScrollEnabled={true} style={{ flex: 1, padding: 10 ,height:450}} data={Array.from(myContacts.values() ).filter((c)=> c.email!=currentUser.email )} keyExtractor={(item, i) => item.email}
                            extraData={Array.from(selectedItem.values())}
                            renderItem={({ item }) => <ContactPreview user={item}  />}
                        /> : null}
                       

        
               </View>
          
                
          
                
        
            </ScrollView>)
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