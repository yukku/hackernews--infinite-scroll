/* @flow */
type StoryType = { id: number };
type ErrorType = {
  error: boolean,
  message: string
};

export function storyIds({
  types,
  mapActionToKey
}: {
  types: { initialFetchSuccessType: string, fetchSuccessType: string },
  mapActionToKey: (action: { ids: Array<number> }) => Array<number>
}) {
  const { initialFetchSuccessType, fetchSuccessType } = types;

  return (
    state: Array<number> = [],
    action: { type: string, ids: Array<number> }
  ): Array<number> => {
    const ids = mapActionToKey(action);
    switch (action.type) {
      case initialFetchSuccessType:
      case fetchSuccessType:
        return state.concat(ids);
      default:
        return state;
    }
  };
}

export function stories({
  types,
  mapActionToKey
}: {
  types: { fetchSuccessType: string },
  mapActionToKey: (action: { stories: Array<StoryType> }) => Array<StoryType>
}) {
  const { fetchSuccessType } = types;

  return (
    state: Array<StoryType> = [],
    action: { type: string, stories: Array<StoryType> }
  ): Array<StoryType> => {
    const stories = mapActionToKey(action);
    switch (action.type) {
      case fetchSuccessType:
        return state.concat(stories);
      default:
        return state;
    }
  };
}

export function averageStoryOccurrenceRatio({
  types,
  mapActionToKey
}: {
  types: { initialFetchSuccessType: string, fetchSuccessType: string },
  mapActionToKey: (action: { ids: Array<number> }) => Array<number>
}) {
  const { initialFetchSuccessType, fetchSuccessType } = types;

  const getRatio = ids => {
    const newest = ids[0];
    const oldest = ids[ids.length - 1];
    return ids.length / (newest + 1 - oldest);
  };

  return (state: number = 1, action: { type: string, ids: Array<number> }): number => {
    switch (action.type) {
      case initialFetchSuccessType:
        return getRatio(mapActionToKey(action));
      case fetchSuccessType:
        // Calculate Exponential moving average
        // average = average + (value - average) / FACTOR
        // https://stackoverflow.com/questions/12636613/how-to-calculate-moving-average-without-keeping-the-count-and-data-total
        return state + (getRatio(mapActionToKey(action)) - state) / 5;
      default:
        return state;
    }
  };
}

export function isLoading({ types }: { types: { startType: string, endType: string } }) {
  const { startType, endType } = types;
  return (state: boolean = false, action: { type: string }): boolean => {
    switch (action.type) {
      case startType:
        return true;
      case endType:
        return false;
      default:
        return state;
    }
  };
}

export function errors({
  types,
  mapActionToKey
}: {
  types: { pageLoadErrorType: string, storiesLoadErrorType: string },
  mapActionToKey: (action: { message: string }) => string
}) {
  const { pageLoadErrorType, storiesLoadErrorType } = types;

  const initState = {
    error: false,
    message: ''
  };

  return (state: ErrorType = initState, action: { type: string, message: string }): ErrorType => {
    switch (action.type) {
      case pageLoadErrorType:
      case storiesLoadErrorType:
        return {
          error: true,
          message: mapActionToKey(action)
        };
      default:
        return initState;
    }
  };
}
