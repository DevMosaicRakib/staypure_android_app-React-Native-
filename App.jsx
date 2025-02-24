import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import AccountScreen from './src/screens/AccountScreen';
import SideMenu from './src/components/SideMenu';
import FilterPopup from './src/components/FilterPopup';
import SplashScreen from './src/components/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import SubCategoryScreen from './src/screens/SubCategoryScreen';
import ProductsShowScreen from './src/screens/ProductsShowScreen';
import LoginScreen from './src/screens/LoginScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SendResetPasswordEmailScreen from './src/screens/SendResetPasswordEmailScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import UserProfileEdit from './src/components/UserProfileEdit';
import OrdersScreen from './src/screens/OrdersScreen';
import MyDetailsScreen from './src/screens/MyDetailsScreen';
import DeliveryScreen from './src/screens/DeliveryScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import HelpScreen from './src/screens/HelpScreen';
import AboutScreen from './src/screens/AboutScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';
import OrderFailedScreen from './src/screens/OrderFailedScreen';
import SetPasswordScreen from './src/screens/SetPasswordScreen';
import SetLoginScreen from './src/screens/SetLoginScreen';
import Search from './src/components/Search';
import BlogScreen from './src/screens/BlogScreen';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from './src/Redux/UserAndAuthServices/LocalStorageService';
import { setUserToken } from './src/Redux/AuthAndUserSlice/authSlice';
import { useFetchCartItemsQuery } from './src/Redux/CartSlice/cartApi';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {REACT_APP_API_URL} from '@env'
import CheckoutModal from './src/components/CheckoutModal';
import CartPopUpModal from './src/components/CartPopUpModal';
const Tab = createBottomTabNavigator();

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 7000); // 7 seconds

    return () => clearTimeout(timer);
  }, []);
  const [cartPopModalOpen,setCartPopModalOpen] = useState(false)
  const [sameDay, setSameDay] = useState(false);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [checkPd, setCheckPd] = useState(false);

  // Function to open modal and set data
  const openModal = (data) => {
    setModalData(data);
    setCartPopModalOpen(true);
  };
  const checkoutFromProudctDetails = (data)=>{
    setCheckPd(data);
  }
  const { data: cartItems, error, isLoading, refetch } = useFetchCartItemsQuery();
  console.log(cartItems)


  const totalCartItems = cartItems?.length || 0;


  
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deviceIdState, setDeviceIdState] = useState('');
  const dispatch = useDispatch()
  useEffect(() => {
    const loadToken = async () => {
        // const token = await AsyncStorage.getItem('access_token');
        const {access_token} = await getToken()
        console.log("loadToken",access_token)
        if (access_token) {
          dispatch(setUserToken({ access_token: access_token })); // Dispatch action to set token in Redux
        }
    };

    loadToken();
  }, [dispatch]);



  const { access_token } = useSelector(state => state.auth)
  console.log("App access",access_token)



  if (isSplashVisible) {
    return <SplashScreen />;
  }



  // Function to generate a UUID
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // Function to get the device ID from AsyncStorage
  async function getDeviceId() {
    try {
        const deviceId = await AsyncStorage.getItem('device');
        return deviceId;
    } catch (error) {
        console.error("Error retrieving device ID", error);
        return null;
    }
  }

  // Function to set the device ID in AsyncStorage
  async function setDeviceId(deviceId) {
    try {
        await AsyncStorage.setItem('device', deviceId);
    } catch (error) {
        console.error("Error saving device ID", error);
    }
  }

  // Main function to check and set the device ID
  const checkAndSetDeviceId = async () => {
    let device = await getDeviceId();
    if (!device) {
        device = uuidv4(); // Generate a new UUID
        await setDeviceId(device); // Store the new device ID
    }
    setDeviceIdState(device)
    // console.log('deviceIdState', deviceIdState)
    // Now you can use the device ID
    // console.log('Device ID:', device);
  };

  // Call the function to check and set the device ID
  checkAndSetDeviceId();


  // useEffect(async ()=>{
  //   const Did = await getDeviceId();
  //   setDeviceIdState(Did)
  // },[])

  // console.log('deviceIdState', deviceIdState)

  // Stack Navigator Start

  const Stack = createNativeStackNavigator();

  // Stack Navigator component for product details page 

  const MyHomeStack = ({ menuOpen, setMenuOpen, filterPopupOpen, setFilterPopupOpen,device }) => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home_stack"
          options={{ headerShown: false }} // Hide the header for HomeScreen
        >
          {() => (
            <HomeScreen
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              filterPopupOpen={filterPopupOpen}
              setFilterPopupOpen={setFilterPopupOpen}
              openModal={openModal}
              device={device}
            />
          )}
        </Stack.Screen>
       
        <Stack.Screen
        name="Product_details"
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '#fff', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => {
                if (!navigation.canGoBack()) {
                    // If there's no screen to go back to, reset the navigation stack to 'Explore'
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'Explore',
                                },
                            ],
                        })
                    );
                } else {
                    // If there is a screen to go back to, go back
                    navigation.goBack();
                }
            }} // Navigate back to the previous screen
            />
          ),
        })}
      >
        {() => (
            <ProductDetailsScreen
              // device={device}
              setIsModalOpen={setIsModalOpen}
              sameDay={sameDay}
              setSameDay={setSameDay}
              checkoutFromProudctDetails={checkoutFromProudctDetails}
            />
          )}

      </Stack.Screen>
        <Stack.Screen
        name="Sub_categories"
        component={SubCategoryScreen}
        options={({ route, navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: route.params?.categoryName,
          headerStyle: {
            backgroundColor: '', // Customize the background color if needed
          },
          headerTitleStyle:{
            fontSize:18,
            fontFamily:"Gilroy-SemiBold",
            color:"#242424",
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold",marginRight:10 }} // Add some margin for better spacing
              onPress={() => {
                if (!navigation.canGoBack()) {
                    // If there's no screen to go back to, reset the navigation stack to 'Explore'
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'Home',
                                },
                            ],
                        })
                    );
                } else {
                    // If there is a screen to go back to, go back
                    navigation.goBack();
                }
            }} // Navigate back to the previous screen
            />
          ),
        })}
      />
        <Stack.Screen
        name="Products_show"
        component={ProductsShowScreen}
        options={({ route, navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: route.params?.Name,
          headerStyle: {
            backgroundColor: '', // Customize the background color if needed
          },
          headerTitleStyle:{
            fontSize:18,
            fontFamily:"Gilroy-SemiBold",
            color:"#242424",
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold",marginRight:10 }} // Add some margin for better spacing
              onPress={() => {
                if (!navigation.canGoBack()) {
                    // If there's no screen to go back to, reset the navigation stack to 'Explore'
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'Home',
                                },
                            ],
                        })
                    );
                } else {
                    // If there is a screen to go back to, go back
                    navigation.goBack();
                }
            }} // Navigate back to the previous screen
            />
          ),
        })}
      />
      <Stack.Screen 
        name="Blog"
        component={BlogScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '#f9f9f9', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => {
                if (!navigation.canGoBack()) {
                    // If there's no screen to go back to, reset the navigation stack to 'Explore'
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'Home',
                                },
                            ],
                        })
                    );
                } else {
                    // If there is a screen to go back to, go back
                    navigation.goBack();
                }
            }} // Navigate back to the previous screen
            />
          ),
        })}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => {
                if (!navigation.canGoBack()) {
                    // If there's no screen to go back to, reset the navigation stack to 'Explore'
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'Home',
                                },
                            ],
                        })
                    );
                } else {
                    // If there is a screen to go back to, go back
                    navigation.goBack();
                }
            }} // Navigate back to the previous screen
            />
          ),
        })}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => {
                if (!navigation.canGoBack()) {
                    // If there's no screen to go back to, reset the navigation stack to 'Explore'
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'Home',
                                },
                            ],
                        })
                    );
                } else {
                    // If there is a screen to go back to, go back
                    navigation.goBack();
                }
            }} // Navigate back to the previous screen
            />
          ),
        })}
      />

      </Stack.Navigator>
    );
  }; 

  const AccountNavigator = ({}) => {
    return (
      <Stack.Navigator>
      {/* Group screens for logged-in users */}
      <Stack.Group>
        {access_token && (
          <Stack.Screen
            name="UserProfile"
            options={{ headerShown: false }}
          >
            {() => (
              <UserProfileScreen
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            )}
          </Stack.Screen>
          
        )}
      </Stack.Group>

      {/* Group screens for logged-out users */}
      <Stack.Group>
        {!access_token && (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {() => (
              <LoginScreen
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            )}
          </Stack.Screen>
        )}
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendResetPasswordEmail"
          component={SendResetPasswordEmailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
      <Stack.Screen 
        name="UserProfileEdit"
        component={UserProfileEdit}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
            />
          ),
        })}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: 'My Orders', // Keep the title empty
          headerTitleStyle:{
            fontSize:18,
            fontFamily:"Gilroy-SemiBold",
            color:"#242424"
          },
          headerStyle: {
            backgroundColor: '#F9F9F9', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
            />
          ),
        })}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '#F9F9F9', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
            />
          ),
        })}
      />
      <Stack.Screen
        name="My_details"
        component={MyDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
            />
          ),
        })}
      />
      <Stack.Screen
        name="Deliver_address"
        component={DeliveryScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
            />
          ),
        })}
      />
      <Stack.Screen
        name="Change_password"
        component={ChangePasswordScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: '', // Keep the title empty
          headerStyle: {
            backgroundColor: '', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
            />
          ),
        })}
      />

      <Stack.Screen
        name="setPassword"
        component={SetPasswordScreen}
        options={() => ({
          headerShown: false, // Show the header
        })}
      />
      <Stack.Screen
            name="setLogin"
            options={{ headerShown: false }}
          >
            {() => (
              <SetLoginScreen/>
            )}
          </Stack.Screen>
    </Stack.Navigator>
    )
  };

  const CartAndCheckoutNavigator = ()=>{
    return (
      <Stack.Navigator
      initialRouteName="Cart_stack" // Initial screen when Basket tab is clicked
    >
      <Stack.Screen
        name="Cart_stack"
        // component={CartScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: 'My Cart',
          headerTitleStyle:{
            fontSize:18,
            fontFamily:"Gilroy-SemiBold",
            textAlign:"center",
            // marginLeft:110,
            color:"#242424"
            // backgroundColor:"red"
          },
          headerStyle: {
            backgroundColor: '#fff', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
            />
          ),

        })}
      >
        {()=>(
          <CartScreen 
           device={deviceIdState}
           isModalOpen={isModalOpen}
           setIsModalOpen={setIsModalOpen}
           setSameDay={setSameDay}
           checkoutFromProudctDetails={checkoutFromProudctDetails}
          //  cartItems={cartItems}
          //  refetch={refetch}
           
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Checkout"
        // component={CheckoutScreen}
        options={({ navigation }) => ({
          headerShown: true, // Show the header
          headerTitle: 'Checkout',
          headerTitleStyle:{
            fontSize:18,
            fontFamily:"Gilroy-SemiBold",
            textAlign:"center",
            // marginLeft:110,
            color:"#242424"
            // backgroundColor:"red"
          },
          headerStyle: {
            backgroundColor: '#f9f9f9', // Customize the background color if needed
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={26}
              color="#242424" // Customize the color
              style={{ marginLeft: 0,fontFamily:"Gilroy-SemiBold" }} // Add some margin for better spacing
              onPress={() => navigation.goBack()} // Navigate back to the previous screen
            />
          ),

        })}
      >
        {()=>(
          <CheckoutScreen
          device={deviceIdState}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={() => ({
          headerShown: false, // Show the header
        })}
      />
      <Stack.Screen
        name="OrderFailed"
        component={OrderFailedScreen}
        options={() => ({
          headerShown: false, // Show the header
        })}
      />
    </Stack.Navigator>
    )
  }

  const CartIconWithBadge = ({ size, color, totalItems }) => {

    return (
      <View style={styles.iconContainer}>
        <EvilIcons name="cart" size={size} color={color} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView >
      <NavigationContainer>
        <View style={[styles.container, { zIndex: menuOpen ? 0 : 100 }]}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: "#53B175",
              tabBarInactiveTintColor: "#181725",
              tabBarStyle: {
                height: 92,
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                backgroundColor: "#FFFFFF",
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                shadowColor: "#242424",
                shadowOpacity: 1,
                shadowRadius: 20,
                elevation: 5,
                paddingHorizontal: 12,
                alignItems: "center",
              },
              tabBarItemStyle: {
                justifyContent: "center",
                marginTop: 15,
              },
              tabBarLabelStyle: {
                fontSize: 13,
                fontFamily: "Gilroy-SemiBold",
                color:"#242424"
              },
              tabBarIconStyle: {
                marginBottom: 0,
              },
            }}
          >
            <Tab.Screen
              name="Home"
              options={{
                tabBarIcon: ({ size, color }) => (
                  <Entypo name="home" size={20} color={color} />
                ),
                headerShown: false,
              }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                    e.preventDefault(); // Prevent default action
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        })
                    );
                },
            })}
            >
              {() => (
                <MyHomeStack
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  filterPopupOpen={filterPopupOpen}
                  setFilterPopupOpen={setFilterPopupOpen}
                  device={deviceIdState}
                />
              )}
            </Tab.Screen>
            <Tab.Screen
              name="Explore"
              component={Search}
              options={{
                headerShown:false,
                tabBarIcon: ({ size, color }) => (
                  <MaterialIcons name="manage-search" size={24} color={color} />
                ),
              }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                    e.preventDefault(); // Prevent default action
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Explore' }],
                        })
                    );
                },
            })}
            />
                  <Tab.Screen
                  name="Cart"
                  component={CartAndCheckoutNavigator} // Use the custom navigator here              
                  options={{
                    headerShown:false,
                    tabBarIcon: ({ size, color }) => (
                      // <FontAwesome name="shopping-basket" size={22} color={color} />
                      <CartIconWithBadge size={25} color={color} totalItems={totalCartItems}/>
                    ),
                  }}
                  listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault(); // Prevent default action
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Cart' }],
                            })
                        );
                    },
                })}
                />

            <Tab.Screen
              name="Account"
              component={AccountNavigator}
              options={{
                tabBarIcon: ({ size, color }) => (
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={23}
                    color={color}
                  />
                ),
                headerShown: false,
              }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                    e.preventDefault(); // Prevent default action
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Account' }],
                        })
                    );
                },
            })}
            />

          </Tab.Navigator>

          {menuOpen && (
            <View style={[styles.overlay, { zIndex: 9999 }]}>
              <SideMenu isOpen={menuOpen} 
              onClose={() => setMenuOpen(false)} 
              device={deviceIdState}
              openModal={openModal}
              />
            </View>
          )}
          {/* Filter Pop up start */}
          {filterPopupOpen && (
            <View style={[styles.overlay, { zIndex: 9999 }]}>
              <FilterPopup
                isOpen={filterPopupOpen}
                onClose={() => setFilterPopupOpen(false)}
                device={deviceIdState}
                openModal={openModal}
              />
            </View>
          )}

            {/* CheckoutModal */}
            {isModalOpen && (
              <CheckoutModal 
              isModalOpen={isModalOpen} 
              setIsModalOpen={setIsModalOpen} 
              sameDay={sameDay}
              checkPd={checkPd}
              />
            )}
            {/* CartPopUpModal */}
            {cartPopModalOpen && (
              <CartPopUpModal 
              device={deviceIdState}
              cartPopModalOpen={cartPopModalOpen} 
              data={modalData} 
              closeModal={() => setCartPopModalOpen(false)}
              />
            )}
        </View>
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  iconContainer: {
    position: 'relative',
    // width: 30, 
    // height: 30,
  },
  badge: {
    position: 'absolute',
    right: -7, // Adjust to position the badge correctly
    top: -7, // Adjust to position the badge correctly
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily:"Gilroy-SemiBold",
  },
});

export default App;
