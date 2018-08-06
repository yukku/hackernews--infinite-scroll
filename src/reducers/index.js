import { combineReducers } from 'redux';
import {
  stories,
  storyIds,
  averageStoryOccurrenceRatio,
  isLoading,
  errors
} from './stories.js';
import * as actions from '../actions';

const rootReducer = combineReducers({
  stories: stories({
    types: {
      fetchSuccessType: actions.STORIES_FETCH_SUCCEEDED
    },
    mapActionToKey: action => action.stories
  }),
  storyIds: storyIds({
    types: {
      initialFetchSuccessType: actions.NEWSTORIES_ID_FETCH_SUCCEEDED,
      fetchSuccessType: actions.STORIES_ID_FETCH_SUCCEEDED
    },
    mapActionToKey: action => action.ids
  }),
  averageStoryOccurrenceRatio: averageStoryOccurrenceRatio({
    types: {
      initialFetchSuccessType: actions.NEWSTORIES_ID_FETCH_SUCCEEDED,
      fetchSuccessType: actions.STORIES_ID_FETCH_SUCCEEDED
    },
    mapActionToKey: action => action.ids
  }),
  isLoading: isLoading({
    types: {
      startType: actions.STORIES_LOADING_START,
      endType: actions.STORIES_LOADING_END
    }
  }),
  errors: errors({
    types: {
      pageLoadErrorType: actions.NEWSTORIES_ID_FETCH_FAILED,
      storiesLoadErrorType: actions.STORIES_FETCH_FAILED
    },
    mapActionToKey: action => action.message
  })
});

export default rootReducer;
