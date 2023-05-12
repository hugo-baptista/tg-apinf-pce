import { createContext } from "react";

export const UserContext = createContext();

/*
Um Context em react é uma variável (hook) global, que pode ser utilizado em qualquer página
do website.

Vai ser utilizado para manter os dados do utilizador após o login no ficheiro App.js

Para tal, basta criar um useState (const [user, setUser] = useState(false)) e depois retornar
<UserContext.Provider value={{user, setUser}}>...</UserContext.Provider>

Assim, nos ficheiros que queremos utilizar o user ou o setUser, basta fazer:

const {user, setUser} = useContext(UserContext)
*/