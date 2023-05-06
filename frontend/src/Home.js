import { useContext } from "react";
import { UserContext } from "./static/UserContext";
import AssessmentIcon from '@mui/icons-material/Assessment';
import { IconContext } from "react-icons";

const Home = () => {
    const {user, setUser} = useContext(UserContext);

    return(
        <div>
            <p>Placeholder</p>
        </div>
    )
}
 
export default Home;