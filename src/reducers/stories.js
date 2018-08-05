type MapActionToKey = (action: any) => any;

export function storyIds({
  types,
  mapActionToKey
}: {
  types: { fetchSuccessType: string },
  mapActionToKey: MapActionToKey
}) {
  const { initialFetchSuccessType, fetchSuccessType } = types;

  return (state = [], action) => {
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
  types: { initialFetchSuccessType: string, fetchSuccessType: string },
  mapActionToKey: MapActionToKey
}) {
  const { fetchSuccessType } = types;

  return (state = [], action) => {
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
  mapActionToKey: MapActionToKey
}) {
  const { initialFetchSuccessType, fetchSuccessType } = types;

  const getRatio = ids => {
    const newest = ids[0];
    const oldest = ids[ids.length - 1];
    return ids.length / (newest + 1 - oldest);
  };

  return (state = 0, action) => {
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
  return (state = false, action) => {
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
