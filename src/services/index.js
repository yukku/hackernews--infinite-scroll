/* @flow */
import rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';

type FirebaseConfig = {
  apiKey?: string,
  authDomain?: string,
  databaseURL?: string,
  storageBucket?: string,
  messagingSenderId?: string
};

const HN_VERSION = 'v0';
const FIREBASE_CONFIG: FirebaseConfig = {
  databaseURL: 'https://hacker-news.firebaseio.com'
};

firebase.initializeApp(FIREBASE_CONFIG);

const db = firebase.database();
const base = rebase.createClass(db);

const api = {
  bindToState(endpoint: string, options: Object): Promise<any> {
    return base.bindToState(`/${HN_VERSION}${endpoint}`, options);
  },
  listenTo(endpoint: string, options: Object): Promise<any> {
    return base.listenTo(`/${HN_VERSION}${endpoint}`, options);
  },
  fetch(endpoint: string, options: Object): Promise<any> {
    return base.fetch(`/${HN_VERSION}${endpoint}`, options);
  }
};

export default api;
