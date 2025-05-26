import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRouter
} from '@components';
import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '@app-store';
import { FeedsThunk, getUser, IngredientsThunk, setUserCheck } from '@slices';

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const modalBackground = location.state?.background as Location | undefined;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(IngredientsThunk());
    dispatch(FeedsThunk());
    dispatch(getUser())
      .unwrap()
      .catch(() => {})
      .finally(() => dispatch(setUserCheck()));
  }, [dispatch]);

  const handleModalClose = useCallback((): void => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={modalBackground || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={
            <ProtectedRouter isPublic>
              <Login />
            </ProtectedRouter>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRouter>
              <Profile />
            </ProtectedRouter>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRouter isPublic>
              <Register />
            </ProtectedRouter>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRouter isPublic>
              <ForgotPassword />
            </ProtectedRouter>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRouter>
              <ResetPassword />
            </ProtectedRouter>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRouter>
              <ProfileOrders />
            </ProtectedRouter>
          }
        />
      </Routes>
      {modalBackground && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ингредиент' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Заказ' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRouter>
                <Modal title='Заказ' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRouter>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
