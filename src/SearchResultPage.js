import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function SearchResultPage({route, navigation}) {
  const {searchResults} = route.params;

  const renderItem = ({item}) => (
    <View style={styles.recipeItemContainer}>
      <TouchableOpacity
        style={styles.recipeItemContainer}
        onPress={() =>
          navigation.navigate('DetailRecipe', {recipeInfoAll: item})
        }>
        <Image source={{uri: item.recipePicture}} style={styles.recipeImage} />
        <Text style={styles.recipeTitle}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#2DBABC" />
        </TouchableOpacity>
        <Text style={styles.title}>Search Results</Text>
        <View style={{width: 24}}></View>
      </View>
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2DBABC',
  },
  recipeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchResultPage;
