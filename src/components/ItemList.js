import { View, Text ,TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import GlobalContext from '../../Context/Context'

export default function ItemList({type,description,user,style,time ,room ,image,}) {

    const navigation = useNavigation()
    const {theme:{colors}} = useContext(GlobalContext)
  return (
    <TouchableOpacity style={{height:80,borderRadius:30, ...style}} onPress={()=>{}}>
      <Text>ItemList</Text>
    </TouchableOpacity>
  )
}
