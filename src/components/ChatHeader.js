import { View, Text ,TouchableOpacity} from 'react-native'
import React, { useContext } from 'react'
import Avatar from './Avatar'
import { useRoute ,NavigationAction, useNavigation } from '@react-navigation/native'
import GlobalContext from '../../Context/Context'

export default function ChatHeader(props) {
    const route = useRoute()
    const navigattion = useNavigation()
    

    const {theme:{colors}} = useContext(GlobalContext)
    function handlePress(){
      console.log('Chat header clicked')
      navigattion.navigate('ChatManager',{room:route.params.room})
      
    }
  return (
    <TouchableOpacity style={{flexDirection:'row',flex:1,display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center' }}
    onPress={()=>handlePress()}
     >
      <View>
      <Avatar size={40} user={route.params.user}  />
      </View>
      <View style={{marginLeft:10,alignItems:'center',justifyContent:'center'}}>
        <Text style={{color:colors.white , fontSize:18,}}>
        { route.params.user.displayName }</Text>
      </View>
    </TouchableOpacity>
  )
}