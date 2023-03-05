import { collection, onSnapshot, query, QuerySnapshot, where,getDocs,getDoc } from 'firebase/firestore';
import React, { cloneElement, useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList } from 'react-native';
import GlobalContext from '../../Context/Context';
import MyButton from '../components/MyButton'
import { auth, db } from '../firebase'
import Contacts from '../components/Contacts';
import useContacts from '../hooks/useHooks';
import ItemList from '../components/ItemList';
import { useRoute } from '@react-navigation/native';
import ServerApi from '../Api/ServerApi';

function ContactScreen(props) {

    //const contacts =useContacts()

    //const contacts = useContacts() // fetching contacts from the phone
    const route = useRoute() //using route for navigation and passing data
    const [usersCollection, setUsersCollection] = useState([])// fetches the users collection from the database
    const {myContacts} = useContext(GlobalContext)
    const image = route.params && route.params.image  //extracting the image if founded on the route the && to check if it exist on passed arguments


    useEffect(() => {

        (async () => {

            try {

                //    console.log('-------------------------------------')
                //   console.log('inside get users use effect')

                const usersRef = collection(db,'users') 
                const docsSnap = await getDocs(usersRef);
                const usersArray =[];
            
                docsSnap.forEach(doc => {
                    usersArray.push(doc.data())
                //    console.log(doc.data());
                })
                console.log('printing usercollection')
                console.log(usersArray)
                setUsersCollection(usersArray) // setting the users found on the database to the users state hook 

                //   console.log('------------------end of use effect ---------------')

                console.log("inside contactsScreen")

                console.log(`printing my contacts `)
                myContacts.forEach(e =>console.log(e))

            } catch (err) {
                console.log('error occured on the useEffect useUsers');
                console.log(err)
            }

        })()
    }, [])


    if (!myContacts) {
        return (<SafeAreaView style={styles.container}>
            <Text>Loading contacts...</Text>
        </SafeAreaView>
        )
    }else{
    return (
        <SafeAreaView style={styles.container}>
            {usersCollection ?
                <FlatList style={{ flex: 1, padding: 10 }} data={myContacts} keyExtractor={(item, i) => item.email}

                    renderItem={({ item }) => <ContactPreview contact={item} image={image} usersCollection={usersCollection} />}
                /> : null}

  


        </SafeAreaView>
    )
            }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 5,
        paddingRight: 10,


    },


    header: {
        color: 'red',
        fontSize: 50,
        alignSelf: 'center',
    },

});


function ContactPreview({ contact, image, usersCollection }) {
    const { unfilteredRooms } = useContext(GlobalContext);
    const [user, setUser] = useState(contact);

    

    useEffect(()=>{
        const q = query(collection(db,'users'),where('email','==',contact.email))

        const unsubscribe = onSnapshot(q,snapshot=>{
            if(snapshot.docs.length){
                const userDoc = snapshot.docs[0].data()
                setUser((prevUser)=>({...prevUser , userDoc}))
            }
        })
        return () => unsubscribe()
    },[])

    ///////////need few fixes with the quer

  
    return (
    <ItemList style={{marginTop:7}} type='contacts' user={user} image={image} room={unfilteredRooms.find((room) => room.participantsArray.includes(contact.email))} />
    )

}

export default ContactScreen;