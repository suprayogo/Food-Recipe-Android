/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Text, List, Button} from 'react-native-paper';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';

function Profile(props) {
  const {navigation} = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = React.useState([]);

  {
    /*  Intergrasi of start */
  }

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://glorious-cow-hospital-gown.cyclic.app/token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data?.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  {
    /*  Intergrasi of End */
  }

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        // console.log(token);
        setIsLoggedIn(token !== null);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    retrieveToken();
  }, []);

  
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setIsLoggedIn(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }], // Replace 'Home' with the initial route of your bottom tab navigator
      });
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };


  return (
    <>
      {!isLoggedIn ? ( // Conditional rendering based on the isLoggedIn state
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 10}}>
            You are not logged in {'\n'} Please login to view your profile.
          </Text>
          <Button
            mode="contained"
            onPress={() => props.navigation.navigate('Login')}
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 10,
              backgroundColor: '#2DBABC',
            }}>
            Login
          </Button>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
          }}>
          {/* Header Background */}
          <View
            style={{
              flex: 0.8,
              width: '100%',
              backgroundColor: '#2DBABC',
              // backgroundColor: 'gray',
            }}>
            <Image
              source={{uri: profile.profilePicture}}
              style={{
                width: 150,
                height: 150,
                resizeMode: 'contain',
                borderRadius: 100,
                overflow: 'hidden',
                alignSelf: 'center',
                marginTop: 40,
                marginBottom: 30,
                borderColor: 'white',
                borderWidth: 3,
              }}
            />
            <Text
              variant="titleLarge"
              style={{
                marginBottom: 7,
                fontSize: 25,
                color: 'white',
                alignSelf: 'center',
                fontWeight: 'bold',
              }}>
              {profile.fullname}
            </Text>
          </View>
          {/* End of Header Background */}

          {/* Main Content */}
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
              minWidth: '95%',
              width: '50%',
              backgroundColor: 'white',
              marginTop: -50,
              borderRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}>
            <ScrollView>
              <View>
                <List.Item
                  title="Edit Profile"
                  left={props => (
                    <List.Icon {...props} icon="account" color="#2DBABC" />
                  )}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
              </View>

              <View>
                <List.Item
                  title="My Recipe"
                  left={props => (
                    <List.Icon {...props} icon="medal" color="#2DBABC" />
                  )}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
              </View>

              <View>
                <List.Item
                  title="Saved Recipe"
                  left={props => (
                    <List.Icon
                      {...props}
                      icon="notebook-check"
                      color="#2DBABC"
                    />
                  )}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
              </View>

              <View>
                <List.Item
                  title="Liked Recipe"
                  left={props => (
                    <List.Icon {...props} icon="thumb-up" color="#2DBABC" />
                  )}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
              </View>

              <Button
                icon="logout"
                style={{
                  color: '#2DBABC',
                  backgroundColor: '#2DBABC',
                  marginTop: 130,
                }}
                mode="contained"
                onPress={handleLogout}>
                Logout
              </Button>
            </ScrollView>
          </View>
          {/* End Of Main Content */}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  buttonActive: {
    color: '#18172B',
    borderBottomWidth: 2,
    borderBottomColor: '#EEC302',

    fontSize: 16,
  },
  buttonNonActive: {color: '#666666', fontSize: 16},
});

export default Profile;
