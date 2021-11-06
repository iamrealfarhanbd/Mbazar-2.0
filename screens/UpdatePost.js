import React, {useState, useContext,useEffect} from 'react';
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
import auth from '@react-native-firebase/auth';

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

const UpdatePost = ({navigation,route}) => {
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
  const { itemUp } = route.params;
  const [userData, setUserData] = useState(null);


  const getData = async() => {
    const currentUser = await firestore()
    .collection('posts')
    .doc(itemUp.id)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }

  useEffect(() => {
    getData();
  }, []);
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



  // Update function

  const handleUpdate = async() => {
      console.log('Something went wrong with added post to firestore.',itemUp.id);

    let imageUrl = await uploadImage();

    if( imageUrl == null && userData.postImg) {
      imageUrl = userData.postImg;
    }


    firestore()
    .collection('posts').doc(itemUp.id).update({
      postImg: imageUrl,
      postTime: firestore.Timestamp.fromDate(new Date()),
      name:userData.name,
      desc:userData.desc,
      brand:userData.brand,
      price:userData.price,
      phone:userData.phone,
      image:imageUrl,
    })
    .then(() => {
      console.log('User Updated!');
      console.log(item.id);
      Alert.alert(
        'Profile Updated!',
        'Your profile has been updated successfully.'
      );
      
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
    navigation.navigate('Mbazar')
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
        {image != null ? <AddImage source={{uri:image}} value={userData ? userData.image : ''} /> : null}

        <InputField
          placeholder="What's on your setName?"
          multiline
          numberOfLines={1}
          value={userData ? userData.name : ''}
          onChangeText={(txt) => setUserData({...userData, name: txt})}

        />
         <InputField
          placeholder="What's on your setDesc?"
          multiline
          numberOfLines={1}
          value={userData ? userData.desc : ''}
          onChangeText={(txt) => setUserData({...userData, desc: txt})}

        />
         <InputField
          placeholder="What's on your setbrand?"
          multiline
          numberOfLines={1}
          value={userData ? userData.brand : ''}
          onChangeText={(txt) => setUserData({...userData, brand: txt})}

        />
         <InputField
          placeholder="What's on your setPrice?"
          multiline
          numberOfLines={1}
          value={userData ? userData.price : ''}
          onChangeText={(txt) => setUserData({...userData, price: txt})}

        />
         <InputField
          placeholder="What's on your setPhone?"
          multiline
          numberOfLines={1}
          maxLength={11}
          pattern="[+-]?\d+(?:[.,]\d+)?"
          keyboardType="number-pad"
          autoCorrect={false}
          value={userData ? userData.phone : ''}
          onChangeText={(txt) => setUserData({...userData, phone: txt})}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <><SubmitBtn onPress={handleUpdate}>
                  <SubmitBtnText>Update Item</SubmitBtnText>
                </SubmitBtn></>

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

export default UpdatePost;

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
