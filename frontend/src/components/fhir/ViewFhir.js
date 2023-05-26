import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../static/UserContext';
import { useParams } from 'react-router-dom';
var axios = require('axios');

function ViewFhir() {
  const {user} = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [composition, setComposition] = useState(null);
  const { composition_id } = useParams();

  useEffect(() => {
    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      }
    }

    axios.post("http://localhost:8080/fhir/"+composition_id, message_body)
      .then(res => {
        setComposition(res.data.fhir[0].message);
        setLoading(false);  
        console.log(res.data.fhir[0].message);
      })
      .catch(err => {
        console.log(err);
      });
  }, [user.username, user.password, composition_id]);

  return (
    <div>
      {loading && (
        <p>Loading...</p>
      )}
      {!(loading) && (
        <pre>
          {JSON.stringify(composition, null, 2)}
        </pre>
      )}
    </div>
    );
}

export default ViewFhir;