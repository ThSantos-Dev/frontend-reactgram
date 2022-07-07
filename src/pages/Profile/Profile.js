// Import - Styles
import "./Profile.css";

// Import - Config
import { uploads } from "../../utils/config";

// Import - Components
import Message from "../../components/Message/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// Import - Hooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Import - Redux
import { getUserDetails } from "../../slices/userSlice";
import {
  publishPhoto,
  resetMessage,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  // Resgatando o ID passado pela URL
  const { id } = useParams();

  // States - Formulário de criação
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  // States - formulário de edição
  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");

  // Instaciando o dispatch para poder utilizar as funções do Redux
  const dispatch = useDispatch();

  // Resgatando os states dos redux de usuário, foto e autenticação
  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    error: errorPhoto,
    message: messagePhoto,
  } = useSelector((state) => state.photo);

  // Referência ao formuário de criação e edição de posts
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  // Carregando os dados do usuário
  useEffect(() => {
    // Chamando a função do redux para pesquisar detalhes de um usuário pelo Id
    dispatch(getUserDetails(id));
    // Chamando a função do redux para resgatar as fotos do usuário
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  // Função responsável por limpar as mensagens
  const resetComponentMessage = () => {
    // Disparando a função resetMessage para limpar as mensagens de erro
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  //   Função responsável por enviar a requisição para criar novo post
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();

    // Criando objeto de foto / post
    const photoData = {
      title,
      image,
    };

    // Criando um objeto formdata
    const formData = new FormData();

    // Criando um objeto formdata com os dados de photoData
    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    // Adicionando os dados de photoFormData ao formData na chave photo
    formData.append("photo", photoFormData);

    // Disparando a função publishPhoto do redux que chama o service para fazer o post da foto
    dispatch(publishPhoto(formData));

    // Limpando os states
    setTitle("");
    setImage("");

    // Limpando as mensagens
    resetComponentMessage();
  };

  // Setando os valores de imagem
  const handleFile = (e) => {
    // Resgatando a imagem
    const image = e.target.files[0];

    // Atribuindo a imagem ao state
    setImage(image);
  };

  // Função responsável por apagar uma foto
  const handleDelete = (id) => {
    // Disparando a função do redux que apaga uma foto
    dispatch(deletePhoto(id));

    // Limpando as mensagens
    resetComponentMessage();
  };

  //** Atualização de foto / publicação **//

  // Função responsável por realizar requisição para atualizar a foto - evento no formulário
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Montando um objeto com os dados da foto / publicação
    const photoData = {
      title: editTitle,
      id: editId,
    }

    // Disparando a função de atualizar foto / publicação do redux 
    dispatch(updatePhoto(photoData))

    // Limpando as mensagens
    resetComponentMessage()
  }

  // Função responsável por fechar o formulário de edição - evento no button do formulário
  const handleCancelEdit = () => {
    hiderOrShowForms()
  }

  // Função responsável por deixar os formulários vísiveis ou ocultos
  const hiderOrShowForms = () => {
    // o .toggle verifica se a classe já existe no elemento, se sim ele remove, senão, adiciona
    newPhotoForm.current.classList.toggle("hide")
    editPhotoForm.current.classList.toggle("hide")
  }

  // Função responsável por abrir o formulário de edição - evento no button do actions da foto 
  const handleEdit = async (photo) => {

    // Validação para verficar se o formulário possui a classe 'hide' - se ela está oculta
    if(editPhotoForm.current.classList.contains("hide")) {
      hiderOrShowForms()
    }

    // Alimentando os states de edição
    setEditId(photo._id)
    setEditTitle(photo.title)
    setEditImage(photo.image)
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="profile">
      <div className="profile-header">
        {/* Validação para verificar se o usuário possui foto de perfil */}
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}

        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>

      {/* Validação para verificar se o usuário logado é o dono do perfil */}
      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>

            <form onSubmit={handleSubmit}>
              <label>
                <span>Título para a foto:</span>
                <input
                  type="text"
                  placeholder="Insira um título..."
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem</span>
                <input type="file" onChange={handleFile} />
              </label>

              {!loadingPhoto && <input type="submit" value="Postar" />}
              {loadingPhoto && (
                <input type="submit" value="Aguarde..." disabled />
              )}
            </form>
          </div>

          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>

            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}

            <form onSubmit={handleUpdate}>
              <input
                type="text"

                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />

              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancelar edição
              </button>
            </form>
          </div>

          {errorPhoto && <Message type="error" msg={errorPhoto} />}
          {messagePhoto && <Message type="success" msg={messagePhoto} />}
        </>
      )}

      <div className="user-photos">
        <h2>Fotos publicadas:</h2>

        <div className="photos-container">
          {photos &&
            photos.map((photo) => (
              <div className="photo" key={photo._id}>
                {photo.image && (
                  <img
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}

                {/* Barra de ferramentas para o usuário logado que seja dono do perfil */}
                {id === userAuth._id ? (
                  <div className="actions">
                    <Link to={`/photos/${photo._id}`} className="btn">
                      <BsFillEyeFill /> {/** botão de visualizar */}
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(photo)}/> {/** botão de editar */}
                    <BsXLg onClick={() => handleDelete(photo._id)} />{" "}
                    {/** botão de excluir */}
                  </div>
                ) : (
                  <Link to={`/photos/${photo._id}`} className="btn">
                    Ver
                  </Link>
                )}
              </div>
            ))}

          {photos.length === 0 && <p>Ainda não há fotos publicadas.</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
