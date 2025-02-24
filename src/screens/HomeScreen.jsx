import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import { FlatList } from 'react-native-gesture-handler';
import ProductCard from '../components/ProductCard';
import BannerSlider from '../components/BannerSlider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { REACT_APP_API_URL, REACT_APP_IMG_URL } from '@env';
import useFetch from '../CustomHooks/useFetch';
import axios from 'axios';
import ProducSection from '../components/ProducSection';
import BannerSection from '../components/BannerSection';
import SliderSection from '../components/SliderSection';


const HomeScreen = ({ menuOpen, setMenuOpen, filterPopupOpen, setFilterPopupOpen,device,openModal }) => {
  const [hData, setHData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [productSections, setProductSections] = useState(null);
  const [bannerSections, setBannerSections] = useState(null);
  // const [allProductsData, setAllProductsData] = useState([]);
  // const [catData, setCatData] = useState(null); // Moved to top level
  const navigation = useNavigation(); // Moved to top level

  // Fetch home data and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${REACT_APP_API_URL}sp/api/home/`);

        setHData(res.data);
        // setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const catData = useFetch('sp/api/categories/')
  const allProductsData = useFetch('sp/api/products/')
  const sliderData = useFetch('sp/api/sliderImg/')
  // console.log(sliderData)

  useEffect(() => {
    if (hData && hData.length > 0) {
      setProductSections(hData[0]?.product_section || []);
      setBannerSections(hData[0]?.banner_section || []);
    }
  }, [hData]);

  // if (isLoading) {
  //   return <Text>Loading...</Text>; // Show a loading indicator
  // }

  // Merge sections alternately
  const mergedSections = [];
  const maxLength = Math.max(productSections?.length || 0, bannerSections?.length || 0);

  for (let i = 0; i < maxLength; i++) {
    if (i < (productSections?.length || 0)) {
      mergedSections.push({
        type: "product",
        data: productSections[i],
      });
    }
    if (i < (bannerSections?.length || 0)) {
      mergedSections.push({
        type: "banner",
        data: bannerSections[i],
      });
    }
  }

    // Combine category section and merged sections into a single array
const combinedData = [
  { type: 'slider', data: sliderData },
  { type: 'category', data: catData },
  ...mergedSections.map((section, index) => ({ ...section, key: `section-${index}` }))
];
  
    const renderItem = ({ item }) => {
      if (item.type === 'slider' && item.data) {
        return (
          <View style={styles.sliderSectionContainer}>
            <SliderSection sliderData={item.data} />
          </View>
        );
      }
      if (item.type === 'category') {
        return (
          <View style={styles.categoryContainer}>
            <View style={styles.iconHeadingContainer}>
              <Feather name="grid" size={20} color="#242424" />
              <Text style={styles.headingText}>Categories</Text>
            </View>
            <View style={styles.flatlistCategoryTextContainer}>
              <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={item.data}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Sub_categories', {
                        categoryName: item.catname,
                        subCategories: item.sub_categories,
                        device: device,
                        openModal:openModal
                      })
                    }
                  >
                    <Text style={styles.categoryText}>{item.catname}</Text>
                  </TouchableOpacity>
                )}
                numColumns={3}
                nestedScrollEnabled
              />
            </View>
          </View>
        );
      }
  
      if (item.type === 'product') {
        return (
          <View style={styles.productSectionContainer}>
            <ProducSection
              product_section_data={item.data}
              device={device}
              allProductsData={allProductsData}
              openModal={openModal}
            />
          </View>
        );
      }
  
      if (item.type === 'banner') {
        return item.data.banner_type !== 'logo' && item.data.banner_type !== 'service' ? (
          <View style={styles.bannerSectionContainer}>
            <BannerSection bannerData={item.data} />
          </View>
        ) : null;
      }
  
      return null;
    };
  return (
    <View style={styles.container}>
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        filterPopupOpen={filterPopupOpen}
        setFilterPopupOpen={setFilterPopupOpen}
      />
      <FlatList
      data={combinedData}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.key || `item-${index}`}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 120,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  categoryContainer: {
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  iconHeadingContainer: {
    flexDirection:"row",
    gap:15,
    alignItems:"center",
    justifyContent:"flex-start",
    textAlign:"left",
    width:"100%"
  },
  headingText: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#242424",
  },
  flatlistCategoryTextContainer: {
    width:"100%",
    overflow:"hidden",
    alignItems:"center",
    // backgroundColor:"red"
  },
  categoryText: {
    width: 106,
    height: 50,
    fontSize: 11,
    fontFamily: "Gilroy-SemiBold",
    backgroundColor: "#DFDCDC",
    borderWidth: 1,
    borderColor: "#53B175",
    paddingHorizontal: 10,
    textAlign: "center",
    textAlignVertical: "center", // For Android
    justifyContent: "center", // Required if inside a flex container
    alignItems: "center", // Required if inside a flex container
    marginTop: 15,
    marginHorizontal: 2.5,
    borderRadius: 16
},
  productSectionContainer: {
    marginTop: 30,
    // paddingHorizontal: 5,
    alignItems:"center"
  },
  sliderSectionContainer: {
    width: "100%",
    marginTop: 100,
    paddingHorizontal: 10,
  },
});
