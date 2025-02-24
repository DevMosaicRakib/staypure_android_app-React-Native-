import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SideMenu from './SideMenu';

const Header = ({menuOpen,setMenuOpen,filterPopupOpen,setFilterPopupOpen}) => {
  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleFilterPopup = () => {
    setFilterPopupOpen(!filterPopupOpen)
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContentContainer}>
        <TouchableOpacity onPress={toggleMenu}>
          <Entypo name={'menu'} size={27} color={'#181725'} />
        </TouchableOpacity>

        <View>
          <Image
            source={require('../assets/img/Logo.png')}
            style={styles.logo}
          />
        </View>

        <View>
          <TouchableOpacity onPress={toggleFilterPopup}>
          {/* <MaterialCommunityIcons
            name={'filter-variant'}
            size={30}
            color={'#181725'}
          /> */}
          <Image 
           source={require('../assets/img/icon_image/filter.png')}
           style={styles.icon_image}
          />
          </TouchableOpacity>
        </View>
      </View>
      
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 92,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    shadowColor: '#242424',
    shadowOpacity: 0.35,
    position: 'absolute', // Ensure proper layering
    top:0,
    left:0,
    rigth:0,
    paddingHorizontal:12,
    zIndex:9999
  },
  headerContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 125,
    height: 125,
    resizeMode: 'contain',
  },
  icon_image:{
    width:20,
    height:21,
  }
});
