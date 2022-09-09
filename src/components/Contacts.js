import { View, Text ,TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import GlobalContext from '../../Context/Context'
import { useNavigation } from '@react-navigation/native'
//after a long thought this component is no longer used 
export default function Contacts() {
    const {theme:{colors}} = useContext(GlobalContext)
    const navigation =useNavigation()
  return (
    <TouchableOpacity 
    onPress={()=>navigation.navigate('contacts')}
    style={{
        position:'absolute',
        right:20 , 
        bottom:0,
        borderRadius:60 ,
        width:60 ,
        height: 60 ,
        backgroundColor : colors.background,
        alignItems:'center',
        justifyContent:'center'

    }}>
      <MaterialCommunityIcons
        name='android-messages'
        size={30}
        color='white'
        style={{transform:[{scaleX:-1}]}}
      />
    </TouchableOpacity>
  )
}