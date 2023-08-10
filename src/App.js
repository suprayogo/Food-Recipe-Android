import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ChatScreen from './ChatScreen';
import DetailRecipe from './DetailRecipe';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Register from './Register';
import Tabs from './navigation/Tabs';
import DetailChat from './DetailChat';
import { Provider } from "react-redux";
import { store } from './store';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();
const navigationRef = React.createRef(); // Create the navigationRef

function App(props) {
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>

    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DetailRecipe" component={DetailRecipe} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="DetailChat" component={DetailChat} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </PersistGate>
    </Provider>
  );
}

export default App;
