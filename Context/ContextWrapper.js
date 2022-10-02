import React, { useState } from "react";
import Context from "./Context";
import { theme } from "../utils";

export default function ContextWrapper(props) {
  const [rooms, setRooms] = useState([]);
  const [unfilteredRooms, setUnfilteredRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogged,setIsLogged]=useState(false);
  const [myContacts,setMyContacts] = useState([]);
  const [loadingContacts,setLoadingContacts]=useState(true)


  return (
    <Context.Provider
      value={{ theme, rooms, setRooms, unfilteredRooms, setUnfilteredRooms,myContacts,setMyContacts,currentUser,setCurrentUser,isLogged,setIsLogged ,loadingContacts,setLoadingContacts}}
    >
      {props.children}
    </Context.Provider>
  );
}
