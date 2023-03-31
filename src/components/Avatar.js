import { Image} from 'react-native'
import React from 'react'

export default function Avatar({size,user}) {
 
//console.log('printing the user inside the Avatar component')
 // console.log(user)
 const image =user.photoURL
  
  return (
    <Image style={{width:size, height:size ,borderRadius:size }} 
    source={{uri:image}}


        resizeMode='cover'
    />
      
  )
}