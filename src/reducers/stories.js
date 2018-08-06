/* @flow */
type MapActionToKeyType = (action: any) => any;
type ActionType = { type: string };
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
  mapActionToKey: MapActionToKeyType
}) {
  const { initialFetchSuccessType, fetchSuccessType } = types;

  return (state: Array<number> = [], action: ActionType): Array<number> => {
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
  mapActionToKey: MapActionToKeyType
}) {
  const { fetchSuccessType } = types;

  return (
    state: Array<StoryType> = [],
    action: ActionType
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
  mapActionToKey: MapActionToKeyType
}) {
  const { initialFetchSuccessType, fetchSuccessType } = types;

  const getRatio = ids => {
    const newest = ids[0];
    const oldest = ids[ids.length - 1];
    return ids.length / (newest + 1 - oldest);
  };

  return (state: number = 0, action: ActionType): number => {
    switch (action.type) {
      case initialFetchSuccessType:
        return getRatio(mapActionToKey(action));
      case fetchSuccessType:
        // Calculate Weighted moving average
        // average = average + (value - average) / FACTOR
        // https://stackoverflow.com/questions/12636613/how-to-calculate-moving-average-without-keeping-the-count-and-data-total
        return state + (getRatio(mapActionToKey(action)) - state) / 5;
      default:
        return state;
    }
  };
}

export function isLoading({
  types
}: {
  types: { startType: string, endType: string }
}) {
  const { startType, endType } = types;
  return (state: boolean = false, action: ActionType): boolean => {
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
  mapActionToKey: MapActionToKeyType
}) {
  const { pageLoadErrorType, storiesLoadErrorType } = types;

  const initState = {
    error: false,
    message: ''
  };

  return (state: ErrorType = initState, action: ActionType): ErrorType => {
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
