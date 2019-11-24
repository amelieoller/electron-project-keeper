import firebase from 'firebase/app';
import 'firebase/firestore';

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

window.firebase = firebase;

export const firestore = firebase.firestore();
export default firebase;
