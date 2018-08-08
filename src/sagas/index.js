/* @flow */
import _ from 'lodash';
import type { Saga } from 'redux-saga';
import { takeLatest, take, put, call, fork, select, all } from 'redux-saga/effects';
import * as actions from '../actions';
import api from '../services';

const TARGET_NUMBER_OF_POSTS_ON_UPDATE = 50;

export const getStoryIds = (state: any) => state.storyIds;
export const getStories = (state: any) => state.stories;
export const getAverageStoryOccurrenceRatio = (state: any) => state.averageStoryOccurrenceRatio;

export function* fetchItemsByIds(storyIds: Array<string>): Saga<void> {
  const stories = yield all(storyIds.map(id => call(api.fetch, `/item/${id}`, {})));
  yield put(actions.storiesFetched(stories));
}

export function* fetchStoriesFromLastStoryId(lastStoryId: number): Saga<void> {
  const averageStoryOccurrenceRatio = yield select(getAverageStoryOccurrenceRatio);

  let rangeTo =
    lastStoryId - Math.abs(TARGET_NUMBER_OF_POSTS_ON_UPDATE / averageStoryOccurrenceRatio);
  if (rangeTo < 0) {
    rangeTo = 0;
  }
  const range = _.range(lastStoryId, rangeTo);
  const items = yield all(range.map(id => call(api.fetch, `/item/${id}`, {})));

  const stories = items.filter(item => item.type === 'story');

  yield put(actions.storiesIdFetched(stories.map(story => story.id)));
  yield put(actions.storiesFetched(stories));
}

export function* fetchNewStoryIds(): Saga<void> {
  try {
    const ids = yield call(api.fetch, '/newstories', {});
    yield put(actions.newStoriesIdFetched(ids));
  } catch (e) {
    yield put(actions.newStoriesIdFetchFaild(e.message));
  }
}

export function* getMoreStories(): Saga<void> {
  try {
    const storyIds = yield select(getStoryIds);
    const storedStories = yield select(getStories);
    const lastStory = storedStories[storedStories.length - 1];

    if (storedStories.length > 0 && lastStory.id === 0) {
      yield put(actions.noMoreStoryToFetch());
    } else if (storedStories.length < storyIds.length) {
      const rangeFrom = storedStories.length;
      const rangeTo = storedStories.length + TARGET_NUMBER_OF_POSTS_ON_UPDATE;

      yield put(actions.storiesLoadingStart());
      yield call(fetchItemsByIds, storyIds.slice(rangeFrom, rangeTo));
      yield put(actions.storiesLoadingEnd());
    } else {
      yield put(actions.storiesLoadingStart());
      yield call(fetchStoriesFromLastStoryId, lastStory.id - 1);
      yield put(actions.storiesLoadingEnd());
    }
  } catch (e) {
    yield put(actions.storiesFetchFailed(e.message));
    yield put(actions.storiesLoadingEnd());
  }
}

export function* watchLoadMostRecent(): Saga<void> {
  yield takeLatest(actions.LOAD_MOST_RECENT, fetchNewStoryIds);
}

export function* watchFetchNewStoryIds(): Saga<void> {
  yield takeLatest(actions.NEWSTORIES_ID_FETCH_SUCCEEDED, getMoreStories);
}

export function* watchLoadMoreStories(): Saga<void> {
  while (true) {
    yield take(actions.LOAD_MORE_STORIES);
    yield call(getMoreStories);
  }
}

export default function* root(): Saga<void> {
  yield all([fork(watchLoadMostRecent), fork(watchFetchNewStoryIds), fork(watchLoadMoreStories)]);
}
