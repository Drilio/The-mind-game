import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ChangePassword(){
    const [currentPassword, setcurrentPassword] = useState('');
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const navigate = useNavigate()

    async function userChangePassword(){
        const userInformation = {
            currentPassword: currentPassword,
            password: password,
            passwordConfirmation: passwordConfirmation
        }
        const token = localStorage.getItem('jwt');
        const response = await fetch("http://localhost:1337/api/auth/change-password",{
            method:'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token!
        },
            body: JSON.stringify(userInformation),
        })
        try{
            if(response.ok){
                navigate('/home')
            }else{
                window.alert('oupsi ça n\'a pas marché');
            }
        }catch (error) {
        console.log(error)
        }
    }

    return(
        <div>
            <h1>
                Changez votre mot de passer
            </h1>
            <div className="form">
                <label htmlFor="currentPassword">currentPassword</label>
                <input type="currentPassword" id="currentPassword" name="currentPassword" onChange={(e) => setcurrentPassword(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="passwordConfirmation">passwordConfirmation</label>
                <input type="password" id="passwordConfirmation" name="passwordConfirmation" onChange={(e)=>setPasswordConfirmation(e.target.value)}></input>
                <button onClick={userChangePassword}>Changer de mdp</button>
            </div>
        </div>
    )
}