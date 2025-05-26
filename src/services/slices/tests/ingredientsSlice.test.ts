import {
  ingredientsSlice,
  IngredientsThunk,
  initialStateIngredients,
  getIngredients,
  ingredientsIsLoading
} from '@slices';
import { testBun, testIngredient } from './fixtures';
import * as api from '@api';

jest.mock('@api');

describe('ingredientsSlice', () => {
  describe('reducers', () => {
    describe('async IngredientsThunk', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('pending: выставляет loading и сбрасывает ошибку', () => {
        const action = { type: IngredientsThunk.pending.type };
        const newState = ingredientsSlice.reducer(
          initialStateIngredients,
          action
        );
        expect(newState.loading).toBe(true);
        expect(newState.error).toBeNull();
        expect(newState.ingredients).toHaveLength(0);
      });

      it('fulfilled: сохраняет ингредиенты', () => {
        const mockIngredients = [testBun, testIngredient];
        const action = {
          type: IngredientsThunk.fulfilled.type,
          payload: mockIngredients
        };
        const newState = ingredientsSlice.reducer(
          initialStateIngredients,
          action
        );

        expect(newState.loading).toBe(false);
        expect(newState.error).toBeNull();
        expect(newState.ingredients).toEqual(mockIngredients);
      });

      it('rejected: сохраняет ошибку', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: IngredientsThunk.rejected.type,
          error: { message: 'Error occurred' }
        };
        const newState = ingredientsSlice.reducer(
          initialStateIngredients,
          action
        );

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe('Error occurred');
        expect(newState.ingredients).toHaveLength(0);
        expect(spy).toHaveBeenCalledWith(
          'IngredientsThunk rejected:',
          'Error occurred'
        );
      });

      it('rejected: error.message undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: IngredientsThunk.rejected.type, error: {} };
        const newState = ingredientsSlice.reducer(
          initialStateIngredients,
          action
        );
        expect(newState.loading).toBe(false);
        expect(newState.error).toBe('Unknown error');
        expect(spy).toHaveBeenCalledWith(
          'IngredientsThunk rejected:',
          undefined
        );
      });

      it('rejected: error undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: IngredientsThunk.rejected.type };
        const newState = ingredientsSlice.reducer(
          initialStateIngredients,
          action
        );
        expect(newState.loading).toBe(false);
        expect(newState.error).toBe('Unknown error');
        expect(spy).toHaveBeenCalledWith(
          'IngredientsThunk rejected:',
          undefined
        );
      });

      it('thunk вызывает getIngredientsApi', async () => {
        const mockResponse = [testBun, testIngredient];
        (api.getIngredientsApi as jest.Mock).mockResolvedValue(mockResponse);
        const thunk = IngredientsThunk();
        const dispatch = jest.fn();
        const getState = jest.fn();
        await thunk(dispatch, getState, undefined);
        expect(api.getIngredientsApi).toHaveBeenCalled();
      });

      it('pending: сбрасывает ошибку', () => {
        const prevState = {
          ingredients: [],
          loading: false,
          error: 'Some error'
        };
        const action = { type: IngredientsThunk.pending.type };
        const newState = ingredientsSlice.reducer(prevState, action);
        expect(newState.loading).toBe(true);
        expect(newState.error).toBeNull();
      });

      it('fulfilled: пустой payload', () => {
        const action = { type: IngredientsThunk.fulfilled.type, payload: [] };
        const newState = ingredientsSlice.reducer(
          initialStateIngredients,
          action
        );
        expect(newState.loading).toBe(false);
        expect(newState.error).toBeNull();
        expect(newState.ingredients).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    const mockIngredients = [testBun, testIngredient];
    const state = {
      ingredients: { ingredients: mockIngredients, loading: true, error: null }
    };

    it('getIngredients возвращает ингредиенты', () => {
      expect(getIngredients(state)).toEqual(mockIngredients);
    });

    it('ingredientsIsLoading возвращает loading', () => {
      expect(ingredientsIsLoading(state)).toBe(true);
    });
  });
});
