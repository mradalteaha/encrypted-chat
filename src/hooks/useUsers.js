import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import ServerApi from '../Api/ServerApi'


export default function useUsers() {

    const [users, setUsers] = useState([])


    useEffect(() => {

        (async () => {

            try {

            //    console.log('-------------------------------------')
             //   console.log('inside get users use effect')

                const result = await ServerApi.get('/getUsers') //fetching users from the users collection database

                const usersArray = result.data.users;
            //    console.log('result of users array')
            //    console.log(usersArray);

                setUsers(usersArray) // setting the users found on the database to the users state hook 

             //   console.log('------------------end of use effect ---------------')


            } catch (err) {
                console.log('error occured on the useEffect useUsers');
                console.log(err)
            }

        })()
    }, [])



    return users
}