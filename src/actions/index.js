export const LOAD_MOST_RECENT = 'LOAD_MOST_RECENT';
export const LOAD_MORE_STORIES = 'LOAD_MORE_STORIES';
export const STORIES_FETCH_SUCCEEDED = 'STORIES_FETCH_SUCCEEDED';
export const STORIES_ID_FETCH_SUCCEEDED = 'STORIES_ID_FETCH_SUCCEEDED';
export const NEWSTORIES_ID_FETCH_SUCCEEDED = 'NEWSTORIES_ID_FETCH_SUCCEEDED';
export const NO_MORE_STORY_TO_FETCH = 'NO_MORE_STORY_TO_FETCH';
export const STORIES_LOADING_START = 'STORIES_LOADING_START';
export const STORIES_LOADING_END = 'STORIES_LOADING_END';

export const NEWSTORIES_ID_FETCH_FAILED = 'NEWSTORIES_ID_FETCH_FAILED';
export const STORIES_FETCH_FAILED = 'STORIES_FETCH_FAILED';

export function loadMostRecent() {
  return {
    type: LOAD_MOST_RECENT
  };
}

export function loadMoreStories() {
  return {
    type: LOAD_MORE_STORIES
  };
}

export function storiesFetched(stories) {
  return {
    type: STORIES_FETCH_SUCCEEDED,
    stories: stories
  };
}

export function storiesIdFetched(ids) {
  return {
    type: STORIES_ID_FETCH_SUCCEEDED,
    ids: ids
  };
}

export function newStoriesIdFetched(ids) {
  return {
    type: NEWSTORIES_ID_FETCH_SUCCEEDED,
    ids: ids
  };
}

export function newStoriesIdFetchFaild(message) {
  return {
    type: NEWSTORIES_ID_FETCH_FAILED,
    message: message
  };
}

export function noMoreStoryToFetch() {
  return {
    type: NO_MORE_STORY_TO_FETCH
  };
}

export function storiesLoadingStart() {
  return {
    type: STORIES_LOADING_START
  };
}

export function storiesLoadingEnd() {
  return {
    type: STORIES_LOADING_END
  };
}

export function storiesFetchFailed(message) {
  return {
    type: STORIES_FETCH_FAILED,
    message: message
  };
}
