import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard';
import { useNavigation } from '@react-navigation/native';

const ProducSection = ({ product_section_data, device, allProductsData,openModal }) => {
  const navigation = useNavigation();
  const [filterSectionProducts,setFilterSectionsProducts] = useState([])

  useEffect(() => {
    if (product_section_data?.product_section?.category?.length > 0) {
      const selectedCategory = product_section_data?.product_section?.category[0];
      const subCategories = selectedCategory?.sub_categories?.sort((a, b) => a.order - b.order) || [];

      // Filter products based on the category
      let filtered = allProductsData?.filter(
        (product) => product?.Category?.catname === selectedCategory.catname
      ) || [];

      // Sort filtered products by subcategory order
      filtered.sort((a, b) => {
        const subA = subCategories.findIndex(sub => sub.subcatname === a?.Sub_category?.subcatname);
        const subB = subCategories.findIndex(sub => sub.subcatname === b?.Sub_category?.subcatname);
        return (subA !== -1 ? subA : Infinity) - (subB !== -1 ? subB : Infinity);
      });

      setFilterSectionsProducts(filtered);
    }
  }, [allProductsData, product_section_data]);
  return (
    <View>
      <View style={styles.productSectionHeadingTextContainer}>
        <Text style={styles.productHeadingText}>{product_section_data.product_section.title}</Text>
        <TouchableOpacity onPress={() => { navigation.navigate("Products_show", { Name: product_section_data.product_section.title, Products: filterSectionProducts, device: device, openModal: openModal }); }}>
          <Text style={styles.smallText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={filterSectionProducts?.slice(0, Number(product_section_data?.product_section?.product_limitation))}
        renderItem={({ item }) => <ProductCard item={item} device={device} openModal={openModal} />}
        // horizontal
        // showsHorizontalScrollIndicator={false}
        numColumns={3}
        nestedScrollEnabled={true}
        style={{ marginTop: 20}}
      />
    </View>
  );
}

export default ProducSection

const styles = StyleSheet.create({
  productSectionHeadingTextContainer: {
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "space-between",
  },
  productHeadingText: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#242424",
  },
  smallText: {
    fontSize: 12,
    fontFamily: "Gilroy-SemiBold",
    color: "#53B175",
  },
})