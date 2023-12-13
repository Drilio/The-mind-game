import {NavigateFunction} from "react-router-dom";

const IsConnected = async (navigate: NavigateFunction) => {
    const token = localStorage.getItem('jwt')
    if (token !== null) {
        try {
            const token = localStorage.getItem('jwt')
            const response = await fetch(`http://localhost:1337/api/auth/isconnect`, {
                method: "POST",
                headers: {"Content-Type": "application/json",
                    "accept": "application/json",
                    "Authorization": "Bearer " + token},
            });
            if (response.ok) {
                console.log(response)
                return true;
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Une erreur est survenue lors de la vérification du token', error);
            return false;
        }
    } else {
        console.log('no token')
        navigate('/');
    }
}

export default IsConnected;