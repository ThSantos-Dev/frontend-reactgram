// Import - Styles
import "./Photo.css";

// Import - Config
import { uploads } from "../../utils/config";

// Import - Components
import Message from "../../components/Message/Message";
import { Link } from "react-router-dom";
import PhotoItem from "../../components/PhotoItem/PhotoItem";

// Import - Hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

// Import - Redux
import { getPhoto, like, comment } from "../../slices/photoSlice";
import LikeContainer from "../../components/LikeContainer/LikeContainer";

const Photo = () => {
  // Resgatando o id da foto passado na url
  const { id } = useParams();

  // States - Comentário
  const [commentText, setCommentText] = useState("");

  // Instanciando o dispatch para utilizar as funções do redux
  const dispatch = useDispatch();

  // Recebendo a função que dispara um resetMessage no redux de mensagem
  const resetMessage = useResetComponentMessage(dispatch);

  // Resgatando o usuário autenticado
  const { user } = useSelector((state) => state.auth);

  // Resgatando os states de photo
  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );

  // Carregando os dados da foto
  useEffect(() => {
    // Disparando a função do redux que busca informações de uma foto através do id
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  // Função responsável por disparar a função do redux que adiciona like na foto
  const handleLike = (photo) => {
    // Disparando a função de like do redux
    dispatch(like(photo._id));

    // Limpando a mensagem
    resetMessage();
  };

  // Funçõ responsável por adicionar comentário a foto
  const handleComment = (e) => {
    e.preventDefault();

    // Criando um objeto com os dados do comentário
    const commentData = {
        comment: commentText,
        id: photo._id
    }

    // Disparando a função do redux que realiza a adição de comentário
    dispatch(comment(commentData));

    // Limpando o state de comentário
    setCommentText("")

    // Limpando as mensagens
    resetMessage()
  };

  // Enquanto a foto estiver carregando será exibida uma mensagem ao usuário
  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />

      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>

      <div className="comments">
        {photo.comments && (
          <>
            <h3>Comentários: ({photo.comments && photo.comments.length})</h3>

            <form onSubmit={handleComment}>
              <input
                type="text"
                placeholder="Insirar seu comentário..."
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText || ""}
              />

              <input type="submit" value="Enviar" />
            </form>

            {photo.comments.length === 0 && <p>Não há comentários.</p>}

            {photo.comments.map((comment) => (
              <div className="comment" key={comment.comment}>
                <div className="author">
                  {comment.userImage && (
                    <img
                      src={`${uploads}/users/${comment.userImage}`}
                      alt={comment.userName}
                    />
                  )}

                  <Link to={`/users/${comment.userId}`}>
                    <p>{comment.userName}</p>
                  </Link>
                </div>

                <p>{comment.comment}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Photo;
