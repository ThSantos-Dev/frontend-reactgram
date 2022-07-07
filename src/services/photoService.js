// Objetivo: lidar com as requisições de post (criar, editar, like, comentários)

// Import - Config
import {api as API_URL, requestConfig } from './../utils/config';


// Publicar foto
const publishPhoto = async (data, token) => {
    // Configurando a requsição
    const config = requestConfig("POST", data, token, true);

    try {
        
        // Realizando a requisição para Publicar foto
        const res = await fetch(API_URL + "/photos/", config)
                            .then((res) => res.json())
                            .catch((err) => err)

        console.log("teste: ", res)

        // Retornando a resposta da requisição
        return res
    } catch (error) {
        console.log(error)
    }
}

// Pegando as publicações de um usuário
const getUserPhotos = async (id, token ) => {

    // Configurando a requisição
    const config = requestConfig("GET", null, token)

    try {
        
        // Realizando a requisição para buscar todas as publicações / fotos do usuário
        const res = await fetch(API_URL + "/photos/user/" + id, config)
                            .then((res) => res.json())
                            .catch((err) => err)

        // Retornado a resposta da requisição
        return res

    } catch (error) {
        console.log(error)
    }
}

// Apagando uma foto / publicação
const deletePhoto = async (id, token) => {
    // Configurando a requisição
    const config = requestConfig("DELETE", null, token)

    try {
        
        // Realizando a requisição para apagar uma foto / publicação
        const res = await fetch(API_URL + "/photos/" + id, config)
                            .then((res) => res.json())
                            .catch((err) => err)

        // Retornando  a resposta da requisição
        return res

    } catch (error) {
        console.log(error)
    }
}

// Atualização de foto / publicação
const updatePhoto = async (data, id, token) => {
    // Configurando a requisição
    const config = requestConfig("PUT", data, token)

    try {
        
        // Realizando a requisição para atualização de foto / publicação
        const res = await fetch(API_URL + "/photos/" + id, config)
                            .then((res) => res.json())
                            .catch((err) => err)

        // Retornando a resposta da requisição
        return res

    } catch (error) {
        console.log(error)
    }
}

// Buscando detalhes de uma foto / publicação
const getPhoto = async (id, token) => {
    // Configurando a requisição
    const config = requestConfig("GET", null, token);

    try {
        
        // Realizando a requisição para buscar detalhes da foto / publicação pelo ID
        const res = await fetch(API_URL + "/photos/" + id, config)
                            .then((res) => res.json())
                            .catch(err => err)

        // Retornando a resposta da requisição
        return res

    } catch (error) {
        console.log(error)
    }
}

// Atribuir Like a foto
const like = async (id, token) => {
    // Configurando a requisição
    const config = requestConfig("PUT", null, token)

    try {
        
        // Realizando a requisição para atribuir like a foto
        const res = await fetch(API_URL + "/photos/like/" + id, config)
                            .then((res) => res.json())
                            .catch((err) =>err)
        
        // Retornando a resposta da requisição
        return res

    } catch (error) {
        console.log(error)
    }
}

// Adicionar comentário a foto
const comment = async (data, id, token) => {
    // Configurando a requisição
    const config = requestConfig("PUT", data, token)

    try {
        
        // Realizando a requisição para adicionar comentário a foto
        const res = await fetch(API_URL + "/photos/comment/" + id, config)
                            .then((res) => res.json())
                            .catch((error) => error)

        // Retornando a resposta da requisição
        return res

    } catch (error) {
        console.log(error)
    }
}

// Buscar todas as fotos / publicações
const getPhotos = async (token) => {
    // Configurando a requisição
    const config = requestConfig("GET", null, token)

    try {
        
        // Realizando a requisição para buscar todas as fotos / publicações
        const res = await fetch(API_URL + "/photos/", config)
                            .then(response => response.json())
                            .catch(error => error)

        // Retornando a resposta da requisição
        return res
    } catch (error) {
        console.log(error)
    }

}

// Buscando foto pelo título
const searchPhotos = async (query, token) => {
    // Configurando a requisição
    const config = requestConfig("GET", null, token)

    try {
        
        // Realizando a requisição para buscar foto pelo titulo
        const res = await fetch(API_URL + "/photos/search?q=" + query, config)              
                            .then((res) => res.json())
                            .catch((err) => err)
        
        // Retornando a resposta da requisição
        return res

    } catch (error) {
        console.log(error)
    }
}

// Criando objeto com todas as funções do sevice
const photoService = {
    publishPhoto,
    getUserPhotos,
    deletePhoto,
    updatePhoto,
    getPhoto,
    like,
    comment,
    getPhotos,
    searchPhotos
}


// Exportando o objeto que contem as funções
export default photoService