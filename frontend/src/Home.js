import { useContext } from "react";
import { UserContext } from "./static/UserContext";
import useFetch from "./useFetch";

const Home = () => {
    // const {data: blogs, isLoading, error} = useFetch("http://localhost:8000/blogs");

    // return (
    //     <div className="home">
    //         {error && <div>{error}</div>}
    //         {isLoading && <div id="loading">Loading...</div>}
    //         {blogs && <BlogList blogs={blogs} title="All Blogs:" />}
    //     </div>
    // );

    const {user, setUser} = useContext(UserContext);

    return(
        <div>
            <p>Placeholder</p>
        </div>
    )
}
 
export default Home;