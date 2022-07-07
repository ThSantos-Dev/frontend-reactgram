// Objetivo: Lindar com as requisições de usuário

// Import - Config
import { api as API_URL, requestConfig } from "../utils/config";

// Função responsável por pegar os dados de perfil de um usuário
const profile = async (data, token) => {

    // Configurando a requisição
    const config = requestConfig("GET", data, token)

    try {
        
        // Requisição para buscar os dados de perfil do usuário
        const res = await fetch(API_URL + "/users/profile", config)
                            .then((res) => res.json())
                            .catch((err) => err)

        // Retornando os dados encontrados ou uma mensagem de erro
        return res

    } catch (error) {
        console.log(error)
    }

}

// Função responsável por atualizar os dados do perfil do usuário
const updateProfile = async (data, token) => {
    // Configurando a requisição
    const config = requestConfig("PUT", data, token, true)

    try {
        // Realizando a requisição para atualizar o perfil do usuário
        const res = await fetch(API_URL + "/users/", config)
                            .then((res) => res.json())
                            .catch((err) => err)

        // Retornando os dados do usuário atualizados
        return res

    } catch (error) {
        console.log(error)
    }
}

// Função responsável por buscar informações de um usuário pelo id
const getUserDetails = async (id) => {

    // Configurando a requisição
    const config = requestConfig("GET")

    try {

        // Realizando a requisição para buscar o usuário pelo id
        const res = await fetch(API_URL + "/users/" + id, config)
                            .then((res) => res.json())
                            .catch((error) => error)

        // Retornando o resultado da requisição
        return res
        
    } catch (error) {
        console.log(error)
    }

}

// Objeto que contém todas as funções de usuário
const userService = {
    profile,
    updateProfile,
    getUserDetails,
}

export default userService
