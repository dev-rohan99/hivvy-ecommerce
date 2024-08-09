import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./features/admin/adminSlice";

// create store
const store = configureStore({
    reducer: {
        admin: adminReducer,
    },
    middleware: (getDefaultMiddlewares) => getDefaultMiddlewares(),
    devTools: true
});

export default store;
