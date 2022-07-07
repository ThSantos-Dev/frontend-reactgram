// Objetivo: Lidar com as ações do usuário

// Import - Redux
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import - Services
import userService from "../services/userService";

// Estado inicial
const initialState = {
  user: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Função responsável por pegar os detalhes do perfil do usuário logado
export const profile = createAsyncThunk(
  "user/profile",
  async (user, thunkAPI) => {
    // Resgatando o token do usuário autenticado do Slice de auth
    const token = thunkAPI.getState().auth.user.token;

    // Chamando o service de usuário
    const data = userService.profile(user, token);

    // Retornando os dados obtidos ou uma mensagem de erro
    return data;
  }
);

// Função responsável por atualizar os dados do perfil do usuário logado
export const updateProfile = createAsyncThunk(
  "user/update",
  async (user, thunkAPI) => {
    // Resgatando o token do usuário logado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando o service de usuário para realizar a atualização do perfil dele
    const data = await userService.updateProfile(user, token);

    // Validação para verificar se houve erros
    if (data.errors) {
      // Retornando uma mensagem de erro
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Função responsável por pegar detalhes de um usuário através do ID
export const getUserDetails = createAsyncThunk(
  "user/get",
  async (id, thunkAPI) => {
    // Chamando a função do service para pegar os dados do usuário pelo ID
    const data = await userService.getUserDetails(id);

    // Retornando os dados encontrados ou uma mensagem de erro
    return data;
  }
);

// Criando o reducer
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Perfil
      .addCase(profile.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(profile.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload;
      })

      // Atualização do perfil
      .addCase(updateProfile.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload;
        state.message = "Usuário atualizado com sucesso!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        // Caso aconteça erros
        state.loading = false;
        state.error = action.payload;
        state.user = {};
      })

      // Detalhes de um usuário
      .addCase(getUserDetails.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.user = action.payload;
      });
  },
});

// Exportando o reducer
export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;
