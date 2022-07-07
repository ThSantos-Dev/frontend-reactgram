// Objetivo: verificar se o usuário está autenticado

// Import - Hooks
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuth = () => {
  // Pegando o state de usuário  do redux
  const { user } = useSelector((state) => state.auth);

  // States
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  //   Monitoramento do redux de auth
  useEffect(() => {
    // Validação para verificar se o usuário está autenticado ou se houve um logoff
    if (user) {
      setAuth(true);
    } else {
      setAuth(false);
    }

    setLoading(false);
  }, [user]);

  // Retornando os booleans que dizem se o usuário está autenticado e o estado de loading
  return { auth, loading };
};
