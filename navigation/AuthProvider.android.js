import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          if(!email||!password){
            Alert.alert("please all all the fields")  
             return
          }
         
          if(email == !email){
            Alert.alert("please  try Correct email")  
         
          }
          try {
            await auth().signInWithEmailAndPassword(email, password);
   
          } catch (e) {
            errorCode = e.code;
            if(errorCode === 'auth/user-not-found'){
              Alert.alert("user not found")  
             
            }
            if(errorCode === 'auth/invalid-email'){
              Alert.alert("The email address is badly formatted")  
             
            }
            errorCode = e.code;
            if(errorCode === 'auth/wrong-password'){
              Alert.alert("please try Correct password")  
             
            }
            if(errorCode === 'auth/too-many-requests'){
              Alert.alert("too many requests")  
             
            }
            
            console.log(e);
            // Alert.alert("something went wrong please try different password",)
          }
        },
        googleLogin: async () => {
          try {
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth().signInWithCredential(googleCredential)
            // Use it only when user Sign's up, 
            // so create different social signup function
            // .then(() => {
            //   //Once the user creation has happened successfully, we can add the currentUser into firestore
            //   //with the appropriate details.
            //   // console.log('current User', auth().currentUser);
            //   firestore().collection('users').doc(auth().currentUser.uid)
            //   .set({
            //       fname: '',
            //       lname: '',
            //       email: auth().currentUser.email,
            //       createdAt: firestore.Timestamp.fromDate(new Date()),
            //       userImg: null,
            //   })
            //   //ensure we catch any errors at this stage to advise us if something does go wrong
            //   .catch(error => {
            //       console.log('Something went wrong with added user to firestore: ', error);
            //   })
            // })
            //we need to catch the whole sign up process if it fails too.
            .catch(error => {
                console.log('Something went wrong with sign up: ', error);
            });
          } catch(error) {
            console.log({error});
          }
        },
        fbLogin: async () => {
          try {
            // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
              throw 'User cancelled the login process';
            }

            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
              throw 'Something went wrong obtaining access token';
            }

            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

            // Sign-in the user with the credential
            await auth().signInWithCredential(facebookCredential)
            // Use it only when user Sign's up, 
            // so create different social signup function
            // .then(() => {
            //   //Once the user creation has happened successfully, we can add the currentUser into firestore
            //   //with the appropriate details.
            //   console.log('current User', auth().currentUser);
            //   firestore().collection('users').doc(auth().currentUser.uid)
            //   .set({
            //       fname: '',
            //       lname: '',
            //       email: auth().currentUser.email,
            //       createdAt: firestore.Timestamp.fromDate(new Date()),
            //       userImg: null,
            //   })
            //   //ensure we catch any errors at this stage to advise us if something does go wrong
            //   .catch(error => {
            //       console.log('Something went wrong with added user to firestore: ', error);
            //   })
            // })
            //we need to catch the whole sign up process if it fails too.
            .catch(error => {
                console.log('Something went wrong with sign up: ', error);
            });
          } catch(error) {
            console.log({error});
          }
        },
        
        register: async (email, password,confirmPassword) => {
          const reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

          if ( !email.match(reg)){
            Alert.alert("email not valid");
            return
          }
          
          else if (!email|!password){
            Alert.alert("please all all the fields")  
            return
          }
          else if (password !== confirmPassword){
            Alert.alert("password did not match")  
            return
          }
          try {
            await auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
              //Once the user creation has happened successfully, we can add the currentUser into firestore
              //with the appropriate details.
              firestore().collection('users').doc(auth().currentUser.uid)
              .set({
                  fname: '',
                  lname: '',
                  email: email,
                  createdAt: firestore.Timestamp.fromDate(new Date()),
                  userImg: null,
              })
              //ensure we catch any errors at this stage to advise us if something does go wrong
              .catch(error => {
                Alert.alert('Something went wrong with added user to firestore: ', error);
              })
            })
            //we need to catch the whole sign up process if it fails too.
            .catch(error => {
              errorCode = error.code;
              if(errorCode === 'auth/invalid-email'){
                Alert.alert("invalid email")  
               return
              }
              if(errorCode === 'auth/weak-password'){
                Alert.alert("weak password ,Password should be at least 6 characters")  
               return
              }
              if(errorCode === 'auth/email-already-in-use'){
                Alert.alert("The email address is already in use by another account")  
               return
              }
                console.log('Something went wrong with sign up: ', error);
                Alert.alert('User went wrong with sign up ',error);
            });
          } catch (e) {
           
            console.log(e);
            Alert.alert("something went wrong please try different password")
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
