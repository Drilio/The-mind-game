import {useState} from "react"
import {useNavigate} from "react-router-dom";

export default function Connexion() {

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate()


    async function userLogIn() {
        console.log('USERLOGIN')
        console.log(email, password)
        const user = {
            mail: email,
            password: password
        }
        const response = await fetch('http://localhost:1337/api/auth/local', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
        try {
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("jwt", data.user.auth_token);
                navigate('/home')
            } else {
                console.log(response.status)
            }
        } catch (error) {
            console.log(error);
            window.alert("Une erreur est survenue, veuillez réessayer");
        }
    }

return (
    <div>
        <h1>Connexion</h1>
        <div className="form">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={userLogIn}>Se connecter</button>
        </div>
    </div>
)
}