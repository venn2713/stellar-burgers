import { feedSlice, FeedsThunk, initialStateFeeds } from '@slices';
import { testOrder1, testOrder2 } from './fixtures';

describe('feedSlice', () => {
  describe('reducers', () => {
    describe('async FeedsThunk', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('обрабатывает fulfilled', () => {
        const mockFeeds = {
          orders: [testOrder1, testOrder2],
          total: 10,
          totalToday: 2
        };
        const action = { type: FeedsThunk.fulfilled.type, payload: mockFeeds };
        const nextState = feedSlice.reducer(initialStateFeeds, action);

        expect(nextState.feeds).toEqual(mockFeeds);
      });

      it('обрабатывает rejected и не меняет feeds', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: FeedsThunk.rejected.type,
          error: { message: 'Error occurred' }
        };
        const nextState = feedSlice.reducer(initialStateFeeds, action);

        expect(nextState.feeds).toEqual(initialStateFeeds.feeds);
        expect(spy).toHaveBeenCalledWith(
          'FeedsThunk rejected:',
          'Error occurred'
        );
      });
    });
  });

  describe('selectors', () => {
    const mockFeeds = {
      orders: [testOrder1, testOrder2],
      total: 10,
      totalToday: 2
    };
    const state = { feeds: { feeds: mockFeeds } };

    it('getOrders возвращает orders', () => {
      expect(feedSlice.selectors.getOrders(state)).toEqual(mockFeeds.orders);
    });

    it('getTotal возвращает total', () => {
      expect(feedSlice.selectors.getTotal(state)).toBe(mockFeeds.total);
    });

    it('getTotalToday возвращает totalToday', () => {
      expect(feedSlice.selectors.getTotalToday(state)).toBe(
        mockFeeds.totalToday
      );
    });
  });
});
