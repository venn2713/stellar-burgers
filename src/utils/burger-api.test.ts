import * as burgerApi from './burger-api';
import ingredientsMock from './__mocks__/api_responses/ingredients.json';
import feedsMock from './__mocks__/api_responses/feeds.json';
import registerMock from './__mocks__/api_responses/register.json';
import loginMock from './__mocks__/api_responses/login.json';
import userMock from './__mocks__/api_responses/user.json';
import orderBurgerMock from './__mocks__/api_responses/order_burger.json';
import ordersMock from './__mocks__/api_responses/orders.json';
import refreshTokenMock from './__mocks__/api_responses/refresh_token.json';
import logoutMock from './__mocks__/api_responses/logout.json';

const fetchMock = (mockData: any) =>
  jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockData)
  });

describe('burger-api', () => {
  beforeEach(() => {
    if (!global.fetch) {
      Object.defineProperty(global, 'fetch', {
        value: jest.fn(),
        writable: true
      });
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('getIngredientsApi returns ingredients', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(ingredientsMock));
    const data = await burgerApi.getIngredientsApi();
    expect(data).toEqual(ingredientsMock.data);
  });

  it('getFeedsApi returns feeds', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(feedsMock));
    const data = await burgerApi.getFeedsApi();
    expect(data).toEqual(feedsMock);
  });

  it('registerUserApi returns user data', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(registerMock));
    const data = await burgerApi.registerUserApi({
      email: 'test@example.com',
      password: 'password',
      name: 'Test User'
    });
    expect(data).toEqual(registerMock);
  });

  it('loginUserApi returns login data', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(loginMock));
    const data = await burgerApi.loginUserApi({
      email: 'test@example.com',
      password: 'password'
    });
    expect(data).toEqual(loginMock);
  });

  it('getUserApi returns user', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(userMock));
    const data = await burgerApi.getUserApi();
    expect(data).toEqual(userMock);
  });

  it('orderBurgerApi returns order', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(orderBurgerMock));
    const data = await burgerApi.orderBurgerApi([
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093e'
    ]);
    expect(data).toEqual(orderBurgerMock);
  });

  it('getOrdersApi returns orders', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(ordersMock));
    const data = await burgerApi.getOrdersApi();
    expect(data).toEqual(ordersMock.orders);
  });

  it('refreshToken returns new tokens', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(refreshTokenMock));
    const data = await burgerApi.refreshToken();
    expect(data).toEqual(refreshTokenMock);
  });

  it('logoutApi returns logout result', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(logoutMock));
    const data = await burgerApi.logoutApi();
    expect(data).toEqual(logoutMock);
  });

  it('updateUserApi returns updated user', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(userMock));
    const data = await burgerApi.updateUserApi({
      name: 'Updated Name',
      email: 'updated@example.com'
    });
    expect(data).toEqual(userMock);
  });

  it('forgotPasswordApi returns success', async () => {
    const forgotPasswordResponse = {
      success: true,
      message: 'Password reset email sent'
    };
    jest
      .spyOn(global, 'fetch')
      .mockImplementation(fetchMock(forgotPasswordResponse));
    const data = await burgerApi.forgotPasswordApi({
      email: 'test@example.com'
    });
    expect(data).toEqual(forgotPasswordResponse);
  });

  it('resetPasswordApi returns success', async () => {
    const resetPasswordResponse = {
      success: true,
      message: 'Password successfully reset'
    };
    jest
      .spyOn(global, 'fetch')
      .mockImplementation(fetchMock(resetPasswordResponse));
    const data = await burgerApi.resetPasswordApi({
      password: 'newPassword',
      token: 'reset-token'
    });
    expect(data).toEqual(resetPasswordResponse);
  });

  it('getOrderByNumberApi returns order by number', async () => {
    const orderByNumberResponse = {
      success: true,
      orders: [orderBurgerMock.order]
    };
    jest
      .spyOn(global, 'fetch')
      .mockImplementation(fetchMock(orderByNumberResponse));
    const data = await burgerApi.getOrderByNumberApi(78718);
    expect(data).toEqual(orderByNumberResponse);
  });

  it('getIngredientsApi rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Error' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(burgerApi.getIngredientsApi()).rejects.toEqual(errorResponse);
  });

  it('refreshToken rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Invalid token' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(burgerApi.refreshToken()).rejects.toEqual(errorResponse);
  });

  it('fetchWithRefresh handles jwt expired error', async () => {
    const jwtError = { message: 'jwt expired' };
    const mockFetch = jest
      .fn()
      .mockRejectedValueOnce(jwtError)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(refreshTokenMock)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(userMock)
      });

    jest.spyOn(global, 'fetch').mockImplementation(mockFetch);

    const data = await burgerApi.getUserApi();
    expect(data).toEqual(userMock);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('getFeedsApi rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Error' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(burgerApi.getFeedsApi()).rejects.toEqual(errorResponse);
  });

  it('getOrdersApi rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Error' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(burgerApi.getOrdersApi()).rejects.toEqual(errorResponse);
  });

  it('orderBurgerApi rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Error' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(burgerApi.orderBurgerApi(['123'])).rejects.toEqual(
      errorResponse
    );
  });

  it('registerUserApi rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Error' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(
      burgerApi.registerUserApi({
        email: 'test@example.com',
        password: 'password',
        name: 'Test'
      })
    ).rejects.toEqual(errorResponse);
  });

  it('loginUserApi rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Error' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(
      burgerApi.loginUserApi({
        email: 'test@example.com',
        password: 'password'
      })
    ).rejects.toEqual(errorResponse);
  });

  it('forgotPasswordApi rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Error' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(
      burgerApi.forgotPasswordApi({
        email: 'test@example.com'
      })
    ).rejects.toEqual(errorResponse);
  });

  it('resetPasswordApi rejects when success is false', async () => {
    const errorResponse = { success: false, message: 'Error' };
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(errorResponse));
    await expect(
      burgerApi.resetPasswordApi({
        password: 'newPassword',
        token: 'reset-token'
      })
    ).rejects.toEqual(errorResponse);
  });

  it('getIngredientsApi rejects when data is null', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(null));
    await expect(burgerApi.getIngredientsApi()).rejects.toEqual(null);
  });

  it('getFeedsApi rejects when data is null', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(null));
    await expect(burgerApi.getFeedsApi()).rejects.toEqual(null);
  });

  it('getOrdersApi rejects when data is null', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(null));
    await expect(burgerApi.getOrdersApi()).rejects.toEqual(null);
  });

  it('orderBurgerApi rejects when data is null', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(null));
    await expect(burgerApi.orderBurgerApi(['123'])).rejects.toEqual(null);
  });

  it('registerUserApi rejects when data is null', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(null));
    await expect(
      burgerApi.registerUserApi({
        email: 'test@example.com',
        password: 'password',
        name: 'Test'
      })
    ).rejects.toEqual(null);
  });

  it('loginUserApi rejects when data is null', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(null));
    await expect(
      burgerApi.loginUserApi({
        email: 'test@example.com',
        password: 'password'
      })
    ).rejects.toEqual(null);
  });

  it('forgotPasswordApi rejects when data is null', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(null));
    await expect(
      burgerApi.forgotPasswordApi({
        email: 'test@example.com'
      })
    ).rejects.toEqual(null);
  });

  it('resetPasswordApi rejects when data is null', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock(null));
    await expect(
      burgerApi.resetPasswordApi({
        password: 'newPassword',
        token: 'reset-token'
      })
    ).rejects.toEqual(null);
  });

  it('fetchWithRefresh handles non-jwt errors', async () => {
    const otherError = { message: 'Network error' };
    jest.spyOn(global, 'fetch').mockRejectedValue(otherError);
    await expect(burgerApi.getUserApi()).rejects.toEqual(otherError);
  });

  it('checkResponse rejects when response is not ok', async () => {
    const errorData = { message: 'Server error' };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(errorData)
    } as Response);
    await expect(burgerApi.getIngredientsApi()).rejects.toEqual(errorData);
  });
});
