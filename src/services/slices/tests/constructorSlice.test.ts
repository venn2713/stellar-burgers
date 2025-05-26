import {
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown,
  clearConstructor,
  constructorSlice,
  initialStateConstructor as state
} from '@slices';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';

const testBun: TConstructorIngredient = {
  _id: 'bun1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: '',
  id: 'bun-test-id'
};

const testIngredient: TConstructorIngredient = {
  _id: 'main1',
  name: 'Test Meat',
  type: 'main',
  proteins: 15,
  fat: 10,
  carbohydrates: 5,
  calories: 250,
  price: 120,
  image: '',
  image_large: '',
  image_mobile: '',
  id: 'meat-test-id'
};

const testSouce: TConstructorIngredient = {
  _id: 'sauce1',
  name: 'Test Sauce',
  type: 'sauce',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 50,
  price: 20,
  image: '',
  image_large: '',
  image_mobile: '',
  id: 'sauce-test-id'
};

describe('Constructor ingredients slice', () => {
  let baseState: typeof state;

  beforeEach(() => {
    baseState = JSON.parse(JSON.stringify(state));
  });

  describe('Adding ingredients', () => {
    it('should add a bun', () => {
      const action = addIngredient(testBun);
      const newState = constructorSlice.reducer(baseState, action);

      expect(newState.constructor.bun).toEqual(
        expect.objectContaining({ _id: 'bun1' })
      );
      expect(newState.constructor.ingredients).toHaveLength(0);
      expect(newState.buyBurgerStatus).toBe(false);
      expect(newState.orderData).toBeNull();
    });

    it('should add a meat ingredient', () => {
      const action = addIngredient(testIngredient);
      const newState = constructorSlice.reducer(baseState, action);

      expect(newState.constructor.bun).toBeNull();
      expect(newState.constructor.ingredients).toHaveLength(1);
      expect(newState.constructor.ingredients[0]).toEqual(
        expect.objectContaining({ _id: 'main1' })
      );
      expect(newState.buyBurgerStatus).toBe(false);
      expect(newState.orderData).toBeNull();
    });
  });

  describe('Modifying ingredients in the store', () => {
    let testState: typeof state;

    beforeEach(() => {
      testState = {
        constructor: {
          bun: testBun,
          ingredients: [testIngredient, testSouce]
        },
        buyBurgerStatus: false,
        orderData: null
      };
    });

    it('should move ingredient up', () => {
      const action = moveUp(1);
      const newState = constructorSlice.reducer(testState, action);

      expect(newState.constructor.ingredients[0]._id).toBe('sauce1');
      expect(newState.constructor.ingredients[1]._id).toBe('main1');
    });

    it('should not move first ingredient up', () => {
      const action = moveUp(0);
      const newState = constructorSlice.reducer(testState, action);

      expect(newState.constructor.ingredients[0]._id).toBe('main1');
      expect(newState.constructor.ingredients[1]._id).toBe('sauce1');
    });

    it('should not move ingredient up if index out of bounds', () => {
      const action = moveUp(-1);
      const newState = constructorSlice.reducer(testState, action);

      expect(newState).toEqual(testState);
    });

    it('should move ingredient down', () => {
      const action = moveDown(0);
      const newState = constructorSlice.reducer(testState, action);

      expect(newState.constructor.ingredients[0]._id).toBe('sauce1');
      expect(newState.constructor.ingredients[1]._id).toBe('main1');
    });

    it('should not move last ingredient down', () => {
      const action = moveDown(1);
      const newState = constructorSlice.reducer(testState, action);

      expect(newState.constructor.ingredients[1]._id).toBe('sauce1');
      expect(newState.constructor.ingredients[0]._id).toBe('main1');
    });

    it('should not move ingredient down if index out of bounds', () => {
      const action = moveDown(2);
      const newState = constructorSlice.reducer(testState, action);

      expect(newState).toEqual(testState);
    });

    it('should remove an ingredient', () => {
      const action = removeIngredient('sauce-test-id');
      const newState = constructorSlice.reducer(testState, action);

      expect(newState.constructor.ingredients).toHaveLength(1);
      expect(newState.constructor.ingredients[0]._id).toBe('main1');
    });

    it('should clear constructor', () => {
      const action = clearConstructor();
      const newState = constructorSlice.reducer(testState, action);

      expect(newState.constructor.bun).toBeNull();
      expect(newState.constructor.ingredients).toHaveLength(0);
      expect(newState.orderData).toBeNull();
    });
  });

  describe('Async: BuyBurgerThunk', () => {
    const order: TOrder = {
      _id: 'order-id-123',
      status: 'done',
      name: 'Test Order',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: 12345,
      ingredients: ['ingredient-id-1', 'ingredient-id-2']
    };

    it('should set status to true on pending', () => {
      const action = { type: 'feeds/buyBurger/pending' };
      const newState = constructorSlice.reducer(baseState, action);

      expect(newState.buyBurgerStatus).toBe(true);
      expect(newState.orderData).toBeNull();
    });

    it('should save order and set status to false on fulfilled', () => {
      const action = {
        type: 'feeds/buyBurger/fulfilled',
        payload: { order }
      };
      const newState = constructorSlice.reducer(
        { ...baseState, buyBurgerStatus: true },
        action
      );

      expect(newState.buyBurgerStatus).toBe(false);
      expect(newState.orderData).toEqual(order);
    });

    it('should set status to false and not change orderData on rejected', () => {
      const prevState = {
        ...baseState,
        buyBurgerStatus: true,
        orderData: { ...order }
      };
      const action = {
        type: 'feeds/buyBurger/rejected',
        error: new Error('Something went wrong')
      };
      const newState = constructorSlice.reducer(prevState, action);

      expect(newState.buyBurgerStatus).toBe(false);
      expect(newState.orderData).toEqual(order);
    });
  });

  describe('Selectors', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          constructorIngredients: constructorSlice.reducer
        },
        preloadedState: {
          constructorIngredients: baseState
        }
      });
    });

    it('getConstructorIngredients returns constructor object', () => {
      expect(
        constructorSlice.selectors.getConstructorIngredients(
          store.getState() as { constructorIngredients: typeof baseState }
        )
      ).toEqual(baseState.constructor);
    });

    it('getStatusBuyBurger returns buyBurgerStatus', () => {
      expect(
        constructorSlice.selectors.getStatusBuyBurger(
          store.getState() as { constructorIngredients: typeof baseState }
        )
      ).toBe(baseState.buyBurgerStatus);
    });

    it('getOrderData returns orderData', () => {
      expect(
        constructorSlice.selectors.getOrderData(
          store.getState() as { constructorIngredients: typeof baseState }
        )
      ).toBe(baseState.orderData);
    });

    it('getOrderData returns correct order after fulfilled', () => {
      const order = {
        _id: 'id',
        status: 'done',
        name: 'Order',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: []
      };
      store = configureStore({
        reducer: {
          constructorIngredients: constructorSlice.reducer
        },
        preloadedState: {
          constructorIngredients: { ...baseState, orderData: order }
        }
      });
      expect(
        constructorSlice.selectors.getOrderData(
          store.getState() as { constructorIngredients: typeof baseState }
        )
      ).toBe(order);
    });
  });
});
