import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Install react-native-vector-icons
import { useDispatch, useSelector } from 'react-redux';
import { useGetLoggedUserQuery } from '../Redux/UserAndAuthServices/userAuthApi';
import { setUserInfo, unsetUserInfo } from '../Redux/AuthAndUserSlice/userSlice';
import { unSetUserToken } from '../Redux/AuthAndUserSlice/authSlice';
import { removeToken } from '../Redux/UserAndAuthServices/LocalStorageService';
import {REACT_APP_IMG_URL} from '@env';
import { useFetchCartItemsQuery } from '../Redux/CartSlice/cartApi';

const UserProfileScreen = ({isLoggedIn,setIsLoggedIn}) => {
  const { data: cartItems, error, refetch } = useFetchCartItemsQuery();
  const { access_token } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const {
    data,
    isSuccess,
    refetch: profilerefetch,
  } = useGetLoggedUserQuery(access_token);
  // console.log(data)

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    profile_picture: null,
  });
  useEffect(() => {
    if (data && isSuccess) {
      setUserData({
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        profile_picture: data.profile_picture,
      });

      // console.log(userData);
    }
  }, [data, isSuccess]);

  // Store User Data in Redux Store
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(
        setUserInfo({
          email: data.email,
          username: data.username,
        })
      );
    }
  }, [data, isSuccess, dispatch]);

  // LogOut Function
  const handleLogout = async () => {
    dispatch(unsetUserInfo({ name: "", email: "" }));
    dispatch(unSetUserToken({ access_token: null }));
    await removeToken();
    if (!access_token) {
      refetch()
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  useEffect(()=>{
    profilerefetch()
  },[])
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{
            navigation.navigate('UserProfileEdit',{userData})
          }}>
          <Image
            source={{uri: REACT_APP_IMG_URL + userData.profile_picture}} // Replace with profile image URL
            style={styles.profileImage}
          />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <View style={styles.nameandeditIconView}>
            <Text style={styles.userName}>{userData.username}</Text>
            <View>
            <TouchableOpacity style={styles.editIcon} onPress={()=>{
              navigation.navigate('UserProfileEdit',{userData})
            }}>
            <Icon name="edit" size={18} color="#53B175" />
            </TouchableOpacity>
            </View>
            </View>
            
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>
          
        </View>

        <View style={styles.menuItemContainer}>
          <MenuItem title="Orders" iconName="receipt" onPress={() => navigation.navigate('Orders')}/>
          <MenuItem title="Account Details" iconName="person" onPress={() => navigation.navigate('My_details',{userData})}/>
          <MenuItem title="Delivery Address" iconName="location-on" onPress={() => navigation.navigate('Deliver_address')}/>
          <MenuItem title="Change Password" iconName="lock" onPress={() => navigation.navigate('Change_password',{access_token})}/>
          <MenuItem title="Help" iconName="help" onPress={() => navigation.navigate("Home",{screen:'Help'})}/>
          <MenuItem title="About" iconName="info" onPress={() => navigation.navigate('Home',{screen:'About'})}/>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={17} color="#53B175" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
};
const MenuItem = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuContent}>
      <Icon name={iconName} size={22} color="#333" style={styles.menuIcon} />
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <Icon name="chevron-right" size={24} color="#666" />
  </TouchableOpacity>
);

export default UserProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical:35,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth:2,
    borderColor:"#53B175"
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily:"Gilroy-Bold"
  },
  nameandeditIconView:{
    flexDirection:"row",
    alignItems:"center",
    gap:10
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    fontFamily:"Gilroy-SemiBold"
  },
  editIcon: {
    marginLeft:"auto"
  },
  menuItemContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
    fontFamily:"Gilroy-SemiBold"
  },
  menuTitle: {
    fontSize: 14,
    color: '#333',
    fontFamily:"Gilroy-SemiBold"
  },
  logoutButton: {
    width:"90%",
    marginTop: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#53B175',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    flexDirection:"row",
    alignContent:"center",
    gap:20,
    justifyContent:"center"
  },
  logoutText: {
    color: '#53B175',
    fontSize: 14,
    textAlign:"center",
    fontFamily:"Gilroy-SemiBold"
  },
});