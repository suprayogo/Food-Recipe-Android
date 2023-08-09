/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import { navigationRef } from './App'; 

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import {Text, Avatar} from 'react-native-paper';

import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2DBABC', // Change the primary color
    text: '#2DBABC', // Change the text color
    placeholder: 'gray', // Change the placeholder color
    background: 'white', // Change the background color
    onSurface: '#2DBABC', // Change the label color
  },
};

function Login(props) {
  const navigation = useNavigation();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2DBABC' : 'white',
  };

  const [email, setEmail] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const [isEmailFocused, setIsEmailFocused] = React.useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  
  const handleLogin = () => {
    setIsLoading(true);
    setError(''); // Reset error state before making the request
  
    axios
      .post('https://glorious-cow-hospital-gown.cyclic.app/auth/login', {
        email: email,
        password: password,
      })
      .then(async (res) => {
        const token = res.data.token;
        console.log(res.data);
        await AsyncStorage.setItem('auth', 'true');
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('profile', JSON.stringify(res.data));
        
        setIsLoading(false);
        navigation.navigate('Tabs'); // Navigate to 'Tabs' using the navigationRef
      })
      .catch((err) => {
        setIsLoading(false); // Stop loading even in case of error
        if (err.response && err.response.data && err.response.data.message) {
          if (err.response.data.message) {
            setError(err.response.data.message);
          }
          console.log(err.response.data.message);
        } else {
          setError('Something went wrong with the app');
          console.log(err);
        }
      });
  };
  

  const onChangeEmail = query => setEmail(query);
  const onChangepassword = text => setpassword(text);

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(false);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const emailBorderColor = isEmailFocused ? '#2DBABC' : 'transparent';
  const passwordBorderColor = isPasswordFocused ? '#2DBABC' : 'transparent';
  const iconColorEmail = isEmailFocused ? '#2DBABC' : Colors.grey500;
  const iconColorPassword = isPasswordFocused ? '#2DBABC' : Colors.grey500;

  return (
    <PaperProvider
      theme={theme}
      settings={{
        icon: props => <AwesomeIcon {...props} />,
      }}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: '#2DBABC',
              padding: 20,
              paddingBottom: 15,
            }}>
            <Avatar.Image
              size={150}
              source={require('./assets/Avatar.png')}
              style={{
                alignSelf: 'center',
                backgroundColor: '#C4C4C4',
                width: 200,
                height: 200,
                color: 'white',
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderColor: 'white',
              }}
            />
          </View>

          <View
            style={{backgroundColor: 'white', padding: 20, paddingBottom: 100}}>
            <Text
              variant="titleLarge"
              style={{
                marginBottom: 7,
                fontSize: 25,
                color: '#2DBABC',
                alignSelf: 'center',
              }}>
              Welcome !
            </Text>
            <Text
              variant="bodySmall"
              style={{
                marginBottom: 40,
                fontSize: 15,
                color: '#4C4C4C',
                alignSelf: 'center',
              }}>
              Log in to your exiting account.
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
              style={[
                styles.input,
                {borderColor: emailBorderColor, marginBottom: 20},
              ]}
              placeholder="Email"
              onChangeText={onChangeEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              left={<TextInput.Icon icon="user" color={iconColorEmail} />}
            />
            <TextInput
              style={[styles.input, {borderColor: passwordBorderColor}]}
              placeholder="Password"
              onChangeText={onChangepassword}
              value={password}
              secureTextEntry={true}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              left={<TextInput.Icon icon="lock" color={iconColorPassword} />}
            />
            <Text
              variant="bodySmall"
              style={{
                marginTop: 10,
                marginBottom: 40,
                fontSize: 15,
                color: '#4C4C4C',
                alignSelf: 'flex-end',
              }}>
              Forgot Password ?
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Log in</Text>
              )}
            </TouchableOpacity>

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                variant="bodySmall"
                style={{
                  marginTop: 30,

                  fontSize: 15,
                  color: '#4C4C4C',
                  alignSelf: 'center',
                }}>
                Don’t have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => props.navigation.navigate('Register')}>
                <Text
                  variant="bodySmall"
                  style={{
                    marginTop: 30,
                    fontSize: 15,
                    alignSelf: 'center',
                  }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 55,
    borderColor: 'transparent',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10, // Change the border radius to your desired value
    borderTopLeftRadius: 10, // Add this property to set the top left border radius
    borderTopRightRadius: 10,
  },
  button: {
    height: 55,
    backgroundColor: '#2DBABC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default Login;
