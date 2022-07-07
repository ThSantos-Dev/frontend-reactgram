// Objetivo: requisições HTTP de autenticação do usuário

// Import - Configurações
import { api as API_URL, requestConfig } from "../utils/config";

/**
 * Função responsável por registrar um usuário no sistema
 * @param {Object} data - Dados do usuário
 * @return {Void}
 */
const register = async (data) => {
  // Chamando a função para configurar a requisição
  const config = requestConfig("POST", data);

  try {
    // Fazendo a requisição
    const res = await fetch(API_URL + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res._id) {
      // Armazenando o Token JWT no localStorage para futuras consultas
      localStorage.setItem("user", JSON.stringify(res));
    }

    // Retornando a resposta da requisição
    return res;
    
  } catch (error) {
    console.log(error);
  }
};

// Logout do usuário
const logout = () => {
  // Removendo os dados do localStorage, consequentemente o Reducer será afetado, sendo assim, o state de auth se aleterará
  localStorage.removeItem("user")
}

// Login do usuário
const login = async (data) => {
  // Configurando a requisição
  const config = requestConfig("POST", data)

  try {
    
    // Fazendo a requisição de login
    const res = await fetch(API_URL + "/users/login", config)
                        .then((res) => res.json())
                        .catch((err) => err)

    // Validação para verificar se o retorno da API foi um usuário
    if(res._id) {
      localStorage.setItem("user", JSON.stringify(res))
    }

    // Retornando os dados do usuário ou uma mensagem de erro
    return res;

  } catch (error) {
    console.log(error)
  }




}

// Montando um objeto com as funções
const authService = {
  register,
  logout,
  login
};

export default authService;
