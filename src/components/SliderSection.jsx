import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import {REACT_APP_IMG_URL} from '@env'

const { width } = Dimensions.get('window');

const SliderSection = ({sliderData}) => {
//    console.log(sliderData)
  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={5}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={styles.pagination}
        loop
      >
        {sliderData?.map((item) => (
          <View key={item.id} style={styles.slide}>
            {/* {banner.media_type === 'gif' ? (
              <FastImage
                source={{ uri: `${REACT_APP_IMG_URL}${banner.media_file}` }}
                style={styles.bannerImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : ( */}
              <Image
                source={{ uri: `${REACT_APP_IMG_URL}${item?.img}` }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            {/* )} */}
          </View>
        ))}
      </Swiper>
    </View>
  )
}

export default SliderSection

const styles = StyleSheet.create({
    container: {
      height: 200, // Adjust height as needed
      width: '100%',
    },
    slide: {
      width:width,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bannerImage: {
      width: width,
      height: 200, // Adjust height as needed
      resizeMode: 'cover',
    },
    dot: {
      backgroundColor: 'lightgray',
      width: 6,
      height: 6,
      borderRadius: 4,
      marginHorizontal: 3,
    },
    activeDot: {
      backgroundColor: 'green',
      width: 8,
      height: 8,
      borderRadius: 5,
      marginHorizontal: 3,
    },
    pagination: {
      bottom: 10, // Position of the dots
    },
  });