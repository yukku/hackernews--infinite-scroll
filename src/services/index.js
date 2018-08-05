/* @flow */
import rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';

const HN_VERSION = 'v0';
const FIREBASE_CONFIG = {
  // apiKey: "AIzaSyBm-ieAXvrjC0NdeDLpzX2l4T4Bpj4_M4I",
  // authDomain: "hackernews-infinite-scroll.firebaseio.com",
  databaseURL: 'https://hacker-news.firebaseio.com'
  // storageBucket: "自身のconfig",
  // messagingSenderId: "自身のconfig"
};

firebase.initializeApp(FIREBASE_CONFIG);

const db = firebase.database();
const base = rebase.createClass(db);

const api = {
  bindToState(endpoint: string, options: object): Promise {
    return base.bindToState(`/${HN_VERSION}${endpoint}`, options);
  },
  listenTo(endpoint: string, options: object): Promise {
    return base.listenTo(`/${HN_VERSION}${endpoint}`, options);
  },
  fetch(endpoint: string, options: object): Promise {
    return base.fetch(`/${HN_VERSION}${endpoint}`, options);
  }
};

export default api;
