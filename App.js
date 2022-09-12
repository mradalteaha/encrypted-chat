import 'react-native-gesture-handler'
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LogInScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ChatScreen from './src/screens/ChatScreen';
import ContactScreen from './src/screens/ContactScreen';
import ChatsScreen from './src/screens/ChatsScreen';
import Profile from './src/screens/Profile';
import { useAssets } from 'expo-asset';
import {onAuthStateChanged} from 'firebase/auth'
import { auth } from './src/firebase';
import {StyleSheet , View , LogBox ,Text} from 'react-native'
import ContextWrapper from './Context/ContextWrapper';
import GlobalContext from './Context/Context';
import {theme} from './utils'
import ChatHeader from './src/components/ChatHeader';
import ServerApi from './src/Api/ServerApi.js'


LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);
const App= ()=>{


  const [loading , setLoading] = useState(true)

    const {theme:{colors},currentUser,setCurrentUser} = useContext(GlobalContext) 

  useEffect(()=>{

    (async ()=>{
      
      try{
        const res = await ServerApi.get('/signIn')
        //console.log(res.data.user)
        if(res.data.user){
          const user=res.data.user

          setCurrentUser(user)
          setLoading(false)
          console.log('user are logged in ')
        }

      }catch(err){
        console.log(err)
      console.log('something went wrong')

      }
  
    } )()
    const unsubscribe = onAuthStateChanged(auth,user =>{
      setLoading(false)
      if(user){
        setCurrentUser(user)
        setLoading(false)
      }
    })
 
    return ()=>unsubscribe();
  },[])

  const Stack = createNativeStackNavigator();
  if(loading){
    return <Text>Loading ... </Text>
  }

    return (
      <NavigationContainer> 
      {!currentUser ? (
        <Stack.Navigator>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown:false}}  />
        <Stack.Screen name="LogInScreen" component={LogInScreen} options={{headerShown:false}} />

        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerStyle:{
          backgroundColor:colors.foreground,
          shadowOpacity:0,
          elevation :0,
        }}} >    
        {!currentUser.displayName && <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}}  />}
          
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{title:'Secret-Chat'}}  />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerTitle:(props)=> <ChatHeader {...props}/>}}  />

            </Stack.Navigator>


      )}
      
      
      </NavigationContainer>

    )
/*
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen}   />
      <Stack.Screen name="LogInScreen" component={LogInScreen} options={{headerShown:false}} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown:false}} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown:false}} />

      </Stack.Navigator>
    </NavigationContainer>
  );*/
};


function Main(){
  const [assets] = useAssets(
    require('./assets/icon-square.png'),
    require('./assets/chatbg.png'),
    require('./assets/user-icon.png'),
    require('./assets/welcome-img.png'),

  );

  if(!assets){
    return <Text>Loading ...</Text>
  }
  
  return  (<ContextWrapper>

   <App/>
   
   </ContextWrapper>)
};

export default Main;
