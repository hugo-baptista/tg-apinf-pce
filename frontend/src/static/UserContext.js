import { createContext } from "react";

export const UserContext = createContext();

// um Context em react é uma variável (hook) global, que pode ser utilizado em qualquer página do website
// vai ser utilizado para manter os dados do utilizador após o login
// no ficheiro App.js, basta criar um useState, const [user, setUser] = useState('hugão')
// depois, retornar <UserContext.Provider value={{user, setUser}}>...</UserContext.Provider>
// assim, nos ficheiros que queremos utilizar o user ou o setUser, basta fazer const {user, setUser} = useContext(UserContext)