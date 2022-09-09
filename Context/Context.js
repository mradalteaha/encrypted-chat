import React from "react";
import { theme } from "../utils";

const GlobalContext = React.createContext({
  theme,
  room:[] ,
  unfilteredRooms:[],
  SetRoom:()=>{},
  setUnfilteredRooms:()=>{},

});

export default GlobalContext;