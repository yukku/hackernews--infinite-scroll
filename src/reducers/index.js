import { combineReducers } from 'redux';
import {
  stories,
  storyIds,
  averageStoryOccurrenceRatio,
  isLoading
} from './stories.js';

const rootReducer = combineReducers({
  stories: stories({
    types: {
      fetchSuccessType: 'STORIES_FETCH_SUCCEEDED'
    },
    mapActionToKey: action => action.stories
  }),
  storyIds: storyIds({
    types: {
      initialFetchSuccessType: 'NEWSTORIES_ID_FETCH_SUCCEEDED',
      fetchSuccessType: 'STORIES_ID_FETCH_SUCCEEDED'
    },
    mapActionToKey: action => action.ids
  }),
  averageStoryOccurrenceRatio: averageStoryOccurrenceRatio({
    types: {
      initialFetchSuccessType: 'NEWSTORIES_ID_FETCH_SUCCEEDED',
      fetchSuccessType: 'STORIES_ID_FETCH_SUCCEEDED'
    },
    mapActionToKey: action => action.ids
  }),
  isLoading: isLoading({
    types: {
      startType: 'STORIES_LOADING_START',
      endType: 'STORIES_LOADING_END'
    }
  })
});

export default rootReducer;
