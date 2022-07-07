// Arquivo de configurações

// Url base da API
export const api = "https://reactgram.herokuapp.com/api";

// Pasta base das imagens
export const uploads = "https://reactgram.herokuapp.com/uploads";

/** 
 * Função responsável por simplificar as configurações das requisições
 * 
 * @param {String} method - Método http (GET, POST, PUT, DELETE)
 * @param {Object} data - Corpo da requisição
 * @param {JsonWebKey} toke - Token JWT para autenticação
 * @param {ImageData} image - Imagem
 */
export const requestConfig = (method, data, token = null, image = null) => {
  let config;

  // Se vier a imagem, significa que os dados não poderá ser encaminhado no formato json, mas sim em form data
  if (image) {
    config = {
      method,
      body: data,
      headers: {},
    };
  } else if (method === "DELETE" || data === null) {
    config = {
      method,
      headers: {},
    };
  } else {
    config = {
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

//   Caso haja token, ira repassá-lo na requisição
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
