import React from "react";
import { theme } from "../utils";

const GlobalContext = React.createContext({
  theme,
  room:[] ,
  SetRoom:()=>{}

});

export default GlobalContext;