import {useEffect} from "react";
import IsConnected from "../helper/auth.tsx";
import {useNavigate} from "react-router-dom";
export default function Home() {

    const jwt = localStorage.getItem('jwt')
    const navigate = useNavigate()


    useEffect(() => {
       IsConnected(navigate)
        }
        , [])
    return (
        <div>
            <h1>Home</h1>
            <div className="connected-status">
                Je suis connecté
            </div>
            <button onClick={() => navigate('/change-password')}>Change Password</button>
            <div className="connected-data">
                <div className="title">jwt :</div>
                <div className="value">{jwt}</div>
            </div>
        </div>
    )
}