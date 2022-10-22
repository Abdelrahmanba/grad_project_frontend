import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "redux"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only navigation will be persisted
}

const reducers = combineReducers({
  user: userReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,

  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export default store
