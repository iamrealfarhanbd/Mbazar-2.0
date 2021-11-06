import React, { useState, useEffect,useContext } from 'react';
import {
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { Card } from 'react-native-paper';
import {Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../const/colors';
import { ScrollView } from 'react-native-gesture-handler';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';


const DetailsScreen = ({ navigation, route }) => {
    const { itemId } = route.params;
    console.log(JSON.stringify(itemId));
    const {user, logout} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    const getUser = async () => {
      await firestore()
        .collection('users')
        .doc(itemId.userId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            console.log('User Data', documentSnapshot.data());
            setUserData(documentSnapshot.data());
          }
        });
    };
  
  
    useEffect(() => {
      getUser();
      return ()=>{
        console.log("cleanup", userData)
      }
    }, []);
  
    return (
      // <View style={{ flex: 1}}>
      //   {itemId.name && (
      //     <>
      //     <Button title="Back" onPress={handlePress} ></Button>

      //       <Image
      //         style={{ width: '100%', height: 300 }}
      //         source={{
      //           uri: itemId.postImg,
      //         }}
      //       />
      //       <View>
      //         <Text style={{color:"black",   fontWeight: 'bold',fontSize:30}}>item Name: {itemId.name}</Text>
      //         <Text style={{color:"black",   fontWeight: 'bold',fontSize:16}}>Description: {itemId.desc}</Text>
      //         <Text style={{color:"black",   fontWeight: 'bold',fontSize:16}}>Year Of Buying item: {itemId.year}</Text>
      //         <Text style={{color:"black",   fontWeight: 'bold',fontSize:16}}>Conact Number: {itemId.phone}</Text>
      //         <Text style={{color:"black",   fontWeight: 'bold',fontSize:16}}>Price: TK{itemId.price.toString()}</Text>
      //         <Button title="call seller" onPress={()=> Linking.openURL(`tel:${itemId.phone}`)}></Button>

      //       </View>
      //     </>
      //   )}
      // </View>
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white,}}>
        <ScrollView>
      <StatusBar backgroundColor={COLORS.background} />
      <View style={{ backgroundColor: COLORS.background}}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: itemId.postImg}}
          style={{
            height: 250,
            top: 0,
            bottom:0,
          }}>
          {/* Render  Header */}
          {/* <View style={style.header}>
            <Icon
              name="arrow-left"
              size={28}
              color={COLORS.dark}
              onPress={navigation.goBack}
            />
          </View> */}
        </ImageBackground>

        <View style={style.detailsContainer}>
          {/* item name and gender icon */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

            <Text
              style={{fontSize: 16, color: COLORS.dark, fontWeight: 'bold'}}>
                 Product Name: <Text   style={{fontSize: 20, color: COLORS.dark, fontWeight: 'bold'}}> {itemId.name}</Text>
            </Text>
          </View>

          {/* Render item type and age */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text style={{fontSize: 12, color: COLORS.dark}}>Price {itemId.price}</Text> 
            <Text style={{fontSize: 13, color: COLORS.dark}}>Brand:{itemId ? itemId.brand|| 'No Brand' : 'No Brand'}</Text>
          </View>

          {/* Render location and icon */}
          <View style={{marginTop: 5, flexDirection: 'row'}}>
            <Icon name="phone" color={COLORS.primary} size={20} />
            <Text style={{fontSize: 14, color: COLORS.grey, marginLeft: 5}}>
            Conact Number: {itemId.phone}
            </Text>
          </View>
        </View>
      </View>

      {/* Comment container */}
      <View style={{marginTop: 80,  paddingTop:100, justifyContent: 'space-between', flex: 1}}>
        <View>
          {/* Render user image , name and date */}
          <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
            <Image
                 source={{
                  uri: userData
                    ? userData.userImg ||
                      'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                    : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                }}
              style={{height: 40, width: 40, borderRadius: 20}}
            />
            <View style={{flex: 1, paddingLeft: 10 }}>
              <Text
                style={{color: COLORS.dark, fontSize: 12, fontWeight: 'bold'}}>
                 {userData ? userData.fname || 'Test' : 'Test'}{' '}
                            {userData ? userData.lname || 'User' : 'User'}
              </Text>
              <Text
                style={{
                  color: COLORS.grey,
                  fontSize: 11,
                  fontWeight: 'bold',
                  marginTop: 2,
                }}>
                Owner
              </Text>
            </View>
            <Text style={{color: COLORS.grey, fontSize: 12}}> Published Time: {userData ? itemId.postTime.toDate().toISOString().substr(0, 10) || 'May 25, 2021' : 'May 25, 2021'}{' '}</Text>
          </View>
          <Text style={style.comment}>
          {itemId.desc}
          </Text>
        </View>

        {/* Render footer */}
        <View style={style.footer}>
          {/* <View style={style.iconCon}>
            <Icon name="heart-outline" size={22} color={COLORS.white} />
          </View> */}
          <View style={style.btn}>
            <Text style={{color: COLORS.white, fontWeight: 'bold'}} onPress={()=> Linking.openURL(`tel:${itemId.phone}`)}>
              CALL NOW
            </Text>
          </View>
          <View style={style.btn}>
            <Text style={{color: COLORS.white, fontWeight: 'bold'}} onPress={()=> navigation.navigate('Messages')}>
              Coming Soon Chat
            </Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>

    );
  };

export default DetailsScreen;

const style = StyleSheet.create({
  detailsContainer: {
    height: 120,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    flex: 1,
    top: 20,
    borderRadius: 18,
    elevation: 10,
    padding: 20,
    marginBottom:-120,
    justifyContent: 'center',
  },
  comment: {
    marginTop: 10,
    fontSize: 12.5,
    color: COLORS.dark,
    lineHeight: 20,
    marginHorizontal: 20,
  },
  footer: {
    height: 150,
    backgroundColor: COLORS.light,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 30,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop:20,
  },
  iconCon: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  btn: {
    backgroundColor: COLORS.primary,
    flex: 1,
    height: 50,
    width:'100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
    marginBottom:10,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
});