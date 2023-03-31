import React from "react";
import { theme } from "../utils";

const GlobalContext = React.createContext({
  theme,
  rooms:[] ,
  unfilteredRooms:[],
  setRooms:()=>{},
  setUnfilteredRooms:()=>{},
  groups:[] ,
  unfilteredGroups:[],
  setGroups:()=>{},
  setUnfilteredGroups:()=>{},
  currentUser:null,
  setCurrentUser:()=>{},
  isLogged:false,
  setIsLogged:()=>{},
  myContacts:new Map(),
  setMyContacts:()=>{},
  loadingContacts:null,
  setLoadingContacts:()=>{},


});

export default GlobalContext;