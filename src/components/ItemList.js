import { View, Text ,TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import GlobalContext from '../../Context/Context'
import {Grid,Row,Col} from 'react-native-easy-grid'
import Avatar from './Avatar'
import {db} from '../firebase'
import { collection, onSnapshot, doc, addDoc, updateDoc, getDoc ,setDoc} from 'firebase/firestore';


export default function ItemList({type,description,user,style,time ,room ,image,}) {

    const [unread , setUnread] =useState(0)
    const navigation = useNavigation()
    const {theme:{colors}} = useContext(GlobalContext)


   
  // console.log(user);

  return (
    <TouchableOpacity style={{height:80,borderRadius:30, ...style}} onPress={()=>navigation.navigate("ChatScreen",{user,room,image})}>
        <Grid style={{maxHeight:80}} >
          <Col style={{width:80,alignItems:'center',justifyContent:'center'}}>
            <Avatar user={user} size={type ==='contacts' ? 40 : 60}/>
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
