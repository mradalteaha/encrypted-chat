import 'react-native-gesture-handler'
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LogInScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ChatScreen from './src/screens/ChatScreen';
import Profile from './src/screens/Profile';
import { useAssets } from 'expo-asset';
import {onAuthStateChanged} from 'firebase/auth'
import { auth } from './src/firebase';
import {StyleSheet , View , LogBox ,Text} from 'react-native'
import ContextWrapper from './Context/ContextWrapper';
import Context from './Context/Context';
import {theme} from './utils'

LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);
const App= ()=>{

  const [currentUser, setCurrentUser] = useState(null)
  const [loading , setLoading] = useState(true)

    const {theme:{colors}} = useContext(Context) 

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,user =>{
      setLoading(false)
      if(user){
        setCurrentUser(user)
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
