// Objetivo: consumir e gerenciar os estados dos posts

// Import - Redux
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import - Service
import photoService from "../services/photoService";

// Estado inicial
const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Função responsável por publicar uma foto
export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, thunkAPI) => {
    // Resgatando o token do usuário autenticado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando a função do service para publicar a foto
    const data = await photoService.publishPhoto(photo, token);

    // Validação para verificar se houve erros
    if (data.errors) {
      // Retornando a mensagem de erro
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Função responsável por listar as fotos de um usuário
export const getUserPhotos = createAsyncThunk(
  "photo/userPhotos",
  async (id, thunkAPI) => {
    // Resgatando o token do usuário logado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando a função do service que lista as fotos de um usuário pelo ID
    const data = await photoService.getUserPhotos(id, token);

    // Retornando os dados da requisição
    return data;
  }
);

// Função responsável por apagar uma foto pelo id
export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    // Resgatando o token do usuário logado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando o service que apaga uma foto
    const data = await photoService.deletePhoto(id, token);

    // Validação para verificar se houve erros
    if (data.errors) {
      // Retornando a mensagem de erro
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    // Retornando a resposta da requisição
    return data;
  }
);

// Função responsável por Atualização de uma foto (título)
export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, thunkAPI) => {
    // Resgatando o token do usuário autenticado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando a função do service que realiza a requisição para atualizar a foto
    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );

    // Validação para verificar se houve erros
    if (data.errors) {
      // Retornando uma mensagem de erro
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    // Retornado os dados da resposta da requisição
    return data;
  }
);

// Função responsável por Buscar detalhes de uma foto / publicação
export const getPhoto = createAsyncThunk(
  "photo/getPhoto",
  async (id, thunkAPI) => {
    // Resgatando o token do usuário logado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando a função do service que realiza a requisição para buscar informações da foto pelo id
    const data = await photoService.getPhoto(id, token);

    // Retornando os dados da foto
    return data;
  }
);

// Função responsável por atribuir like a uma foto
export const like = createAsyncThunk("photo/like", async (id, thunkAPI) => {
  // Resgatando o token do usuário logado
  const token = thunkAPI.getState().auth.user.token;

  // Chamando a função do service que realiza a requisição para atribuir like a foto
  const data = await photoService.like(id, token);

  // Validação para verificar se houve erros
  if (data.errors) {
    // Retornando uma mensagem de erro
    return thunkAPI.rejectWithValue(data.errors[0]);
  }

  // Retornando a resposta da requisição
  return data;
});

// Função responsável por adicionar comentário ao uma foto
export const comment = createAsyncThunk(
  "photos/comment",
  async (commentData, thunkAPI) => {
    // Resgatando o token do usuário logado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando a função do service para adicionar comentário a foto
    const data = await photoService.comment(
      { comment: commentData.comment },
      commentData.id,
      token
    );

    // Validação para verificar se houve erros
    if (data.errors) {
      // Retornando uma mensagem de erro
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    // Retornando os dados da resposta da requisição
    return data;
  }
);

// Função responsável por listar todas as fotos / publicações
export const getPhotos = createAsyncThunk(
  "photo/getAll",
  async (_, thunkAPI) => {
    // Resgatando o token do usuário logado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando a função do service para listar todas as fotos / publicações
    const data = await photoService.getPhotos(token);

    // Retornando a resposta da requisição
    return data;
  }
);

// Função responsável por buscar foto por titulo
export const searchPhotos = createAsyncThunk(
  "photo/search",
  async (query, thunkAPI) => {
    // Resgatando o token do usuário autenticado
    const token = thunkAPI.getState().auth.user.token;

    // Chamando a função do service para buscar foto pelo título
    const data = await photoService.searchPhotos(query, token);

    // Retornando a resposta da requisição
    return data;
  }
);

// Criando o Slice
export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Publicação de fotos
      .addCase(publishPhoto.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photo = action.payload;
        state.photos.unshift(state.photo); // Pegando a foto adicionada e colocando no array de fotos, para que não seja necessária outra requisição para o backend
        state.message = "Foto publicada com sucesso!";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        // Caso aconteça erros
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })

      // Fotos de um usuário
      .addCase(getUserPhotos.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photos = action.payload;
      })

      // Apagar foto / post
      .addCase(deletePhoto.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        // Filtrando as fotos do state, todas que forem diferente do id apagado será retornada
        // é feita essa operação para que não seja necessário uma nova requisição
        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });

        // Atribuindo a message a mensagem que é retornada pela API
        state.message = action.payload.message;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        // Caso aconteça erros
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })

      // Atualizar foto / post
      .addCase(updatePhoto.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photos.map((photo) => {
          // O photo._id é cada uma das fotos do state
          if (photo._id === action.payload.photo._id) {
            // atualizando a foto que está no front para que não seja necessário uma nova requisição
            return (photo.title = action.payload.photo.title);
          }
          // Se não a foto sem alterações
          return photo;
        });

        // Atribuindo a message a mensagem que é retornada pela API
        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        // Caso aconteça erros
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })

      // Buscar foto pelo ID
      .addCase(getPhoto.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photo = action.payload;
      })

      // Like
      .addCase(like.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        // Validação para verificar se o array existe e adiconar o id do usuário
        if (state.photo.likes) {
          state.photo.likes.push(action.payload.userId);
        }

        // Para like da página home e busca
        state.photos.map((photo) => {
          // Verificando se a foto é a mesma da informada para o like
          if (photo._id === action.payload.photoId) {
            return photo.likes.push(action.payload.userId);
          }

          // Caso não haja, retorna a foto sem alterações
          return photo;
        });

        // Atribuindo a message a mensagem que é retornada pela API
        state.message = action.payload.message;
      })
      .addCase(like.rejected, (state, action) => {
        // Caso aconteça erros
        state.loading = false;
        state.error = action.payload;
      })

      // Adicionar comentário
      .addCase(comment.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        // Adicionando ao state de photo um novo comentário
        state.photo.comments.push(action.payload.comment);

        // Atribuindo a message a mensagem que é retornada pela API
        state.message = action.payload.message;
      })
      .addCase(comment.rejected, (state, action) => {
        // Caso aconteça erros
        state.loading = false;
        state.error = action.payload;
      })

      // Listar todas as fotos
      .addCase(getPhotos.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photos = action.payload;
      })

      // Buscar foto pelo título
      .addCase(searchPhotos.pending, (state) => {
        // Caso esteja pendente
        state.loading = true;
        state.error = false;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        // Caso de certo
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photos = action.payload;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
