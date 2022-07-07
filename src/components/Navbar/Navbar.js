// Import - Styles
import "./Navbar.css";

// Import - Components
import { NavLink, Link } from "react-router-dom";
import {
  BsSearch,
  BsHouseDoorFill,
  BsFillPersonFill,
  BsFillCameraFill,
  BsBoxArrowInRight,
} from "react-icons/bs";

// Import - Hooks
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import - Redux
import { logout, reset } from "../../slices/authSlice";

const Navbar = () => {
  // Recuperando o status do usuário - autenticado ou não
  const { auth } = useAuth();

  // State - pesquisa
  const [query, setQuery] = useState("")

  // Recuperando os dados do usuário através do redux
  const { user } = useSelector((state) => state.auth);

  // Instaciando um objeto de Navigate
  const navigate = useNavigate();

  // Instanciando um dispatch para utilizar as funções do redux
  const dispatch = useDispatch();

  // Função que realiza o logout
  const handleLogout = () => {
    // Chamando as funções do redux que realizam o logout e zeram os estados
    dispatch(logout());
    dispatch(reset());

    // Redirecioanando o usuário para a tela de login
    navigate("/login");
  };

  // Função responsável por fazer pesquisa entre as fotos - título
  const handleSearch = (e) => {
    e.preventDefault();

    // Validação para verificar se foi digitado algo para pesquisa
    if(query.trim().length > 0) {
      return navigate(`/search?q=${query.trim()}`);
    }

  }

  return (
    <nav id="nav">
      <Link to="/">ReactGram</Link>

      <form id="search-form" onSubmit={handleSearch}>
        <BsSearch />
        <input type="text" placeholder="Pesquisar..." onChange={(e) => setQuery(e.target.value)} value={query}/>
      </form>

      <ul id="nav-links">
        {auth ? (
          <>
            <li>
              <NavLink to="/">
                <BsHouseDoorFill />
              </NavLink>
            </li>

            {user && (
              <li>
                <NavLink to={`/users/${user._id}`}>
                  <BsFillCameraFill />
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/profile">
                <BsFillPersonFill />
              </NavLink>
            </li>

            <li>
              <BsBoxArrowInRight
                title="Sair"
                cursor="pointer"
                onClick={handleLogout}
              />
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">Entrar</NavLink>
            </li>

            <li>
              <NavLink to="/register">Cadastre-se</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
