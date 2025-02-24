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
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../Redux/UserAndAuthServices/userAuthApi';
import { CommonActions } from '@react-navigation/native';
import { getToken, storeToken } from '../Redux/UserAndAuthServices/LocalStorageService';
import { setUserToken } from '../Redux/AuthAndUserSlice/authSlice';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFetchCartItemsQuery } from '../Redux/CartSlice/cartApi';
const initialUser = {email:"",password:""};
const LoginScreen = ({isLoggedIn,setIsLoggedIn}) => {
  const { data: cartItems, error, refetch } = useFetchCartItemsQuery();
  const [user,setUser] = useState(initialUser)
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [server_error, setServerError] = useState({})
  const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [nonFieldError,setNonFieldError] = useState("");

    const handleChange = (name, value) => {
      setUser ((currentUser ) => ({
          ...currentUser ,
          [name]: value,
      }));
  };

  const handleSubmit = async () => {
    const actualData = user;
    // console.log(actualData);
    const res = await loginUser (actualData);
    console.log(res);

    if (res.error) {
        if (res?.error?.data?.errors?.non_field_errors) {
            setNonFieldError(res?.error?.data?.errors?.non_field_errors[0]);
        }
        setServerError(res.error.data.errors);
        console.log(server_error);
    }

    if (res.data) {
        storeToken(res?.data?.token);
        setServerError({});

        // Await the getToken call to retrieve the access token
        const { access_token } = await getToken(); // Use await here
        console.log("login access", access_token);

        // Check if access_token is retrieved successfully
        if (access_token) {
            dispatch(setUserToken({ access_token: access_token }));
            refetch()
        } else {
            console.error("Failed to retrieve access token");
        }

        setUser (initialUser );
        Alert.alert("Login Successful", res?.data?.msg);
        setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Home", params: { screen: "Home_stack" } }],
                })
            );
        }, 2000);
    }
};

  let { access_token } = getToken()
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }))
  }, [access_token, dispatch])


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

{nonFieldError && (
          <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              width:"95%",
              marginHorizontal:"auto",
              borderWidth:1,
              borderColor:"#7C7C7C",
              padding: 15,
              borderRadius:16,
              marginTop:100
          }}>
              <Text style={{
                  width: "90%",
                  fontSize: 14,
                  fontFamily: "Gilroy-SemiBold",
                  color: "#e14877",
                  textAlign:"center"
                  

              }}>
                  {nonFieldError}
              </Text>
              <TouchableOpacity onPress={() => {setNonFieldError("")}}>
                  <Text>
                      <AntDesign name="close" style={{
                      fontSize: 20,
                      fontFamily: "Gilroy-SemiBold",
                      color: "gray"
                  }}/>
                  </Text>
              </TouchableOpacity>
          </View>
      )}
      <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your emails and password</Text>
    
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => handleChange('email', value)}
          value={user.email}
          keyboardType="email-address"
        />
      </View>
      {server_error.email && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:12,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.email[0]}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(value) => handleChange('password', value)}
          value={user.password}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>
      {server_error.password && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:12,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.password[0]}</Text>}

      <View style={styles.forgotView}>
      <TouchableOpacity onPress={()=>{
        navigation.navigate('SendResetPasswordEmail')
       }}>
      <Text style={styles.forgotlink}>
        Forgot Password?
      </Text>
       </TouchableOpacity>
      </View>
       
      

      <TouchableOpacity style={styles.button}   onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.footerText}>Not have any acccount? </Text>
        <TouchableOpacity onPress={()=>{
            // navigation.navigate('SignUp')
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignUp' }], 
                });
        }}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>


    </View>
    </ScrollView>
    </TouchableWithoutFeedback>

    );
}

export default LoginScreen

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
        fontSize: 22,
        fontFamily:"Gilroy-Bold",
        color: '#242424',
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 13,
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
        fontSize: 14,
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
        fontSize: 14,
        fontFamily:"Gilroy-SemiBold",
      },
      footerText: {
        fontSize: 14,
        fontFamily:"Gilroy-SemiBold",
        color: '#7C7C7C',
        marginTop: 20,
      },
    });