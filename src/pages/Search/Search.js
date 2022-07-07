// Import - Styles
import "./Search.css";

// Import - Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "./../../hooks/useResetComponentMessage";
import { useMemo } from "react"; // guarda um valor e não re-renderiza o componente se esse valor alterar
import { useQuery } from "./../../hooks/useQuery";

// Import - Components
import LikeContainer from "../../components/LikeContainer/LikeContainer";
import PhotoItem from "../../components/PhotoItem/PhotoItem";
import { Link } from "react-router-dom";

// Import - Redux
import { searchPhotos, like } from "../../slices/photoSlice";

const Search = () => {
  // Utilizando o hook de query
  const query = useQuery();

  // Resgatando o valor de 'q' que foi passado pela URL
  const search = query.get("q");

  // Instanciando dispatch para utilizar as funções do redux
  const dispatch = useDispatch();

  // Utilizando o hook para limpar mensagem
  const resetMessage = useResetComponentMessage(dispatch);

  // Resgatando o usuário logado
  const { user } = useSelector((state) => state.auth);

  // Resgatando as fotos
  const { photos, loading } = useSelector((state) => state.photo);

  // Carregando as fotos
  useEffect(() => {
    // Disparando a função do redux para buscar foto pelo titulo
    dispatch(searchPhotos(search));
  }, [dispatch, search]);

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
    <div id="search">
      <h2>Você está buscando por: {search}</h2>

      {photos &&
        photos.map((photo) => (
          <div className="photo-container" key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
              Ver mais
            </Link>
          </div>
        ))}

      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          Não foram encontrados resultados para a sua busca
        </h2>
      )}
    </div>
  );
};

export default Search;
