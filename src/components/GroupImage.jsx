import { Image} from 'react-native'
import React from 'react'

export default function GroupImage({size,backgroundImage}) {
 
//console.log('printing the user inside the Avatar component')
 // console.log(user)
 const image =backgroundImage
  
  return (
    <Image style={{width:size, height:size ,borderRadius:size }} 
    source={{uri:image}}


        resizeMode='cover'
    />
      
  )
}