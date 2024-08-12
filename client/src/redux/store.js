import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/auth.slice'
import quesSliceReducer from './Slices/ques.slice'
import ansSliceReducer from './Slices/ans.slice'

const Store = configureStore({
    reducer: {
        auth: authSliceReducer,
        ques: quesSliceReducer,
        ans: ansSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export default Store;