import React ,{useContext}from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import GlobalContext from '../../Context/Context';
import ChatsScreen from './ChatsScreen';
import ContactScreen from './ContactScreen';
import {AntDesign} from '@expo/vector-icons';
import ManagerScreen from './ManagerScreen';
import GroupChatsScreen from './GroupChatsScreen'



const Tab=createMaterialTopTabNavigator()
function HomeScreen(props) {


    const {
        theme: { colors },
      } = useContext(GlobalContext);
      return (
        <Tab.Navigator
          screenOptions={({ route }) => {
            return {
              tabBarLabel: () => {
                if (route.name === "contacts") {
                  return <AntDesign name="contacts" size={20} color={colors.white} />;
                } else {
                  return (
                    <Text style={{ color: colors.white }}>
                      {route.name.toLocaleUpperCase()}
                    </Text>
                  );
                }
              },
              tabBarShowIcon: true,
              tabBarLabelStyle: {
                color: colors.white,
              },
              tabBarIndicatorStyle: {
                backgroundColor: colors.white,
              },
              tabBarStyle: {
                backgroundColor: colors.foreground,
              },
            };
          }}
          initialRouteName="contacts" // this route is the default after login
          //initialRouteName="contacts" // testing for the contact page 

        >
          <Tab.Screen name="contacts" component={ContactScreen} />
          <Tab.Screen name="chats" component={ChatsScreen} />
          <Tab.Screen name="Groups" component={GroupChatsScreen} />
          <Tab.Screen name="ManagerScreen" component={ManagerScreen} />
        </Tab.Navigator>
      );
}

const styles = StyleSheet.create({
    container :{
        backgroundColor : '#fff',


    },

    header : {
        color : 'red' ,
        fontSize : 50 ,
        alignSelf : 'center',
    },

});

export default HomeScreen;