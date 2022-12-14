import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Avatar from './Avatar'
import { useRoute } from '@react-navigation/native'
import GlobalContext from '../../Context/Context'

export default function ChatHeader(props) {
    const route = useRoute()
    const {theme:{colors}} = useContext(GlobalContext)
  return (
    <View style={{flexDirection:'row' }}>
      <View>
      <Avatar size={40} user={route.params.user}  />
      </View>
      <View style={{marginLeft:10,alignItems:'center',justifyContent:'center'}}>
        <Text style={{color:colors.white , fontSize:18,}}>
        { route.params.user.contactName ||route.params.user.displayName }</Text>
      </View>
    </View>
  )
}