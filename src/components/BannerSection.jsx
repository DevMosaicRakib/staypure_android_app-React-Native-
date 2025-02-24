import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BannerSlider from './BannerSlider'

const BannerSection = ({ bannerData }) => {
  return (
    <View style={styles.bannerImageContainer}>
      <BannerSlider banData={bannerData}/>
    </View>
  )
}

export default BannerSection

const styles = StyleSheet.create({
  bannerImageContainer: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 12,
  },
})