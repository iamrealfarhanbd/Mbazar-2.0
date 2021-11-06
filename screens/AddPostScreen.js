import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../styles/AddPost';

import { AuthContext } from '../navigation/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';

const AddPostScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const [name,setName] = useState('')
  const [desc,setDesc] = useState('')
  const [brand,setBrand] = useState('')
  const [price,setPrice] = useState('')
  const [phone,setPhone] = useState('')


  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 400,
      freeStyleCropEnabled: true,
      compressImageQuality:0.5,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 400,
      freeStyleCropEnabled: true,
      compressImageQuality:0.5,

      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);
    var RandomNumber = Math.floor(Math.random() * 1000) + 1 ;
    firestore()
    .collection('posts')
    .add({
      userId: user.uid,
      postImg: imageUrl,
      postTime: firestore.Timestamp.fromDate(new Date()),
      name,
      desc,
      brand,
      price,
      phone,
      image:imageUrl,
      id:RandomNumber,
    })
    .then(() => {
      console.log('Post Added!');
      Alert.alert(
        'Post published!',
        'Your post has been published Successfully!',
        );
        navigation.navigate('Mbazar')
      setPost(null);
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }



  

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <InputWrapper>
        {image != null ? <AddImage source={{uri: image}} /> : null}

        <InputField
          placeholder="Insert Your Product Name"
          multiline
          numberOfLines={1}
          value={name}
          onChangeText={(content) => setName(content)}
        />
         <InputField
          placeholder="Insert Your Product Description "
          multiline
          numberOfLines={1}
          value={desc}
          onChangeText={(content) => setDesc(content)}
        />
         <InputField
          placeholder="Insert Your Product Brand"
          multiline
          
          numberOfLines={1}
          value={brand}
          onChangeText={(content) => setBrand(content)}
        />
         <InputField
          placeholder="Insert Your Product Price"
          multiline
          numberOfLines={1}
          value={price}
          onChangeText={(content) => setPrice(content)}
        />
         <InputField
          placeholder="Insert Your Phone Number"
          multiline
          maxLength={11}
          pattern="[+-]?\d+(?:[.,]\d+)?"
          keyboardType="number-pad"
          autoCorrect={false}
          numberOfLines={1}
          value={phone}
          onChangeText={(content) => setPhone(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>
      <ActionButton buttonColor="#2e64e5">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Take Photo"
          onPress={takePhotoFromCamera}>
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Choose Photo"
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
    </ScrollView>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
