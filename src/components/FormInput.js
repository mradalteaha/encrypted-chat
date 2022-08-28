import { StyleSheet, TextInput, Text } from "react-native";




const FormInput = ({ onPress, title }) => (
    <TextInput onPress={onPress} style={styles.appButtonContainer}>
    </TextInput>
  );


  const styles = StyleSheet.create({
    // ...
    appButtonContainer: {
      elevation: 8,
      backgroundColor: "#009688",
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

  export default FormInput ; 
