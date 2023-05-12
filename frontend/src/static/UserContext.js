import { createContext } from "react";

export const UserContext = createContext();

/*
Um Context em react é uma variável (hook) global, que pode ser utilizado em qualquer página
do website.

Vai ser utilizado para manter os dados do utilizador após o login no ficheiro App.js

Para tal, basta criar um useState (const [user, userLogin, userLogout] = useState(false)), bem como os
métodos login e logout para alterar o user, e depois retornar
<UserContext.Provider value={{user, login, logout}}>...</UserContext.Provider>

Assim, nos ficheiros que queremos utilizar o user, o login ou o logout, basta fazer:
import { useContext } from 'react';
import { UserContext } from '../../static/UserContext';
const {user, userLogin, userLogout} = useContext(UserContext)
*/