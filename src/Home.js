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
import {Searchbar, Text, Avatar, Card, Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {setToken} from './store/slice/auth.slice';
import { foodData } from './AllRecipe';

function Home(props) {
  const {navigation} = props;
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2DBABC' : Colors.lighter,
  };

  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);

  {
    /*Intergrasi database START*/
  }
  const [recipeList, setRecipeList] = React.useState([]);
  const [recipeCreated_by, setRecipeCreated_by] = React.useState([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLoggedIn = useSelector(state => state.auth.token !== ''); // Get the login status from Redux state
  const dispatch = useDispatch();

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
    axios
      .get(`https://glorious-cow-hospital-gown.cyclic.app/recipes`, {
        params: {
          keyword,
          sortColumn: 'name',
        },
      })
      .then(response => setRecipeList(response?.data?.data));
  };

  {
    /*Intergrasi database END*/
  }

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
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{backgroundColor: '#DDDDDD', marginBottom: 20}}
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
            <Text variant="labelLarge" style={{fontSize: 20}}>
              Recipes
            </Text>
            <Text
              variant="labelSmall"
              style={{fontSize: 13, fontWeight: 200, marginBottom: 10}}>
        Swipe right for all recipes
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
                  navigation.navigate('AllRecipe', { recipeInfoAll: recipeList  });
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
              {/* <Text style={{color: '#6D61F2'}}>More info</Text> */}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View>
                <Avatar.Image
                  size={60}
                  source={require('./assets/icon.png')}
                  // style={{borderRadius: 20, backgroundColor: '#57ce96'}}
                />
                <Text style={{textAlign: 'center', marginTop: 5}}>Soup</Text>
              </View>
              <View>
                <Avatar.Image
                  size={60}
                  source={require('./assets/icon2.png')}
                  // style={{borderRadius: 20, backgroundColor: '#fde901'}}
                />
                <Text style={{textAlign: 'center', marginTop: 5}}>Chicken</Text>
              </View>
              <View>
                <Avatar.Image
                  size={60}
                  source={require('./assets/icon.png')}
                  // style={{borderRadius: 20, backgroundColor: '#57ce96'}}
                />
                <Text style={{textAlign: 'center', marginTop: 5}}>Seafood</Text>
              </View>
              <View>
                <Avatar.Image
                  size={60}
                  source={require('./assets/icon2.png')}
                  // style={{borderRadius: 20, backgroundColor: '#fde901'}}
                />
                <Text style={{textAlign: 'center', marginTop: 5}}>Dessert</Text>
              </View>
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
                          lineHeight: recipe.title.length > 10 ? 25 : undefined,
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
                      You don't have any recipes yet
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
});

export default Home;
