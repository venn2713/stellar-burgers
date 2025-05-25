import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { renderHook } from '@testing-library/react';
import store, { useAppDispatch, useAppSelector } from './store';
import { rootReducer, RootState } from './store';
import {
  ingredientsSlice,
  constructorSlice,
  feedSlice,
  userSlice,
  ordersSlice
} from '@slices';

const slices = [
  { key: 'ingredients', slice: ingredientsSlice },
  { key: 'constructorIngredients', slice: constructorSlice },
  { key: 'feeds', slice: feedSlice },
  { key: 'user', slice: userSlice },
  { key: 'orders', slice: ordersSlice }
] as const;

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ReduxProvider store={store}> {children} </ReduxProvider>
);

describe('rootReducer', () => {
  let initialState: RootState;

  beforeAll(() => {
    initialState = rootReducer(undefined, { type: 'unknown' });
  });

  it.each(slices)('should set initial state for $key', ({ key, slice }) => {
    expect(initialState[key as keyof RootState]).toEqual(
      slice.getInitialState()
    );
  });

  it('should not contain unexpected keys', () => {
    const expectedKeys = slices.map((s) => s.key).sort();
    const actualKeys = Object.keys(initialState).sort();
    expect(actualKeys).toEqual(expectedKeys);
  });
});

describe('custom hooks', () => {
  it('useAppDispatch returns store.dispatch', () => {
    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: Wrapper
    });
    expect(result.current).toBe(store.dispatch);
  });

  it('useAppSelector selects state', () => {
    const { result } = renderHook(() => useAppSelector((state) => state.user), {
      wrapper: Wrapper
    });
    expect(result.current).toEqual(store.getState().user);
  });
});
