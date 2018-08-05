export const LOAD_MOST_RECENT = 'LOAD_MOST_RECENT';
export const LOAD_MORE_STORIES = 'LOAD_MORE_STORIES';

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
