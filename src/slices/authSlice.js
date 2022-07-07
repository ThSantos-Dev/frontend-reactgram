// Objetivo: Lidar com o service de requisições de autenticação do usuário

// Import - Redux
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import - Service
import authService from "./../services/authService";

// Resgatando o usuário que foi armazenado no localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Estado inicial
const initialState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
};

/**
 * Registrando o usuário e já efetuando o login - sign in
 *
 * Parâmetros:
 * 1 - nome da entidade / ação
 * 2 - função
 */
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    // Chamando o service de autenticação para registrar o usuário
    const data = await authService.register(user);

    // Validação para verificar se houve erros
    if (data.errors) {
      // Retorna a mensagem de erro
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    // Retorna os dados do usuário cadastrado - payload
    return data;
  }
);

// Logout do usuário
export const logout = createAsyncThunk("auth/logout", async () => {
  // Chamando a função do service que realiza o logout
  await authService.logout()
});

// Login do usuário
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  // Chamando o service de autenticação para fazer o login do usuário
  const data = await authService.login(user)

  // Verificando se houve erros
  if(data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0])
  }

  // Retornando os dados do usuário
  return data
})

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registro
      .addCase(register.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        // Caso aconteça erros
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        // Caso aconteça erros
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
