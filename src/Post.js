import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';



const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2DBABC',
    text: '#2DBABC',
    placeholder: 'gray',
    background: 'white',
    onSurface: '#2DBABC',
    accent: '#2DBABC',
  },
};

const pickImage = () => {
  const options = {
    mediaType: 'photo', // Hanya memungkinkan pemilihan foto
    quality: 1, // Kualitas gambar (0-1)
  };

  ImagePicker.launchImageLibrary(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      // Gunakan response.uri sebagai sumber gambar
      const selectedImage = response.uri;
      // Tangani gambar terpilih di sini
    }
  });
};




function Post({ navigation }) {
  const [ingredients, setIngredients] = useState('');

  const pickImage = () => {
    const options = {
      mediaType: 'photo', // Hanya memungkinkan pemilihan foto
      quality: 1, // Kualitas gambar (0-1)
    };
  
   
  };
console.log(pickImage);

  return (
    <PaperProvider theme={theme}>





      <View style={styles.container}>
        <Text style={[styles.title, { color: '#2DBABC' }]}>Add Your Recipe</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          placeholder="Title"
        />
        <TextInput
          mode="outlined"
          style={[styles.input, styles.ingredientsInput]}
          multiline
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="Ingredients"
        />
        <TextInput
          mode="outlined"
          style={styles.input}
          placeholder="Add Video"
        />

<Button
  mode="contained"
  style={[styles.button, { backgroundColor: '#2DBABC', marginBottom: 20 }]}
  onPress={pickImage}
>
  Pick an Image
</Button>



        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: '#2DBABC' }]}
          onPress={() => {
            // Handle button press
          }}
        >
          Post
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  ingredientsInput: {
    height: 150,
  },
  button: {
    width: '50%',
  },
});

export default Post;
