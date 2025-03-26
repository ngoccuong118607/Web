import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { counterReducer } from './countReducer';
import { todosReducer } from './todosReducer';
import thunk from 'redux-thunk';

// Cấu hình redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['todos']
};

// Kết hợp các reducer
const rootReducer = combineReducers({
  count: counterReducer,
  todos: todosReducer
});

// Tạo reducer có tính năng lưu trữ
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Kiểm tra nếu Redux DevTools được cài đặt thì sử dụng, nếu không thì dùng `compose`
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Tạo store với middleware thunk và Redux DevTools
export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
