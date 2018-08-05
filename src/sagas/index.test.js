import {
  getStoryIds,
  getStories,
  getAverageStoryOccurrenceRatio,
  fetchItemsByIds,
  fetchStories,
  fetchNewStoryIds,
  getMoreStories
} from './index';
import * as actions from '../actions';
import api from '../services';
import {
  takeLatest,
  take,
  put,
  call,
  fork,
  select,
  all
} from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';

describe('fetchItemsByIds saga test', () => {
  const mockStoryIds = [12, 13];
  const mockStories = [
    {
      id: 12,
      text: 'hello'
    },
    {
      id: 13,
      text: 'hello'
    }
  ];
  const generator = fetchItemsByIds(mockStoryIds);

  it('should call api.fetch using all ids from storyIds', () => {
    expect(generator.next().value).toEqual(
      all(mockStoryIds.map(id => call(api.fetch, `/item/${id}`, {})))
    );
  });

  it('should yield actions.storiesFetched(mockStories)', () => {
    expect(generator.next(mockStories).value).toEqual(
      put(actions.storiesFetched(mockStories))
    );
  });

  it('it should be done', () => {
    expect(generator.next().done).toEqual(true);
  });
});

describe('fetchStories saga test', () => {
  const mockLastStoryId = 12;
  const generator = fetchStories(mockLastStoryId);
  const mockStories = [
    {
      type: 'story',
      id: 12,
      text: 'hello'
    },
    {
      type: 'non-story',
      id: 13,
      text: 'hello'
    }
  ];

  it('should select getAverageStoryOccurrenceRatio', () => {
    expect(generator.next().value).toEqual(
      select(getAverageStoryOccurrenceRatio)
    );
  });

  it('should call api.fetch using all ids from calculated range', () => {
    const range = [12, 11];
    expect(generator.next(25).value).toEqual(
      all(range.map(id => call(api.fetch, `/item/${id}`, {})))
    );
  });

  it('should yield actions.storiesFetched(mockStories)', () => {
    expect(generator.next(mockStories).value).toEqual(
      put(actions.storiesIdFetched([12]))
    );
  });

  it('should yield actions.storiesFetched(mockStories)', () => {
    expect(generator.next().value).toEqual(
      put(
        actions.storiesFetched([
          {
            type: 'story',
            id: 12,
            text: 'hello'
          }
        ])
      )
    );
  });

  it('it should be done', () => {
    expect(generator.next().done).toEqual(true);
  });
});

describe('fetchNewStoryIds saga test', () => {
  const generator1 = cloneableGenerator(fetchNewStoryIds)();
  const generator2 = generator1.clone();

  it('should call api.fetch using all ids from calculated range', () => {
    expect(generator1.next().value).toEqual(call(api.fetch, '/newstories', {}));
  });

  it('should yield actions.newStoriesIdFetched(ids)', () => {
    expect(generator1.next([11]).value).toEqual(
      put(actions.newStoriesIdFetched([11]))
    );
  });

  it('it should be done', () => {
    expect(generator1.next().done).toEqual(true);
  });

  it('should yield actions.newStoriesIdFetchFaild(e.message)', () => {
    generator2.next();
    expect(generator2.throw({ message: 'some error' }).value).toEqual(
      put(actions.newStoriesIdFetchFaild('some error'))
    );
  });

  it('it should be done', () => {
    expect(generator2.next().done).toEqual(true);
  });
});

describe('getMoreStories saga test', () => {
  const generator1 = cloneableGenerator(getMoreStories)();
  const generator2 = generator1.clone();
  const generator3 = generator1.clone();
  const generator4 = generator1.clone();

  /* senario 1 */

  it('should select getStoryIds', () => {
    expect(generator1.next().value).toEqual(select(getStoryIds));
  });

  it('should select getStories', () => {
    expect(generator1.next().value).toEqual(select(getStories));
  });

  it('should yield actions.newStoriesIdFetched(ids)', () => {
    const mockStories = [
      {
        type: 'story',
        id: 1,
        text: 'hello'
      },
      {
        type: 'non-story',
        id: 0,
        text: 'hello'
      }
    ];

    expect(generator1.next(mockStories).value).toEqual(
      put(actions.noMoreStoryToFetch())
    );
  });

  it('it should be done', () => {
    expect(generator1.next().done).toEqual(true);
  });

  /* senario 2 */

  it('should call actions.storiesLoadingStart()', () => {
    const mockStories = [
      {
        type: 'story',
        id: 150,
        text: 'hello'
      },
      {
        type: 'non-story',
        id: 130,
        text: 'hello'
      }
    ];
    generator2.next();
    generator2.next([150, 130, 12]);

    expect(generator2.next(mockStories).value).toEqual(
      put(actions.storiesLoadingStart())
    );
  });

  it('should call fetchItemsByIds', () => {
    expect(generator2.next().value).toEqual(call(fetchItemsByIds, [12]));
  });

  it('should call actions.storiesLoadingEnd()', () => {
    expect(generator2.next().value).toEqual(put(actions.storiesLoadingEnd()));
  });

  it('it should be done', () => {
    expect(generator2.next().done).toEqual(true);
  });

  /* senario 3 */

  it('should call actions.storiesLoadingStart()', () => {
    const mockStories = [
      {
        type: 'story',
        id: 150,
        text: 'hello'
      },
      {
        type: 'non-story',
        id: 130,
        text: 'hello'
      }
    ];
    generator3.next();
    generator3.next([150, 130]);

    expect(generator3.next(mockStories).value).toEqual(
      put(actions.storiesLoadingStart())
    );
  });

  it('should call fetchStories', () => {
    expect(generator3.next().value).toEqual(call(fetchStories, 129));
  });

  it('should call actions.storiesLoadingEnd()', () => {
    expect(generator3.next().value).toEqual(put(actions.storiesLoadingEnd()));
  });

  it('it should be done', () => {
    expect(generator3.next().done).toEqual(true);
  });

  /* senario 4 */

  it('should call actions.storiesFetchFailed(e.message)', () => {
    generator4.next();
    expect(generator4.throw({ message: 'some error' }).value).toEqual(
      put(actions.storiesFetchFailed('some error'))
    );
  });

  it('should call actions.storiesLoadingEnd()', () => {
    expect(generator4.next().value).toEqual(put(actions.storiesLoadingEnd()));
  });

  it('it should be done', () => {
    expect(generator4.next().done).toEqual(true);
  });
});
