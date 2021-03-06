import "./css/NavBar.css"
import "./css/formulaire.css"
import { URLS } from "../dataBase/apiURLS";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { connexion } from "../dataBase/apiCalls";

export default function Connexion() {

    const [identifiants, setIdentifiants] = useState({ login: '', mdp: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { user, setUser } = useContext(UserContext);

    let navigate = useNavigate();

    const login = (userObject) => {
        const item = {
            value: userObject.id,
            expiry: new Date().getTime() + 600000
        }

        localStorage.setItem('user', JSON.stringify(item))
        setUser(userObject)
        setLoading(false)
        navigate('/')
    }


    const handleChange = (event) => {
        setIdentifiants({ ...identifiants, [event.target.name]: event.target.value });
    }

    const connecter = async (event) => {
        event.preventDefault();
        setLoading(true);

        let connectedUser;
        try {
            connectedUser = await connexion(identifiants);
            if (connectedUser) login(connectedUser);
            setLoading(false);
        } catch (err) {
            setMessage('Identifiants erronés');
            setLoading(false);
            throw Error('Identifiants erronés');
        }
    }

    return (
        <div className="blocFormulaire">
            <div className="formulaire">
                <h3>Se connecter :</h3>
                {
                    message && <div className="erreur">{message}</div>
                }
                <form encType="multipart/form-data" method="POST" onSubmit={connecter}>

                    <label>Pseudo ou email:
                        <input type='text' name='login' placeholder='Votre pseudo ou votre email' onChange={handleChange} />
                    </label>

                    <label>Mot de passe :
                        <input type="password" name="mdp" placeholder="Votre mot de passe" onChange={handleChange} />
                    </label>

                    <label>
                        <input type="submit" value="Se connecter" disabled={loading} />
                    </label>

                </form>
            </div>
        </div>
    )
}


