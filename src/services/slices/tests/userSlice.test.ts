import {
  userSlice,
  setUserCheck,
  getUser,
  updateUser,
  initialStateUser,
  register,
  login,
  logout
} from '@slices';

describe('userSlice', () => {
  describe('reducers', () => {
    describe('sync', () => {
      it('setUserCheck выставляет checkUser', () => {
        const action = setUserCheck();
        const newState = userSlice.reducer(initialStateUser, action);
        expect(newState.checkUser).toBe(true);
      });
    });

    describe('async', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('getUser.fulfilled: сохраняет пользователя', () => {
        const mockUser = { user: { email: 'testEmail', name: 'testName' } };
        const action = { type: getUser.fulfilled.type, payload: mockUser };
        const nextState = userSlice.reducer(initialStateUser, action);

        expect(nextState.email).toEqual(mockUser.user.email);
        expect(nextState.name).toEqual(mockUser.user.name);
      });

      it('updateUser.fulfilled: сохраняет пользователя', () => {
        const mockUser = { user: { email: 'newEmail', name: 'newName' } };
        const action = { type: updateUser.fulfilled.type, payload: mockUser };
        const nextState = userSlice.reducer(initialStateUser, action);

        expect(nextState.email).toEqual(mockUser.user.email);
        expect(nextState.name).toEqual(mockUser.user.name);
      });

      it('getUser.rejected: error.message', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: getUser.rejected.type,
          error: { message: 'Fetch error' }
        };
        const nextState = userSlice.reducer(initialStateUser, action);

        expect(nextState).toEqual(initialStateUser);
        expect(spy).toHaveBeenCalledWith('getUser rejected:', 'Fetch error');
      });

      it('getUser.rejected: error.message undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: getUser.rejected.type, error: {} };
        const nextState = userSlice.reducer(initialStateUser, action);
        expect(nextState).toEqual(initialStateUser);
        expect(spy).toHaveBeenCalledWith('getUser rejected:', undefined);
      });

      it('getUser.rejected: error undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: getUser.rejected.type };
        const nextState = userSlice.reducer(initialStateUser, action);
        expect(nextState).toEqual(initialStateUser);
        expect(spy).toHaveBeenCalledWith('getUser rejected:', undefined);
      });

      it('register.fulfilled: сохраняет пользователя и токены', () => {
        const mockPayload = {
          user: { email: 'reg@email', name: 'RegName' },
          accessToken: 'token',
          refreshToken: 'refresh'
        };
        const setCookieSpy = jest
          .spyOn(require('@cookie'), 'setCookie')
          .mockImplementation(() => {});
        const setItemSpy = jest
          .spyOn(window.localStorage.__proto__, 'setItem')
          .mockImplementation(() => {});
        const action = { type: register.fulfilled.type, payload: mockPayload };
        const nextState = userSlice.reducer(initialStateUser, action);
        expect(nextState.email).toBe(mockPayload.user.email);
        expect(nextState.name).toBe(mockPayload.user.name);
        expect(setCookieSpy).toHaveBeenCalledWith(
          'accessToken',
          mockPayload.accessToken
        );
        expect(setItemSpy).toHaveBeenCalledWith(
          'refreshToken',
          mockPayload.refreshToken
        );
      });

      it('register.rejected: error.message', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: register.rejected.type,
          error: { message: 'reg error' }
        };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('register rejected:', 'reg error');
      });

      it('register.rejected: error.message undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: register.rejected.type, error: {} };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('register rejected:', undefined);
      });

      it('register.rejected: error undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: register.rejected.type };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('register rejected:', undefined);
      });

      it('login.fulfilled: сохраняет пользователя и токены', () => {
        const mockPayload = {
          user: { email: 'log@email', name: 'LogName' },
          accessToken: 'token',
          refreshToken: 'refresh'
        };
        const setCookieSpy = jest
          .spyOn(require('@cookie'), 'setCookie')
          .mockImplementation(() => {});
        const setItemSpy = jest
          .spyOn(window.localStorage.__proto__, 'setItem')
          .mockImplementation(() => {});
        const action = { type: login.fulfilled.type, payload: mockPayload };
        const nextState = userSlice.reducer(initialStateUser, action);
        expect(nextState.email).toBe(mockPayload.user.email);
        expect(nextState.name).toBe(mockPayload.user.name);
        expect(setCookieSpy).toHaveBeenCalledWith(
          'accessToken',
          mockPayload.accessToken
        );
        expect(setItemSpy).toHaveBeenCalledWith(
          'refreshToken',
          mockPayload.refreshToken
        );
      });

      it('login.rejected: error.message', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: login.rejected.type,
          error: { message: 'login error' }
        };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('login rejected:', 'login error');
      });

      it('login.rejected: error.message undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: login.rejected.type, error: {} };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('login rejected:', undefined);
      });

      it('login.rejected: error undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: login.rejected.type };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('login rejected:', undefined);
      });

      it('logout.fulfilled: очищает пользователя и токены', () => {
        const prevState = { ...initialStateUser, email: 'a', name: 'b' };
        const deleteCookieSpy = jest
          .spyOn(require('@cookie'), 'deleteCookie')
          .mockImplementation(() => {});
        const removeItemSpy = jest
          .spyOn(window.localStorage.__proto__, 'removeItem')
          .mockImplementation(() => {});
        const action = { type: logout.fulfilled.type };
        const nextState = userSlice.reducer(prevState, action);
        expect(nextState.email).toBe('');
        expect(nextState.name).toBe('');
        expect(deleteCookieSpy).toHaveBeenCalledWith('accessToken');
        expect(removeItemSpy).toHaveBeenCalledWith('refreshToken');
      });

      it('logout.rejected: error.message', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = {
          type: logout.rejected.type,
          error: { message: 'logout error' }
        };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('logout rejected:', 'logout error');
      });

      it('logout.rejected: error.message undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: logout.rejected.type, error: {} };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('logout rejected:', undefined);
      });

      it('logout.rejected: error undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: logout.rejected.type };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('logout rejected:', undefined);
      });

      it('updateUser.rejected: error.message undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: updateUser.rejected.type, error: {} };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('updateUser rejected:', undefined);
      });

      it('updateUser.rejected: error undefined', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const action = { type: updateUser.rejected.type };
        userSlice.reducer(initialStateUser, action);
        expect(spy).toHaveBeenCalledWith('updateUser rejected:', undefined);
      });
    });
  });

  describe('selectors', () => {
    const state = { user: { name: 'n', email: 'e', checkUser: true } };

    it('getName возвращает name', () => {
      expect(userSlice.selectors.getName(state)).toBe('n');
    });

    it('getEmail возвращает email', () => {
      expect(userSlice.selectors.getEmail(state)).toBe('e');
    });

    it('getCheckUser возвращает checkUser', () => {
      expect(userSlice.selectors.getCheckUser(state)).toBe(true);
    });
  });
});
