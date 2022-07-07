// Arquivo responsável por lidar com o Redux

import {configureStore} from '@reduxjs/toolkit'

// Import - Reducers
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import photoReducer from './slices/photoSlice'

// Configurando os reducers
export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        photo: photoReducer
    },
})