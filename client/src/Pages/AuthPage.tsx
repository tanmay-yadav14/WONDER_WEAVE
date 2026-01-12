import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../Components/Login";
import Signup from "../Components/Signup";


export function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
    console.log("AuthPage rendered, isLogin:", isLogin);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            console.log("Token found, redirecting to SearchPage");
            navigate("/SearchPage", { replace: true });
        }
    }, [navigate]);

    return (
        <div>
            {isLogin ? (
                <Login onSwitchToSignUp = {() => setIsLogin(false)} />
            ) : (
                <Signup  onSwitchToLogin = {() => setIsLogin(true)} />
            )}
        </div>
    )
}