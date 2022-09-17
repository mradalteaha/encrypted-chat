import React, { useState } from "react";
import Context from "./Context";
import { theme } from "../utils";

export default function ContextWrapper(props) {
  const [rooms, setRooms] = useState([]);
  const [unfilteredRooms, setUnfilteredRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogged,setIsLogged]=useState(false)
  return (
    <Context.Provider
      value={{ theme, rooms, setRooms, unfilteredRooms, setUnfilteredRooms,currentUser,setCurrentUser,isLogged,setIsLogged }}
    >
      {props.children}
    </Context.Provider>
  );
}
