import { View, Text ,TouchableOpacity} from 'react-native'
import React, { useContext } from 'react'
import Avatar from './Avatar'
import { useRoute ,NavigationAction, useNavigation } from '@react-navigation/native'
import GlobalContext from '../../Context/Context'
import GroupImage from './GroupImage'

export default function GroupChatHeader(props) {
    const route = useRoute()
    const navigattion = useNavigation()
    const {theme:{colors}} = useContext(GlobalContext)

  function handlePress(){
    console.log('groupChat header clicked')
    console.log(route.params.room.groupName)
    navigattion.navigate('GroupChatManager',{room:route.params.room})
    
  }

  return (
    <TouchableOpacity style={{flexDirection:'row',flex:1,display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center' }}
    onPress={()=>handlePress()}
     >
      <View>
      <GroupImage size={40} backgroundImage={route.params.room.groupImage}  />
      </View>
      <View style={{marginLeft:10,alignItems:'center',justifyContent:'center'}}>
        <Text style={{color:colors.white , fontSize:18,}}>
        { route.params.room.groupName }</Text>
      </View>
    </TouchableOpacity>
  )
}