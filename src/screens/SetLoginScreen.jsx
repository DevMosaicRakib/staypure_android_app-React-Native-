import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

const SetLoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
  
    const validateEmail = (text) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(text));
      setEmail(text);
    };

    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const navigation = useNavigation()
    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardOpen(true);
      });
  
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardOpen(false);
      });
  
      // Cleanup subscriptions on component unmount
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    const dismissKeyboard = () => {
      Keyboard.dismiss();
    };
  
    return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: keyboardOpen ? 120 : 0 },
        ]}>

        
      <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your emails and password</Text>
    
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
        />
        {emailValid && <Text style={styles.validIcon}>✓</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.forgotView}>
      <TouchableOpacity onPress={()=>{
        navigation.navigate('SendResetPasswordEmail')
       }}>
      <Text style={styles.forgotlink}>
        Forgot Password?
      </Text>
       </TouchableOpacity>
      </View>
       
      

      <TouchableOpacity style={styles.button}   onPress={() => {
            
        }}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>     

    </View>
    </ScrollView>
    </TouchableWithoutFeedback>

    );
}

export default SetLoginScreen

const styles = StyleSheet.create({
    scrollViewContent: {
      flexGrow: 1,
    },
      container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
      },
      title: {
        fontSize: 26,
        fontFamily:"Gilroy-Bold",
        color: '#242424',
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 14,
        fontFamily:"Gilroy-SemiBold",
        color: '#7C7C7C',
        marginBottom: 20,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        width: '100%',
      },
      input: {
      //   flex: 1,
        width:"100%",
        height: 50,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily:"Gilroy-SemiBold",
        backgroundColor: '#FFF',
        position:"relative"
      },
      validIcon: {
        marginLeft: 10,
        fontSize: 18,
        color: 'green',
        fontFamily:"Gilroy-SemiBold",
        position:"absolute",
        top:12,
        right:10
      },
      eyeIcon: {
      //   marginLeft: 10,
        fontSize: 18,
        color: '#888',
        position:"absolute",
        top:-12,
        right:10
      },
      link: {
        color: '#53B175',
        fontFamily:"Gilroy-SemiBold",
        textDecorationLine: 'underline',
        fontSize: 15,
        marginTop:18
      },
      forgotView:{
        width:"100%",
        marginVertical:10,
        // textAlign:"right",
        alignItems:"flex-end",
        
      },
      forgotlink: {
        color: '#53B175',
        fontFamily:"Gilroy-SemiBold",
        fontSize: 14,
        textDecorationLine: 'underline',
      },
      button: {
        backgroundColor: '#53B175',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
      },
      buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily:"Gilroy-SemiBold",
      },
      footerText: {
        fontSize: 15,
        fontFamily:"Gilroy-SemiBold",
        color: '#7C7C7C',
        marginTop: 20,
      },
    });