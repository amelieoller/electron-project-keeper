import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyC6j6mvWWXjqf7XxB7wqVkQk6oCg8Cm1DA',
  authDomain: 'project-keepr.firebaseapp.com',
  databaseURL: 'https://project-keepr.firebaseio.com',
  projectId: 'project-keepr',
  storageBucket: 'project-keepr.appspot.com',
  messagingSenderId: '373823988487',
  appId: '1:373823988487:web:d26dd49ef2c17544b25ba2'
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const provider = new firebase.auth.GoogleAuthProvider();

export const signUpWithUsernameAndPassword = (email, password, setError) =>
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      setError(null);

      var credential = firebase.auth.EmailAuthProvider.credential(email, password);
      firebase
        .auth()
        .currentUser.linkWithCredential(credential)
        .then(
          function(usercred) {
            var user = usercred.user;
            console.log('Account linking success', user);
          },
          function(error) {
            console.log('Account linking error', error);
          }
        );
    })
    .catch(function(error) {
      setError(error);
    });

export const signInWithUsernameAndPassword = (email, password, setError) =>
  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      setError(null);
    })
    .catch(function(error) {
      setError(error);
    });

export const signOut = () => auth.signOut();

export const createUserProfileDocument = async user => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt
      });
    } catch (error) {
      console.error('Error creating user', error.message);
    }
  }

  return getUserDocument(user.uid);
};

// window.firebase = firebase;

export const getUserDocument = async uid => {
  if (!uid) return null;

  try {
    const userDocument = await firestore
      .collection('users')
      .doc(uid)
      .get();

    return { uid, ...userDocument.data() };
  } catch (error) {
    console.error('Error fetching user', error.message);
  }
};

export default firebase;
