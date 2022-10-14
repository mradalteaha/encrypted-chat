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
  myContacts:[],
  setMyContacts:()=>{},
  loadingContacts:null,
  setLoadingContacts:()=>{},


});

export default GlobalContext;