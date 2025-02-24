import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const [triangleOpacity] = useState(new Animated.Value(0)); // Animation for triangles' opacity

  useEffect(() => {
    // Animate the triangles' opacity
    Animated.timing(triangleOpacity, {
      toValue: 1,
      duration: 2500, // Animation duration (2 seconds)
      useNativeDriver: true,
    }).start();
  }, [triangleOpacity]);

  return (
    <View style={styles.container}>
      {/* Top Right Green Triangle */}
      <Animated.View
        style={[
          styles.triangle,
          styles.topRightTriangle,
          { opacity: triangleOpacity, backgroundColor: '#4CAF50' },
        ]}
      />
      {/* Bottom Left Green Triangle */}
      <Animated.View
        style={[
          styles.triangle,
          styles.bottomLeftTriangle,
          { opacity: triangleOpacity, backgroundColor: '#4CAF50' },
        ]}
      />
      {/* Logo */}
      <Image
        source={require('../assets/img/Logo.png')} // Replace with the path to your logo
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background for diagonal space
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    position: 'absolute',
    width: screenWidth * 1.4, // Larger than screen to ensure coverage
    height: screenHeight * 1.3,
    transform: [{ rotate: '45deg' }], // Rotate to form triangle shape
  },
  topRightTriangle: {
    top: -screenHeight * 0.88, // Positioned to cover top-right
    right: -screenWidth * 1.3,
    // backgroundColor:"#4CAF50"
  },
  bottomLeftTriangle: {
    bottom: -screenHeight * 0.88, // Positioned to cover bottom-left
    left: -screenWidth * 1.3,
  },
  logo: {
    width: 200, // Adjust the logo size as needed
    height: 200,
    zIndex: 1, // Place the logo above the triangles
  },
});
