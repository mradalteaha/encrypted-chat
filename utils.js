import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { nanoid }from 'nanoid'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { storage } from "../encrypted-chat/src/firebase"

  


const palette = {
  tealBlue: "rgb(165, 241, 233)",
  tealBlueDark: "rgb(15, 52, 96)",
  Blue: "rgb(225, 255, 238)",
  Page: "rgb(255, 238, 175)",
  skyblue: "rgb(127, 188, 210)",
  smokeWhite: "#ece5dd",
  white: "white",
  gray: "#3C3C3C",
  lightGray: "#757575",
  iconGray: "#717171",
};

export const theme = {
  colors: {
    background: palette.smokeWhite,
    foreground: palette.tealBlueDark,
    primary: palette.tealBlue,
    tertiary: palette.Page,
    secondary: palette.Blue,
    white: palette.white,
    text: palette.gray,
    secondaryText: palette.lightGray,
    iconGray: palette.iconGray,
  },
};
