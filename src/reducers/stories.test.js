import {
  storyIds,
  stories,
  averageStoryOccurrenceRatio,
  isLoading
} from './stories.js';

describe('storyIds reducer', () => {
  let storyIdsReducer;

  beforeEach(() => {
    storyIdsReducer = storyIds({
      types: {
        initialFetchSuccessType: 'initialFetchSuccessType',
        fetchSuccessType: 'fetchSuccessType'
      },
      mapActionToKey: action => action.ids
    });
  });

  it('should return the initial state', () => {
    expect(storyIdsReducer(undefined, {})).toEqual([]);
  });

  it('should handle initialFetchSuccessType', () => {
    expect(
      storyIdsReducer([], {
        type: 'initialFetchSuccessType',
        ids: [13, 12]
      })
    ).toEqual([13, 12]);
  });

  it('should handle fetchSuccessType', () => {
    expect(
      storyIdsReducer([1], {
        type: 'fetchSuccessType',
        ids: [13, 12]
      })
    ).toEqual([1, 13, 12]);
  });
});

describe('stories reducer', () => {
  let storiesReducer;
  const mockStory = {
    id: '123',
    text: 'hello'
  };

  beforeEach(() => {
    storiesReducer = stories({
      types: {
        fetchSuccessType: 'fetchSuccessType'
      },
      mapActionToKey: action => action.stories
    });
  });

  it('should return the initial state', () => {
    expect(storiesReducer(undefined, {})).toEqual([]);
  });

  it('should handle fetchSuccessType', () => {
    expect(
      storiesReducer([mockStory], {
        type: 'fetchSuccessType',
        stories: [mockStory, mockStory]
      })
    ).toEqual([mockStory, mockStory, mockStory]);
  });
});

describe('averageStoryOccurrenceRatio reducer', () => {
  let averageStoryOccurrenceRatioReducer;

  beforeEach(() => {
    averageStoryOccurrenceRatioReducer = averageStoryOccurrenceRatio({
      types: {
        initialFetchSuccessType: 'initialFetchSuccessType',
        fetchSuccessType: 'fetchSuccessType'
      },
      mapActionToKey: action => action.ids
    });
  });

  it('should return the initial state', () => {
    expect(averageStoryOccurrenceRatioReducer(undefined, {})).toEqual(0);
  });

  it('should handle initialFetchSuccessType', () => {
    expect(
      averageStoryOccurrenceRatioReducer(0, {
        type: 'initialFetchSuccessType',
        ids: [13, 12, 9]
      })
    ).toEqual(0.6);
  });

  it('should handle initialFetchSuccessType', () => {
    expect(
      averageStoryOccurrenceRatioReducer(0, {
        type: 'initialFetchSuccessType',
        ids: [13, 12, 11]
      })
    ).toEqual(1);
  });

  it('should handle initialFetchSuccessType', () => {
    expect(
      averageStoryOccurrenceRatioReducer(0, {
        type: 'initialFetchSuccessType',
        ids: [13, 12, 9]
      })
    ).toEqual(0.6);
  });

  it('should handle fetchSuccessType', () => {
    expect(
      averageStoryOccurrenceRatioReducer(1, {
        type: 'fetchSuccessType',
        ids: [14, 13, 12]
      })
    ).toEqual(1);
  });

  it('should handle fetchSuccessType', () => {
    expect(
      averageStoryOccurrenceRatioReducer(0.3, {
        type: 'fetchSuccessType',
        ids: [1400000, 100000, 1288]
      })
    ).toEqual(0.24000042896577067);
  });
});

describe('isLoading reducer', () => {
  let isLoadingReducer;

  beforeEach(() => {
    isLoadingReducer = isLoading({
      types: {
        startType: 'startType',
        endType: 'endType'
      }
    });
  });

  it('should return the initial state', () => {
    expect(isLoadingReducer(undefined, {})).toEqual(false);
  });

  it('should handle startType', () => {
    expect(
      isLoadingReducer(false, {
        type: 'startType'
      })
    ).toEqual(true);
  });

  it('should handle endType', () => {
    expect(
      isLoadingReducer(true, {
        type: 'endType'
      })
    ).toEqual(false);
  });
});
