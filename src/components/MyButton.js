import { StyleSheet, TouchableOpacity, Text } from "react-native";




const AppButton = (props) => (
    <TouchableOpacity onPress={props.onPress} style={styles.appButtonContainer} disabled={props.disabled}>
      <Text style={styles.appButtonText}>{props.title}</Text>
    </TouchableOpacity>
  );


  const styles = StyleSheet.create({
    // ...
    appButtonContainer: {
      elevation: 8,
      backgroundColor: "rgb(0, 103, 120)",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      position : 'relative',
      margin: 50,
      marginBottom : 5,
    },
    appButtonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    }
  });

  export default AppButton ; 
