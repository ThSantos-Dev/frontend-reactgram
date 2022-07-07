// Import - Styles
import "./Home.css";

// Import - Components
import LikeContainer from "../../components/LikeContainer/LikeContainer";
import PhotoItem from "../../components/PhotoItem/PhotoItem";
import { Link } from "react-router-dom";

// Import - Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

// Import - Redux
import { getPhotos, like } from "../../slices/photoSlice";

const Home = () => {
  // Instanciando o dispatch para utilizar as funções do redux
  const dispatch = useDispatch();

  // Utilizando o hook de limpar mensagem
  const resetMessage = useResetComponentMessage(dispatch);

  // Resgatando dados do usuário autenticado
  const { user } = useSelector((state) => state.auth);

  // Resgatando fotos
  const { photos, loading } = useSelector((state) => state.photo);

  // Carregando todas as fotos
  useEffect(() => {
    // Disparando a função de listar todas as fotos do redux
    dispatch(getPhotos());
  }, [dispatch]);

  // Adicionar like na foto
  const handleLike = (photo) => {
    // Disparando a função de adicionar like a foto do redux
    dispatch(like(photo._id));

    // Limpando as mensagens
    resetMessage();
  };

  // Enquanto as fotos não carregam será exibido um aviso
  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="home">
      {photos &&
        photos.map((photo) => (
          <div className="photo-container" key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike}/>
            <Link className="btn" to={`/photos/${photo._id}`}>Ver mais</Link>
          </div>
        ))}

      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          Ainda não há fotos publicadas,{" "}
          <Link to={`/users/${user._id}`}>clique aqui</Link>
        </h2>
      )}
    </div>
  );
};

export default Home;
