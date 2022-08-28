import React from 'react';
//keybord avoiding view
import { KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Keyboard ,StyleSheet} from 'react-native';


function KeyboardAvoidingWrapper({children}){
return (
    <KeyboardAvoidingView>
        <ScrollView
        contentContainerStyle={{
      heigh: "300%",
      flex:1, 
      backgroundColor: '`',
      justifyContent: 'space-evenly'
    }}
    horizontal={true}
    alwaysBounceHorizontal={true}
    bounces={true}
    decelerationRate="fast"
    showsHorizontalScrollIndicator={false}
    scrollEventThrottle={200}
    pagingEnabled={true}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                {children}

            </TouchableWithoutFeedback>

        </ScrollView>

    </KeyboardAvoidingView>
)

}


const styles = StyleSheet.create({
    container :{
        backgroundColor : '#fff',


    },


});

export default KeyboardAvoidingWrapper ; 