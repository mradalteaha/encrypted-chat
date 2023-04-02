import React, { useContext, useState ,useEffect} from 'react';
import GlobalContext from '../../Context/Context';
import { auth } from '../firebase';
import { Image, Button, Text, View, SafeAreaView, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity,TextInput ,Platform,FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { pickImage, askForPermission ,uploadImagetwo,theme} from '../../utils'
import ItemList from '../components/ItemList';
import { VirtualizedList } from 'react-native-web';




export default function CreateGroup(props){

    const {currentUser}=auth 

    const {theme:{colors},setCurrentUser,myContacts,setMyContacts,setLoadingContacts} = useContext(GlobalContext)
    


    const [selectImage, setSelectedImage] = useState(null);
    const [permissionStatus, permissionStatusUpdate] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [RSAkeys, setRSAkeys] = useState(null);
    const [groupName ,setGroupName]= useState('')

    
    const [imageUploadProgress, setImageUploadProgress]=useState(0)

    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    }, [])


   


    async function uploadImage(){
        try{
            if (selectImage) {
                console.log('error on upload image')
                //console.log(selectImage)
                const { url } = await uploadImagetwo(selectImage, `Images/${currentUser.uid}`, "profilePicture")
                console.log('photo uploaded')
                console.log(url)
            }


        }catch(err){
        console.log('error uploading')    
            console.log(err)
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


    if (!myContacts) {
        return (<SafeAreaView style={styles.container}>
            <Text>Loading contacts...</Text>
        </SafeAreaView>
        )}else{
            return( <View style={{flex:1,flexDirection:'column'}}>
            <View style={{flex:0.5,backgroundColor:'red',flexDirection:'column' ,height:300 ,alignContent:'flex-start'}}>
            <View style={{backgroundColor:"blue" ,flex:0.5 ,flexDirection:'row',height:400}}>
            <TouchableOpacity onPress={handleProfileImage} style={{ marginTop: 25,marginLeft:15, borderRadius: 120, width: 120, height: 120, backgroundColor: colors.foreground, alignItems: 'center', justifyContent: 'center'  ,alignSelf:'flex-start' }}>
                    {!selectImage ? (<MaterialCommunityIcons name='camera-plus' color={colors.iconGray} size={45} />) :
                        <Image source={{ uri: selectImage.uri }} style={{ width: '100%', height: '100%', borderRadius: 120 }} />}
                </TouchableOpacity> 
                <KeyboardAvoidingView style={{alignSelf:'flex-start',marginTop:60,borderColor:'black',borderWidth:3,marginLeft:20,width:170}} >
                <TextInput value={groupName} onChangeText={setGroupName}   placeholderTextColor ={'rgb(185, 255, 248)'} placeholder={'Enter Group Name'} />
                </KeyboardAvoidingView>
        
                </View>
        
                <View style={{ flex:0.25,marginTop:0,alignSelf:'flex-end',flexDirection:'row' ,height:0 ,backgroundColor:'white',alignContent:'center',alignItems:'flex-start',height:200,}}>
                <Button title={'Cancel'} onPress={goBack}/>
               <Button  title={'uploadImage'} onPress={uploadImage}/>
                
               </View>
               <View style={{ flex:0.25,marginTop:0,alignSelf:'center',flexDirection:'row' ,height:0 ,backgroundColor:'white',alignContent:'center',alignItems:'flex-start',height:200,}}>
               <Text style={{fontSize:25 ,marginTop:15}}>Select participants</Text>
               </View>
               
              
            </View>
           
               <View style={{flex:1,backgroundColor:'green'}}>
               

               {myContacts ?    
                        <FlatList nestedScrollEnabled={true} style={{ flex: 1, padding: 10 }} data={Array.from(myContacts.values() ).filter((c)=> c.email!=currentUser.email )} keyExtractor={(item, i) => item.email}
        
                            renderItem={({ item }) => <ContactPreview contact={item}  />}
                        /> : null}
                       

        
               </View>
          
                
          
                
        
            </View>)
        }


}



function ContactPreview({ contact}) {
    const { unfilteredRooms } = useContext(GlobalContext);

  
    return (
    <ItemList style={{marginTop:7}} type='contacts' user={contact} image={contact.photoURL} room={unfilteredRooms.find((room) => room.participantsArray.includes(contact.email))} />
    )

}