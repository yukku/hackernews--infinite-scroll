import _ from 'lodash';
import {
  takeLatest,
  take,
  put,
  call,
  fork,
  select,
  all
} from 'redux-saga/effects';
import * as actions from '../actions';
import api from '../services';

const TARGET_NUMBER_OF_POSTS_ON_UPDATE = 50;

const getStoryIds = state => state.storyIds;
const getStories = state => state.stories;
const getAverageStoryOccurrenceRatio = state =>
  state.averageStoryOccurrenceRatio;

function* fetchItemsByIds(storyIds) {
  const stories = yield all(
    storyIds.map(id => call(api.fetch, `/item/${id}`, {}))
  );
  yield put({ type: 'STORIES_FETCH_SUCCEEDED', stories: stories });
}

function* fetchStories(lastStoryId) {
  const averageStoryOccurrenceRatio = yield select(
    getAverageStoryOccurrenceRatio
  );

  const rangeTo =
    rangeTo < 0
      ? 0
      : lastStoryId -
        Math.abs(
          TARGET_NUMBER_OF_POSTS_ON_UPDATE / averageStoryOccurrenceRatio
        );
  const range = _.range(lastStoryId, rangeTo);
  const items = yield all(range.map(id => call(api.fetch, `/item/${id}`, {})));

  const stories = items.filter(item => item.type === 'story');

  yield put({
    type: 'STORIES_ID_FETCH_SUCCEEDED',
    ids: stories.map(story => story.id)
  });
  yield put({ type: 'STORIES_FETCH_SUCCEEDED', stories: stories });
}

function* fetchNewStoryIds() {
  try {
    const ids = yield call(api.fetch, '/newstories', {});
    yield put({ type: 'NEWSTORIES_ID_FETCH_SUCCEEDED', ids: ids });
  } catch (e) {
    yield put({ type: 'NEWSTORIES_ID_FETCH_FAILED', message: e.message });
  }
}

function* getMoreStories() {
  try {
    const storyIds = yield select(getStoryIds);
    const storedStories = yield select(getStories);
    const lastStory = storedStories[storedStories.length - 1];

    if (storedStories.length > 0 && lastStory.id === 0) {
      yield put({ type: 'NO_MORE_STORY_TO_FETCH' });
    } else if (storedStories.length < storyIds.length) {
      const rangeFrom = storedStories.length;
      const rangeTo = storedStories.length + TARGET_NUMBER_OF_POSTS_ON_UPDATE;

      yield put({ type: 'STORIES_LOADING_START' });
      yield call(fetchItemsByIds, storyIds.slice(rangeFrom, rangeTo));
      yield put({ type: 'STORIES_LOADING_END' });
    } else {
      const lastStoryId = storyIds[storyIds.length - 1] - 1;

      yield put({ type: 'STORIES_LOADING_START' });
      yield call(fetchStories, lastStoryId);
      yield put({ type: 'STORIES_LOADING_END' });
    }
  } catch (e) {
    yield put({ type: 'STORIES_FETCH_FAILED', message: e.message });
    yield put({ type: 'STORIES_LOADING_END' });
  }
}

function* watchLoadMostRecent() {
  yield takeLatest(actions.LOAD_MOST_RECENT, fetchNewStoryIds);
}

function* watchFetchNewStoryIds() {
  yield takeLatest('NEWSTORIES_ID_FETCH_SUCCEEDED', getMoreStories);
}

function* watchLoadMoreStories() {
  while (true) {
    yield take(actions.LOAD_MORE_STORIES);
    yield call(getMoreStories);
  }
}

export default function* root() {
  yield all([
    fork(watchLoadMostRecent),
    fork(watchFetchNewStoryIds),
    fork(watchLoadMoreStories)
  ]);
}
