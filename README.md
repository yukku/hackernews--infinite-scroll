### Overview
Infinite Scroll React/Redux app using [Official Hacker News API](https://github.com/HackerNews/API). Data is fetched from [Firebase REST API](https://firebase.google.com/docs/database/rest/start). It includes support for [Streaming from the REST API](https://firebase.google.com/docs/database/rest/retrieve-data#section-rest-streaming) via Web Socket. 

### Design
Used [redux-saga](https://github.com/redux-saga/redux-saga) for managing sequence of async operations. Initially, the app calls `/v0/newstories` endpoint to get latest 500 story Ids. As a user scrolls down the page, it makes requests to `v0/item/${id}` to get the content of stories. 500 is the maximum number you can get from `/v0/newstories` endpoint so when it reaches to 500th story, the app makes request to `v0/item/${id}` by walking backward from the previous story id. The problem is sequentially calling `v0/item/${id}` and determining whether the type of the item is story or not can be slow. The app instead makes concurrent calls to `v0/item/${id}` by estimating how many requests are needed to get set number of stories. For example, if the items we received are as following sequence `[Story, Comment, Story, Comment, Comment]`, the ratio of Story is 40%. So in order to get 40 stories, it would need to make more or less 100 requests.  

### Install
```
npm i
```
### Run the app in development mode
```
npm run start
```
Then open http://localhost:3000/ to see your app.
### Run the unit test
```
npm run test
```
### Create an optimized production build
```
npm run build
```
