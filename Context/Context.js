import React from "react";
import { theme } from "../utils";

const GlobalContext = React.createContext({
  theme,
  room:[] ,
  unfilteredRooms:[],
  SetRoom:()=>{},
  setUnfilteredRooms:()=>{},
  currentUser:null,
  setCurrentUser:()=>{},
  isLogged:false,
  setIsLogged:()=>{},


});

export default GlobalContext;