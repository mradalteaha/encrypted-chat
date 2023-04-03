import React, { useState } from "react";
import Context from "./Context";
import { theme } from "../utils";

export default function ContextWrapper(props) {
  const [rooms, setRooms] = useState([]);
  const [unfilteredRooms, setUnfilteredRooms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [unfilteredGroups, setUnfilteredGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogged,setIsLogged]=useState(false);
  const [myContacts,setMyContacts] = useState(new Map());
  const [loadingContacts,setLoadingContacts]=useState(true)


  return (
    <Context.Provider
      value={{ theme, rooms,groups, setGroups, unfilteredGroups, setUnfilteredGroups,setRooms, unfilteredRooms, setUnfilteredRooms,myContacts,setMyContacts,currentUser,setCurrentUser,isLogged,setIsLogged ,loadingContacts,setLoadingContacts}}
    >
      {props.children}
    </Context.Provider>
  );
}
