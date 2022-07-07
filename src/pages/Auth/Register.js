// Import - Styles
import "./Auth.css";

// Import - Components
import { Link } from "react-router-dom";
import Message from '../../components/Message/Message';

// Import - Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  // States do forumlário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Utilizando o hook de dispatch, que possibilita a utilização das funções do redux
  const dispatch = useDispatch();

  // Especificando os estados desejados (loading, error) e de qual slice/redux (auth)
  // No caso, para monitoramento
  const { loading, error } = useSelector((state) => state.auth);

  // Função que envia os dados para a API
  const handleSubmit = (e) => {
    e.preventDefault();

    // Criando um objeto com os dados do usuário
    const user = {
      name,
      email,
      password,
      confirmPassword,
    };

    console.log(user);

    // Chamando a função de register do Reducer com o dispatch
    dispatch(register(user));
  };

  // Zerando os dados a cada vez que o dispatch é executado. Limpando as mensagens de erro, resetando o loading e etc
  // Limpando todos os States
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="register">
      <h2>ReactGram</h2>
      <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome completo"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email || ""}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          value={password || ""}
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword || ""}
        />

        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" /> }
      </form>

      <p>
        Tem uma conta? <Link to="/login">Conecte-se</Link>
      </p>
    </div>
  );
};

export default Register;
