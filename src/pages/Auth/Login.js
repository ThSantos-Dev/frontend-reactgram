// Import - Styles
import "./Auth.css";

// Import - Components
import { Link } from "react-router-dom";
import Message from "../../components/Message/Message";

// Import - Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Import - Redux
import { login, reset } from "../../slices/authSlice";

const Login = () => {
  // States - Formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Instanciando o dispatch, para que ele possa executar as funções do Redux
  const dispatch = useDispatch();

  // Pegando os states do Redux - auth é o Redux que lida com autenticação do usuário
  const { loading, error } = useSelector((state) => state.auth);

  // Função que realiza o login
  const handleSubmit = (e) => {
    e.preventDefault();

    // Criando um objeto com os dados das inputs
    const user = {
      email,
      password,
    };

    // Chamando a função de login do slice de autenticação
    dispatch(login(user));
  };

  // Limpando todos os states
  useEffect(() => {
    // Limpando os states
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="login">
      <h2>ReactGram</h2>
      <p className="subtitle">Faça o login para ver o que há de novo.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email || ""}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          value={password || ""}
        />

        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" /> }
      </form>

      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se</Link>{" "}
      </p>
    </div>
  );
};

export default Login;
