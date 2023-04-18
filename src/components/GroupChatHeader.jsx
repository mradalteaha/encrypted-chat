import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Avatar from './Avatar'
import { useRoute } from '@react-navigation/native'
import GlobalContext from '../../Context/Context'
import GroupImage from './GroupImage'

export default function GroupChatHeader(props) {
    const route = useRoute()
    const {theme:{colors}} = useContext(GlobalContext)
  return (
    <View style={{flexDirection:'row' }}>
      <View>
      <GroupImage size={40} backgroundImage={route.params.room.groupImage}  />
      </View>
      <View style={{marginLeft:10,alignItems:'center',justifyContent:'center'}}>
        <Text style={{color:colors.white , fontSize:18,}}>
        { route.params.room.groupName }</Text>
      </View>
    </View>
  )
}