/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Text, List, Button, ActivityIndicator} from 'react-native-paper';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';

function Profile(props) {
  const {navigation} = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(state => state.auth.token);




  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axios.get(
            'https://glorious-cow-hospital-gown.cyclic.app/token',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
  
          console.log('User data response:', response.data);
          setProfile(response.data?.data);
  
          // Tambahkan baris berikut untuk mengatur isLoggedIn menjadi true
          setIsLoggedIn(true);
        } else {
          console.log('Token does not exist, user is likely logged out.');
          setProfile(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized, handleLogout will be called.');
          handleLogout();
        }
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUser();
  }, [token]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}], // Replace 'Home' with the initial route of your bottom tab navigator
        }),
      );
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        size="large"
        color="#2DBABC"
      />
    );
  }

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
            }}>
            {profile.profilePicture && (
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
                  marginBottom: 20,
                  borderColor: 'white',
                  borderWidth: 3,
                }}
              />
            )}
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
    left={props => <List.Icon {...props} icon="account" color="#2DBABC" />}
    right={props => <List.Icon {...props} icon="chevron-right" />}
    onPress={() => props.navigation.navigate('EditProfile')} 
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
