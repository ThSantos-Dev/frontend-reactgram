// Import - Styles
import "./EditProfile.css";

// Import - Config
import { uploads } from "../../utils/config";

// Import - Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Import - Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

// Import - Components
import Message from "../../components/Message/Message";

const EditProfile = () => {
  // States - formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");

  // State para preview de imagem
  const [previewImage, setPreviewImage] = useState("");

  // Resgatando os states do redux de usuário
  const { user, message, error, loading } = useSelector((state) => state.user);

  // Instanciando o dispatch para utilizar as funções do redux
  const dispatch = useDispatch();

  // Carregando os dados do usuário
  useEffect(() => {
    // Chamando a função de profile no slice de usuário
    dispatch(profile());
  }, [dispatch]);

  // Preenchendo o formulário com os dados do usuário
  useEffect(() => {
    // Validação para verificar se o usuário venho corretamente
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  // Função que realiza os envio dos dados para atualização
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Montando um objeto com os dados do usuário
    const userData = {
      name
    };

    // Validações para verificar quais dados foram atualizados
    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (password) {
      userData.password = password;
    }

    // Construindo o formdata
    const formData = new FormData();

    // Criando um objeto form data com os dados do usuário
    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );
    
    // Adicionando o objeto criado ao objeto formdata
    formData.append("user", userFormData);

    // Realizando a requisição para atualizar os dados do usuário
    await dispatch(updateProfile(formData))

    // Removendo a mensagem da tela após 2 segundos
    setTimeout(() => {
      dispatch(resetMessage())
    }, 2000)

  };

  // Setando os valores de imagem
  const handleFile = (e) => {
    // Preview de imagem - Resgatando a imagem
    const image = e.target.files[0];

    // Atualizando o state de preview
    setPreviewImage(image);

    // Atualizando a imagem de perfil do usuário
    setProfileImage(image);
  };

  return (
    <div>
      <div id="edit-profile">
        <h2>Edite seus dados</h2>
        <p className="subtitle">
          Adicione uma imagem de perfil e conte mais sobre você...
        </p>

        {(user.profileImage || previewImage) && (
          <img
            className="profile-image"
            src={
              previewImage
                ? URL.createObjectURL(previewImage)
                : `${uploads}/users/${user.profileImage}`
            }
            alt={user.name}
          />
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            onChange={(e) => setName(e.target.value)}
            value={name || ""}
          />
          <input
            type="email"
            placeholder="E-mail"
            disabled
            value={email || ""}
          />

          <label>
            <span>Imagem de Perfil:</span>
            <input type="file" onChange={handleFile} />
          </label>

          <label>
            <span>Bio:</span>
            <input
              type="text"
              placeholder="Descrição do perfil"
              onChange={(e) => setBio(e.target.value)}
              value={bio || ""}
            />
          </label>

          <label>
            <span>Quer alterar sua senha?</span>
            <input
              type="password"
              placeholder="Digite sua nova senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password || ""}
            />
          </label>

          {!loading && <input type="submit" value="Atualizar" />}
          {loading && <input type="submit" value="Aguarde..." disabled />}
          {error && <Message msg={error} type="error" />}
          {message && <Message msg={message} type="success" />}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
