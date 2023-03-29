import React, { useContext, useState ,useEffect} from 'react';
import { SafeAreaView ,View ,Text ,StyleSheet } from 'react-native';
import MyButton from '../components/MyButton'
import GlobalContext from '../../Context/Context';
import LoginScreen from './LoginScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { NavigationHelpersContext } from '@react-navigation/native';
import {createAssetAsync,usePermissions,createAlbumAsync} from 'expo-media-library'
import {EncryptAESkey,DecryptAESkey,askForPermission} from '../../utils.js'
import {writeAsStringAsync,readAsStringAsync,documentDirectory,makeDirectoryAsync,getInfoAsync,StorageAccessFramework,EncodingType} from 'expo-file-system'
import * as Permissions from 'expo-permissions';



function ManagerScreen(props) {
    const {currentUser}=auth 

    const {theme:{colors},setCurrentUser} = useContext(GlobalContext)
    
    const publicKey=`-----BEGIN RSA PUBLIC KEY-----MIIBCgKCAQEAvRY8D3feCyzrkMwobdyC6sTlnOlJoh8trZKdtT3L3xLleUOhqW8xHsfb4EkHseQGBkVLdiqsaT/mWWdQmTryhHWy2j77H99PpB7TCEfS5QafQz+HtqM/QyYPe6/jBVd3XRswsosGnB4kJlcqLX1y744dCN8/eAhMKSbTSKi47MJ37bmCWE7kgy+ZEmhVjiVvKghUfLYOu3tvkApIQwvjT7T9IH9BTPBUu9/078QF8HovQ8BkQuHf1t1QGEteEptOXA/IGW3Zo2IPKbrFvBvsYzSGv37kpDv/YT30KYndvDxKcNHAO/p2rtm8w3fi+WFX4WOtgN8SNkdyY20ssOmsIwIDAQAB-----END RSA PUBLIC KEY-----`
    const privateKey =`-----BEGIN RSA PRIVATE KEY-----MIIEpQIBAAKCAQEAvRY8D3feCyzrkMwobdyC6sTlnOlJoh8trZKdtT3L3xLleUOhqW8xHsfb4EkHseQGBkVLdiqsaT/mWWdQmTryhHWy2j77H99PpB7TCEfS5QafQz+HtqM/QyYPe6/jBVd3XRswsosGnB4kJlcqLX1y744dCN8/eAhMKSbTSKi47MJ37bmCWE7kgy+ZEmhVjiVvKghUfLYOu3tvkApIQwvjT7T9IH9BTPBUu9/078QF8HovQ8BkQuHf1t1QGEteEptOXA/IGW3Zo2IPKbrFvBvsYzSGv37kpDv/YT30KYndvDxKcNHAO/p2rtm8w3fi+WFX4WOtgN8SNkdyY20ssOmsIwIDAQABAoIBAQCVbU/TbYfEzx/t0tkUUNII08cc5GMzQm5nn9kP1KEbTaSY2zCTZHKt/4UsTqpNE4ULSZGj9X9AwaW4+2N/ZE0pDpZj0KfF/UTDzzQ4dAIeycfsbfVDCOlCmH5d4ZaHryJ+KrGmNyXnFA6/WdzUDDJbS7R4QWy3397IGo2X+vYA6yX7d7fbKdJ/vjwxLjHxOl80dHGnsmhc1VeUS8rTkkSedk/LnMyUeQcDfhn+VFZzgkphSVhsuPs83gSNpmEclSM3EaLvsu+fxJlFh12vAYuFpDGYGbsWCqPBctt8xFM/1lbB/tYCD825QotniZB81q7CbjOdcsfJwa1Sr1ysexVZAoGBANy4r5ZfAQH/x4J66V+DylN62auHePWkbwrapX+Bbh26pHL0mPbo7K3eFCc41wM0Y3J74cRXcZE9nP1NUrll0uYgT6XhBE7EOxRbD6FOxk4Ww6WiSZDn+QmgYkL3MAqBCTPCJLlH5yilLlVHHh2RM7UR5CpwL3I3j7nePeIatHbvAoGBANtPJhwal3PLI9EOraRDJhVCY8qI4Q9ixpjUKWOhu90Owp4uTwzmLH4yvrZWVYkGfwi56YAmqwEypPWspEX5J7A3apJAIj+w4+EKAqavyAPmXtx01dBMd+ZgG14T97AWC6Vakt58bWz3KCpx5sS6TzNXdr4zCFg+2Z05OR8AKn4NAoGBAJgdN/Wb9+fWzTqhVqCbBR9PNSA/tx8jeduzIAelvawDaz5GT/0qPaL9wEnfpF7zBe5qbgeQdBYyrjTryy02fYhXkEyzrPJTzpuSvkzfK0+55JAMLkMNe9YkkFOyY4t5rkvbas++PBMI88uVva2G2mnZsLOGqUw/+m+QOHnRCbpFAoGAVjA47fqVYvCG1vZJz7CEGv7IcSRyLrXHDvDygzFgv3O5kKjqcEtVWRNgWBB99SgUbL2DwtVvhzz8D4EV3loY+uwMegWycA14wUxJ1nBmzwGObl2MWhxzUpqaptJ6GT3Qvd9msQF9j8Fii6vP4ajGz4qkJAOyV9v7cgq3JDPQf1ECgYEAv4T+IbwSyCL6N5PavjfFCisfsOWQlPZf3E3vZV+B1w0Yj2q6YyNs3kJgfBf9+BisQQAUmqUDJOTaa8zOvdXso3ibiMNZ+ZVN+bin+f773ZDWczEUddeN6M0ux/FMom0x+qyegPx+PILBYYSQDTeTNDnKj7LQF4LLKLjNbNzircI=-----END RSA PRIVATE KEY-----`
    const aeskey='1231231231231231'
    const userKeys ={publicKey,privateKey}
    const rooms={'123':aeskey}
    const userLocal={keys:userKeys,rooms:rooms} 
    const userid='123321123'
    const [encaeskey,setencAESKey] =useState(null)
    const [permissionResponse, requestPermission] =usePermissions();
    const [permissionStatus, permissionStatusUpdate] = useState(null);

//    const {granted} =StorageAccessFramework.requestDirectoryPermissionsAsync(`${documentDirectory}localData/`)


   async function SignOutfun(){ // sign out function for future use 
    signOut(auth).then(() => {
        setCurrentUser(null)
    }).catch((error) => {
        // An error happened.
      });
    }

    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            permissionStatusUpdate(status)
        })()
    }, [])
   

    function help(){
        //here we go to create help function will take us to help page 

    }

    if (!permissionStatus) {
        return <Text>Loading ...</Text>
    }
    if (permissionStatus !== 'granted') {
        return <Text> you need to grant permission </Text>
    }

    async function readFile(){
        let filename =documentDirectory + "text.txt"
        readAsStringAsync(filename).then((res)=>{
            console.log('reading successfull successfully')
            let results = res
            console.log('retrieved data')
            console.log(results)
        }).catch(err=>{
            console.log('error occured writing to the file')
            console.log(err)
        })
      

    }
    async function writeFile(){
        const local = JSON.stringify(userLocal)
        StorageAccessFramework.requestDirectoryPermissionsAsync(`${documentDirectory}localData/`).then(res=>{
            requestPermission().then(granted=>{
                if(granted){
                    if (res.granted){
                        getInfoAsync(`${documentDirectory}localData/${userid}.txt`).then(fileinf=>{
                            if(!fileinf.exists){
                                console.log(`file doesn't exist`)
                                makeDirectoryAsync(`${documentDirectory}localData/${userid}.txt`).then(()=>{
                                    console.log('file created successfully')
                                    writeAsStringAsync(`${documentDirectory}localData/${userid}.txt`,local).then(()=>{
                                        console.log('writing successfully')
                                    }).catch(err=>{
                                        console.log('error occured writing to the file')
                                        console.log(err)
                                    })
                                }).catch(err=>{
                                    console.log('error occured')
                                    console.log(err)});
                                
                            /*     console.log('file exist')
                                writeAsStringAsync(`${documentDirectory}localData/${userid}.txt`,local).then(()=>{
                                    console.log('writing successfully')
                                }).catch(err=>{
                                    console.log('error occured writing to the file')
                                    console.log(err)
                                }) */
                            } else{
                                console.log(`file doesn't exist`)
                              /*   makeDirectoryAsync(`${documentDirectory}localData/${userid}.txt`).then(()=>{
                                    console.log('file created successfully')
                                    writeAsStringAsync(`${documentDirectory}localData/${userid}.txt`,local).then(()=>{
                                        console.log('writing successfully')
                                    }).catch(err=>{
                                        console.log('error occured writing to the file')
                                        console.log(err)
                                    })
                                }).catch(err=>{
                                    console.log('error occured')
                                    console.log(err)}); */
                
                            } 
                        })
                    }
                }

            })
            
        })
        

        
        
       

    }


    async function test(){
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
        let fileUri = FileSystem.documentDirectory + "text.txt";
        await FileSystem.writeAsStringAsync(fileUri, "Hello World", { encoding: FileSystem.EncodingType.UTF8 });
        const asset = await createAssetAsync(fileUri)
        await createAlbumAsync("Download", asset, false)
    }
    }

    async function saveFile() {
        if(permissionStatus){
            const local = JSON.stringify(userLocal)
            console.log('permission granted')
            let fileUri = documentDirectory + "text.txt";
             writeAsStringAsync(fileUri, local, { encoding:EncodingType.UTF8 }).then(()=>{
                console.log('file saved success')
             });
          
        }
           
        
    }
    return (
        <SafeAreaView>
            <MyButton title={'Help'} onPress={help}/>
            <MyButton title={'SignOut'} onPress={SignOutfun}/>

            <MyButton title={'WitetoFile'} onPress={saveFile}/>
            <MyButton title={'readFile'} onPress={readFile}/>

        </SafeAreaView>
    )
}

export default ManagerScreen;