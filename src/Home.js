/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScrollView,
  StyleSheet,
  View,
  ImageBackground,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  Searchbar,
  Text,
  Avatar,
  Card,
  Button,
  Snackbar,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {setToken} from './store/slice/auth.slice';
import SearchResultPage from './SearchResultPage';

function Home(props) {
  const {navigation} = props;
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2DBABC' : Colors.lighter,
  };

  const onChangeSearch = query => {
    setSearchQuery(query);
    // Panggil fungsi handleSearch disini dengan query sebagai parameter
    handleSearch(query);
  };
  {
    /*Intergrasi database START*/
  }
  const [recipeList, setRecipeList] = React.useState([]);
  const [recipeCreated_by, setRecipeCreated_by] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLoggedIn = useSelector(state => state.auth.token !== ''); // Get the login status from Redux state
  const dispatch = useDispatch();
  const [showAllCategories, setShowAllCategories] = React.useState(false);
  const [showAllIcons, setShowAllIcons] = React.useState(false);




  // Custom function to fetch recipes
  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        'https://glorious-cow-hospital-gown.cyclic.app/recipes',
      );
      setRecipeList(response?.data?.data);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setIsRefreshing(false);
      // You can handle the error here and show an error message to the user
    }
  };

  // Custom function to fetch user recipes
  const fetchUserRecipes = async () => {
    try {
      setIsLoadingData(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        dispatch(setToken('')); // Dispatch action to update token (log out)
      } else {
        dispatch(setToken(token)); // Dispatch action to update token (log in)
        const response = await axios.get(
          'https://glorious-cow-hospital-gown.cyclic.app/recipes/profile/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setRecipeCreated_by(response.data?.data);
      }
      setIsLoadingData(false);
    } catch (error) {
      console.error('Error fetching user recipe by users:', error);
      setIsLoadingData(false);
    }
  };

  const handleRefresh = () => {
    if (isLoggedIn) {
      setIsRefreshing(true);
      // Fetch recipes again
      fetchRecipes();
      // Fetch user recipes again
      fetchUserRecipes();
    }
  };

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        dispatch(setToken(token || '')); // Dispatch action to update token
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    retrieveToken();
    fetchRecipes();
    fetchUserRecipes();
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      return; // Jangan melakukan pencarian jika query kosong
    }
    performSearch();
  };

  const performSearch = () => {
    setIsSearching(true);
    axios
      .get(`https://glorious-cow-hospital-gown.cyclic.app/recipes`, {
        params: {
          keyword: searchQuery,
          sortColumn: 'name',
        },
      })
      .then(response => {
        setIsSearching(false);
        const searchResults = response?.data?.data;
        // Lakukan navigasi hanya ketika tombol pencarian ditekan
        if (searchQuery.trim() !== '') {
          navigation.navigate('SearchResultPage', {searchResults});
        }
      })
      .catch(error => {
        console.error('Error fetching recipes:', error.message);
        setIsSearching(false);
      });
  };

  {
    /*Intergrasi database END*/
  }

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);



  // const dismissSnackbar = () => {
  //   setIsSnackbarVisible(false);
  // };

  const showSnackbar = async (categoryId) => {
    try {
      const response = await axios.get(`https://glorious-cow-hospital-gown.cyclic.app/category?categoryId=${categoryId}`);

  console.log(categoryId);

      // Navigasi ke halaman CategoryResultPage dengan membawa data hasil respons
      navigation.navigate('CategoryResultPage', {   categoryId  });
  
    } catch (error) {
      console.error("Error in showSnackbar:", error);
    }
  };
  
  
  const [categories, setCategories] = React.useState([
    { id: '1', name: 'Chicken', icon: require('./assets/icon/chicken-leg.png') },
    { id: '2', name: 'Noddles', icon: require('./assets/icon/ramen.png') },
    { id: '3', name: 'Rice', icon: require('./assets/icon/rice.png') },
    { id: '4', name: 'Meat', icon: require('./assets/icon/steak.png') },
    { id: '5', name: 'Seafood', icon: require('./assets/icon/shrimp.png') },
    { id: '6', name: 'Drink', icon: require('./assets/icon/soft-drink.png') },
    { id: '7', name: 'Vegetables', icon: require('./assets/icon/broccoli.png') },
    { id: '8', name: 'Cake', icon: require('./assets/icon/cake.png') },

  ]);
  
  return (
    <>
      <View style={{flex: 1, paddingRight: 10, paddingLeft: 10}}>
        <View
          style={{
            backgroundColor: 'rgba(245, 245, 240, 1)',
            padding: 10,
            paddingBottom: 0,
          }}>
          <Searchbar
            placeholder="Search Pasta, Bread, etc"
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
            style={{backgroundColor: '#DDDDDD', marginBottom: 20}}
            onSubmitEditing={handleSearch}
          />
        </View>

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }>
          {/* Popular Recipes */}
          <View style={{marginBottom: 35}}>
            <View style={styles.newRecipeTitle}>
              <Text variant="labelLarge" style={{fontSize: 20}}>
                New Recipes
              </Text>

              <TouchableOpacity
                style={{
                  width: 50,
                  height: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
                onPress={() => {
                  navigation.navigate('AllRecipe', {recipeInfoAll: recipeList});
                }}>
                <Text style={{color: '#6D61F2'}}>More</Text>
              </TouchableOpacity>
            </View>
            <Text
              variant="labelSmall"
              style={{fontSize: 13, fontWeight: 200, marginBottom: 10}}>
              Swipe right to see the recipe
            </Text>
            <ScrollView horizontal>
              {recipeList.slice(0, 3).map((recipe, key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() =>
                    navigation.navigate('DetailRecipe', {recipeInfoAll: recipe})
                  }>
                  <ImageBackground
                    source={{uri: recipe.recipePicture}}
                    // resizeMode="cover"
                    style={{
                      height: 150,
                      justifyContent: 'flex-end',
                      padding: 10,
                      width: 250,
                      marginRight: 10,
                    }}
                    imageStyle={{
                      borderRadius: 6,
                      resizeMode: 'cover',
                      position: 'absolute',
                      top: 0,
                    }}>
                    <View>
                      <Text
                        variant="titleLarge"
                        style={{
                          color: '#fff',
                          textShadowColor: 'rgba(0, 0, 0, 0.85)',
                          textShadowOffset: {width: -2, height: 2},
                          textShadowRadius: 10,
                          borderRadius: 10,
                          alignSelf: 'flex-start',
                          width:
                            recipe.title.length > 10
                              ? 140
                              : recipe.title.length * 10,
                          lineHeight: recipe.title.length > 10 ? 25 : undefined,
                        }}
                        numberOfLines={2}>
                        {recipe.title}
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 150,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
                onPress={() => {
                  navigation.navigate('AllRecipe', {recipeInfoAll: recipeList});
                }}>
                <Icon name="arrow-circle-right" size={30} color="#505050" />
              </TouchableOpacity>
            </ScrollView>
          </View>
          {/* End of Popular Recipes */}

          {/* New Recipes */}
          <View style={{marginBottom: 35}}>
            <View style={styles.newRecipeTitle}>
              <Text variant="labelLarge" style={{fontSize: 20}}>
                Category
              </Text>
              {!showAllIcons && categories.length > 3 && (
  <TouchableOpacity
    onPress={() => setShowAllIcons(true)}>
    <Text style={{color: '#6D61F2'}}>Show All</Text>
  </TouchableOpacity>
)}

{showAllIcons && (
  <TouchableOpacity
    onPress={() => setShowAllIcons(false)}>
    <Text style={{color: 'red'}}>Close</Text>
  </TouchableOpacity>
)}

            </View>

            {/* <View style={styles.categoryContainer}>
  <TouchableOpacity onPress={() => showSnackbar('1')} data-id="1" style={styles.categoryItem}>
    <View>
      <Avatar.Image size={60} source={require('./assets/icon.png')} />
      <Text style={styles.categoryText}>Noodles</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => showSnackbar('2')} data-id="2" style={styles.categoryItem}>
    <View>
      <Avatar.Image size={60} source={require('./assets/icon2.png')} />
      <Text style={styles.categoryText}>Vegetables</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => showSnackbar('3')} data-id="3" style={styles.categoryItem}>
    <View>
      <Avatar.Image size={60} source={require('./assets/icon.png')} />
      <Text style={styles.categoryText}>Seafood</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => showSnackbar('4')} data-id="4" style={styles.categoryItem}>
    <View>
      <Avatar.Image size={60} source={require('./assets/icon2.png')} />
      <Text style={styles.categoryText}>Drink</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => showSnackbar('5')} data-id="5" style={styles.categoryItem}>
    <View>
      <Avatar.Image size={60} source={require('./assets/icon2.png')} />
      <Text style={styles.categoryText}>Meal</Text>
    </View>
  </TouchableOpacity>
</View> */}


<View style={styles.categoryContainer}>
  {showAllIcons
    ? categories.map((category) => (
        <TouchableOpacity
          key={category.id} // Use unique IDs as keys
          onPress={() => showSnackbar(category.id.toString())}
          data-id={category.id}
          style={styles.categoryItem}>
          <View style={styles.categoryItemContent}>
            <Avatar.Image size={60} source={category.icon} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        </TouchableOpacity>
      ))
    : categories.slice(0, 4).map((category) => (
        <TouchableOpacity
          key={category.id} // Use unique IDs as keys
          onPress={() => showSnackbar(category.id.toString())}
          data-id={category.id}
          style={styles.categoryItem}>
          <View style={styles.categoryItemContent}>
            <Avatar.Image size={60} source={category.icon} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
</View>










          </View>
          {/* End of New Recipes */}

          {/* Recipe  your */}
          <View>
            <Text variant="labelLarge" style={{fontSize: 20, marginBottom: 15}}>
              My Recipe
            </Text>

            {isLoadingData ? (
              <ActivityIndicator
                size="large"
                color="#2DBABC"
                style={{marginTop: 20}}
              />
            ) : (
              <>
                {isLoggedIn ? (
                  recipeCreated_by.length > 0 ? (
                    <ScrollView horizontal>
                      {recipeCreated_by.slice(0, 6).map((recipe, key) => (
                        <TouchableOpacity
                          key={key}
                          onPress={() =>
                            navigation.navigate('DetailRecipe', {
                              recipeInfoAll: recipe,
                            })
                          }>
                          <ImageBackground
                            source={{uri: recipe.recipePicture}}
                            // resizeMode="cover"
                            style={{
                              height: 150,
                              justifyContent: 'flex-end',
                              padding: 10,
                              width: 250,
                              marginRight: 10,
                              marginBottom: 10,
                            }}
                            imageStyle={{
                              borderRadius: 6,
                              resizeMode: 'cover',
                              position: 'absolute',
                              top: 0,
                            }}>
                            <View>
                              <Text
                                variant="titleLarge"
                                style={{
                                  color: '#fff',
                                  textShadowColor: 'rgba(0, 0, 0, 0.85)',
                                  textShadowOffset: {width: -2, height: 2},
                                  textShadowRadius: 10,
                                  borderRadius: 10,
                                  alignSelf: 'flex-start',
                                  width:
                                    recipe.title.length > 10
                                      ? 140
                                      : recipe.title.length * 10,
                                  lineHeight:
                                    recipe.title.length > 10 ? 25 : undefined,
                                }}
                                numberOfLines={2}>
                                {recipe.title}
                              </Text>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={{textAlign: 'center', marginTop: 20}}>
                      You don't have a recipe yet, let's make one
                    </Text>
                  )
                ) : (
                  <Card>
                    <Card.Content>
                      <Text
                        variant="titleMedium"
                        style={{
                          marginTop: 10,
                          alignSelf: 'center',
                        }}>
                        You must be logged in to view this section
                      </Text>

                      <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Login')}
                        style={{
                          marginTop: 10,
                          alignSelf: 'center',
                          backgroundColor: '#2DBABC',
                        }}>
                        Login
                      </Button>
                    </Card.Content>
                  </Card>
                )}
              </>
            )}
          </View>

          {/* End of Popular For you */}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  newRecipeTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap', // to wrap categories when necessary
  },
  categoryItem: {
    width: '23%', // adjust the width according to your preference
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryItemContent: {
    alignItems: 'center',
  },
  categoryText: {
    textAlign: 'center',
    marginTop: 5,
  },
});


export default Home;
