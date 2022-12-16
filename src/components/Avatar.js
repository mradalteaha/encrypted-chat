import { Image} from 'react-native'
import React from 'react'

export default function Avatar({size,user}) {
  // console.log("printing the image inside the Avatae component");
  // console.log(user.Image.);
//console.log(user);
  return (
    <Image style={{width:size, height:size ,borderRadius:size }} 
    source={{uri:user.photoURL}}


        resizeMode='cover'
    />
      
  )
}