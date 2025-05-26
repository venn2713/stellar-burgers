import { ordersSlice, userOrdersThunk, initialStateOrder } from '@slices';
import { testOrder1, testOrder2 } from './fixtures';

describe('ordersSlice', () => {
  describe('reducers', () => {
    describe('async userOrdersThunk', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('pending: выставляет isLoad и очищает userOrders', () => {
        const action = { type: userOrdersThunk.pending.type };
        const nextState = ordersSlice.reducer(initialStateOrder, action);

        expect(nextState.isLoad).toBe(true);
        expect(nextState.userOrders).toHaveLength(0);
      });

      it('fulfilled: сохраняет userOrders', () => {
        const mockOrders = [testOrder1, testOrder2];
        const action = {
          type: userOrdersThunk.fulfilled.type,
          payload: mockOrders
        };
        const nextState = ordersSlice.reducer(initialStateOrder, action);

        expect(nextState.isLoad).toBe(false);
        expect(nextState.userOrders).toEqual(mockOrders);
      });

      it('rejected: error.message', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: userOrdersThunk.rejected.type,
          error: { message: 'Error occurred' }
        };
        const nextState = ordersSlice.reducer(initialStateOrder, action);

        expect(nextState.isLoad).toBe(false);
        expect(nextState.userOrders).toHaveLength(0);
        expect(spy).toHaveBeenCalledWith(
          'userOrdersThunk rejected:',
          'Error occurred'
        );
      });

      it('rejected: error.message undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: userOrdersThunk.rejected.type,
          error: {}
        };
        const nextState = ordersSlice.reducer(initialStateOrder, action);
        expect(nextState.isLoad).toBe(false);
        expect(nextState.userOrders).toHaveLength(0);
        expect(spy).toHaveBeenCalledWith(
          'userOrdersThunk rejected:',
          undefined
        );
      });

      it('rejected: error undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: userOrdersThunk.rejected.type
          // error is undefined
        };
        const nextState = ordersSlice.reducer(initialStateOrder, action);
        expect(nextState.isLoad).toBe(false);
        expect(nextState.userOrders).toHaveLength(0);
        expect(spy).toHaveBeenCalledWith(
          'userOrdersThunk rejected:',
          undefined
        );
      });
    });
  });

  describe('selectors', () => {
    const mockOrders = [testOrder1, testOrder2];
    const state = { orders: { isLoad: true, userOrders: mockOrders } };

    it('isLoading возвращает isLoad', () => {
      expect(ordersSlice.selectors.isLoading(state)).toBe(true);
    });

    it('getUserOrders возвращает userOrders', () => {
      expect(ordersSlice.selectors.getUserOrders(state)).toEqual(mockOrders);
    });
  });
});
