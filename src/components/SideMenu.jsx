import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, SafeAreaView, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useGetLoggedUserQuery } from '../Redux/UserAndAuthServices/userAuthApi';
import useFetch from '../CustomHooks/useFetch';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const SideMenu = ({ isOpen, onClose,device,openModal }) => {
  const { access_token } = useSelector(state => state.auth)
  const {
    data,
    isSuccess,
    refetch: profilerefetch,
  } = useGetLoggedUserQuery(access_token);
  console.log(data)
  useEffect(()=>{
    profilerefetch()
  },[])
  const allproductsdata = useFetch('sp/api/products/')
  const slideAnim = React.useRef(new Animated.Value(-screenWidth)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -screenWidth, // Slide in/out
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const navigator = useNavigation()
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1} // Ensures touches outside the menu close it
        />
      )}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: slideAnim }], // Slide animation
          },
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Entypo name="cross" style={styles.closeText}/>
        </TouchableOpacity>
        <View style={styles.menuContentContainer}>
          {!access_token ? (
            <TouchableOpacity style={styles.perMenuItemContainer} onPress={() => {
              navigator.dispatch(
              CommonActions.reset({
                  index: 0, // The index of the active screen
                  routes: [
                  {
                      name: "Account", // The parent navigator or screen name
                      params: { screen: "Login" }, // Target screen in CartAndCheckoutNavigator
                  },
                  ],
              })
              );
              onClose()
          }}>
              <View style={styles.menuTextAndIcon}>
              <MaterialIcons name="account-circle" size={23} style={[styles.iconWithText,{marginLeft:4}]}/>
              <Text style={styles.menuText}>Login</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={14} style={styles.arrowIcon}/>
            </TouchableOpacity>
          ) : (
            <View style={{
              alignItems:"center",
              paddingVertical:10,
              marginVertical:10
            }}>
              <Image 
               source={{uri: process.env.REACT_APP_IMG_URL + data?.profile_picture}}
                style={{
                  width:80,
                  height:80,
                  borderWidth:2,
                  borderColor:"#53B175",
                  borderRadius:50,
                  overflow:"hidden",
                  marginBottom:10
                }}
              />
              <Text style={{
                fontSize:14,
                fontFamily:"Gilroy-Medium",
                color:"#242424",
                marginBottom:10
              }}>{data?.username}</Text>
              <TouchableOpacity style={{
                width:"90%",
                marginHorizontal:"auto",
              }} onPress={() => {
                navigator.dispatch(
                CommonActions.reset({
                    index: 0, // The index of the active screen
                    routes: [
                    {
                        name: "Account", // The parent navigator or screen name
                        params: { screen: "UserProfile" }, // Target screen in CartAndCheckoutNavigator
                    },
                    ],
                })
                );
                onClose()
            }}>
                <Text style={{
                  fontSize:13,
                  fontFamily:"Gilroy-SemiBold",
                  borderWidth:1,
                  borderColor:"#53B175",
                  padding:10,
                  textAlign:"center",
                  color:"#53B175",
                  borderRadius:10
                }}>Go to Profile</Text>
              </TouchableOpacity>
            </View>
          )}

            <TouchableOpacity style={styles.perMenuItemContainer} onPress={()=>{
              navigator.navigate('Home');
              onClose()
            }}>
              <View style={styles.menuTextAndIcon}>
              <Entypo name="home" size={22} style={[styles.iconWithText,{marginLeft:4}]}/>
              <Text style={styles.menuText}>Home</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={14} style={styles.arrowIcon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.perMenuItemContainer} onPress={()=>{
              navigator.navigate("Products_show", { Name: 'Shop', Products: allproductsdata, device: device, openModal: openModal });
              onClose()
            }}>
              <View style={styles.menuTextAndIcon}>
              <Entypo name="shop" size={22} style={[styles.iconWithText,{marginLeft:4}]}/>
              <Text style={styles.menuText}>Shop</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={14} style={styles.arrowIcon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.perMenuItemContainer} onPress={() => {
            navigator.navigate('About')
            onClose()
        }}>
              <View style={styles.menuTextAndIcon}>
              <MaterialIcons name="info" size={22} style={[styles.iconWithText,{marginLeft:4}]}/>
              <Text style={styles.menuText}>About</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={14} style={styles.arrowIcon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.perMenuItemContainer} onPress={() => {
            navigator.navigate('Help')
            onClose()
        }}>
              <View style={styles.menuTextAndIcon}>
              <MaterialIcons name="help" size={22} style={[styles.iconWithText,{marginLeft:4}]}/>
              <Text style={styles.menuText}>Help</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={14} style={styles.arrowIcon}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.perMenuItemContainer} onPress={()=>{
              navigator.navigate('Blog');
              onClose()
            }}>
              <View style={styles.menuTextAndIcon}>
              <FontAwesome6 name="blog" size={18} style={[styles.iconWithText,{marginLeft:8}]}/>
              <Text style={styles.menuText}>Blog</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={14} style={styles.arrowIcon}/>
            </TouchableOpacity>

          

        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the full screen
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black overlay
    zIndex: 99, // Below the side menu
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: "80%", // Fixed width for the menu
    height: screenHeight, // Full screen height
    backgroundColor: 'white',
    zIndex: 100, // Above the overlay
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 10,
  },
  closeButton: {
    marginBottom: 20,
  },
  closeText: {
    color: 'gray',
    fontSize: 22,
    fontFamily:"Gilroy-Regular",
    textAlign:"right"
  },
  menuContentContainer:{
    flex:1,
    padding:10
  },
  perMenuItemContainer:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    // paddingHorizontal:5,
    paddingVertical:10,
    borderBottomWidth:1,
    borderBottomColor:"#eee",
    marginVertical:10
  },
  menuTextAndIcon:{
    flexDirection:"row",
    alignItems:"center",
    gap:15
  },
  iconWithText:{
    color:"#242424",
    fontFamily:"Gilroy-SemiBold"
  },
  menuText:{
    fontSize:14,
    fontFamily:"Gilroy-SemiBold",
    color:"#484A4C",
  },
  arrowIcon:{
    color:"#181725",
    fontFamily:"Gilroy-Regular"
  }
});