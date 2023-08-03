/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

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
import { Text,  } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';


import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
  Snackbar,
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

function Register(props) {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const [fullname, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhone] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [passwordNew, setpasswordNew] = React.useState('');

  const [isEmailFocused, setIsEmailFocused] = React.useState(false);
  const [isNameFocused, setIsNameFocused] = React.useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = React.useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);
  const [isPasswordNewFocused, setIsPasswordNewFocused] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  

  const handleRegister = () => {
    setIsLoading(true);
    if (password !== passwordNew) {
      setError('Passwords do not match');
      return;
    }
    axios
    .post('https://glorious-cow-hospital-gown.cyclic.app/auth/register', {
        email: email,
        password: password,
        fullname: fullname,
        phoneNumber: phoneNumber,
      })
      .then(response => {
        console.log(response?.data?.data[0].id);
        firestore()
          .collection('users')
          .doc(response?.data?.data[0].id.toString())
          .set({
            id: response?.data?.data[0].id.toString(),
            fullname: fullname,
            phoneNumber: phoneNumber,
            email: email,
            password: password,
          })
          .then(response => {
            console.log('user created');
          })
          .catch(error => {
            console.log(error);
          });

        navigation.navigate('Login');
        setIsLoading(false);
      })
      
          .then(() => {
            setIsSuccess(true);
          })
      // })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
          console.log(err.response.data.message);
        } else {
          setError('An error occurred');
          console.log(err);
          setIsLoading(false);
        }
      });
  };

  React.useEffect(() => {
    if (isSuccess) {
      setName('');
      setEmail('');
      setPhone('');
      setpassword('');
      setpasswordNew('');
      setIsEmailFocused(false);
      setIsNameFocused(false);
      setIsPhoneFocused(false);
      setIsPasswordFocused(false);
      setIsPasswordNewFocused(false);
      setError(null);
      setIsLoading(false);
    
    }
  }, [isSuccess]);

  const onChangeName = query => setName(query);
  const onChangeEmail = query => setEmail(query);
  const onChangePhone = number => setPhone(number);
  const onChangepassword = (text) => setpassword(text);
  const onChangepasswordNew = (text) => setpasswordNew(text);


  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(false);
  };

  const handleNameFocus = () => {
    setIsNameFocused(true);
  };

  const handleNameBlur = () => {
    setIsNameFocused(false);
  };

  const handlePhoneFocus = () => {
    setIsPhoneFocused(true);
  };

  const handlePhoneBlur = () => {
    setIsPhoneFocused(false);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordNewFocus = () => {
    setIsPasswordNewFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const handlePasswordNewBlur = () => {
    setIsPasswordNewFocused(false);
  };


  const emailBorderColor = isEmailFocused ? '#2DBABC' : 'transparent';
  const nameBorderColor = isNameFocused ? '#2DBABC' : 'transparent';
  const phoneBorderColor = isPhoneFocused ? '#2DBABC' : 'transparent';
  const passwordBorderColor = isPasswordFocused ? '#2DBABC' : 'transparent';
  const passwordNewBorderColor = isPasswordNewFocused ? '#2DBABC' : 'transparent';

  const iconColorEmail = isEmailFocused ? '#2DBABC' : Colors.grey500;
  const iconColorName = isNameFocused ? '#2DBABC' : Colors.grey500;
  const iconColorPhone = isPhoneFocused ? '#2DBABC' : Colors.grey500;
  const iconColorPassword = isPasswordFocused ? '#2DBABC' : Colors.grey500;
  const iconColorPasswordNew = isPasswordNewFocused ? '#2DBABC' : Colors.grey500;




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


          <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>


          <View
            style={{
              backgroundColor: '#f6f6f9',
              padding: 10,
              paddingBottom: 10,
            }}>
      <Text
              variant="titleLarge"
              style={{
                marginBottom: 11,
                fontSize: 25,
                color: '#2DBABC',
                alignSelf: 'center',
                paddingTop: 100,
              }}>
  
Let’s Get Started !
</Text>
      <Text
              variant="bodySmall"
              style={{
                marginBottom: 50,
                fontSize: 14,
                color: '#4C4C4C',
                alignSelf: 'center',
              }}>
  
  Create new account to access all feautures
</Text>

{ <Text style={styles.errorText}>{error}</Text>}


<TextInput
              style={[styles.input, {borderColor: nameBorderColor, marginBottom:20}]}
              placeholder="Name"
              onChangeText={onChangeName}
              value={fullname}
              keyboardType="default"
              autoCapitalize="sentences"
              onFocus={handleNameFocus}
              onBlur={handleNameBlur}
              left={<TextInput.Icon icon="user" color={iconColorName} />}
        
            />

<TextInput
              style={[styles.input, {borderColor: emailBorderColor, marginBottom:20}]}
              placeholder="Email"
              onChangeText={onChangeEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              left={<TextInput.Icon icon="envelope" color={iconColorEmail} />}
            />

<TextInput
              style={[styles.input, {borderColor: phoneBorderColor, marginBottom:20}]}
              placeholder="Phone Number"
              onChangeText={onChangePhone}
              value={phoneNumber}
              keyboardType="numeric"
              autoCapitalize="none"
              onFocus={handlePhoneFocus}
              onBlur={handlePhoneBlur}
              left={<TextInput.Icon icon="phone" color={iconColorPhone} />}
            />


<TextInput
              style={[styles.input, {borderColor: passwordNewBorderColor, marginBottom:20}]}
              placeholder="Password"
              onChangeText={onChangepasswordNew}
              value={passwordNew}
              secureTextEntry={true}
              onFocus={handlePasswordNewFocus}
              onBlur={handlePasswordNewBlur}
              left={<TextInput.Icon icon="lock" color={iconColorPasswordNew} />}
        
            />


<TextInput
              style={[styles.input, {borderColor: passwordBorderColor,marginBottom:50}]}
              placeholder="Password New"
              onChangeText={onChangepassword}
              value={password}
              secureTextEntry={true}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              left={<TextInput.Icon icon="unlock" color={iconColorPassword} />}
        
            />



<TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>



    <Text
              variant="bodySmall"
              style={{
              marginTop: 30,
            marginBottom:40,
                fontSize: 15,
                color: '#4C4C4C',
                alignSelf: 'center',
              }}>
    Already have account?{' '}
          <Text>
          Log in Here
          </Text>
            </Text>

        </View>
        </ScrollView>
  
        <View>
        <Snackbar
          visible={isSuccess}
          style={{backgroundColor: '#79C079'}}
          onDismiss={() =>  props.navigation.navigate('Login')}
          duration={1000}>
          Register success
        </Snackbar>

        <Snackbar
          visible={Boolean(error)}
          style={{backgroundColor: '#CB3837'}}
          onDismiss={() => setError(null)}
          action={{
            label: 'X',
            onPress: () => {
              setError(null);
            },
          }}>
          {error}
        </Snackbar>
      </View>


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
    height: 60,
    borderColor: 'transparent',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
   
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

export default Register;
