import { useState } from "react";
import { AuthBtn } from "./AuthBtn";
import { useNavigate } from "react-router-dom";
import { LoginUser, getErrorMessage } from "../api";

interface LoginProps {
  onSwitchToSignUp: () => void;
}

export function Login({ onSwitchToSignUp }: LoginProps) {

  const [email, setEmail] =  useState("");
  const [password, setPassword] =  useState("");
  const navigate = useNavigate();
  console.log("Login component rendered");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleLogin called", { email, password });
    try {
      const data = await LoginUser({ email, password });
      localStorage.setItem("token", data.token);
      navigate("/SearchPage", { replace: true, state: { fromAuth: true } });
    } catch (error) {
      console.error("Login failed:", getErrorMessage(error));
      alert("Login failed: " + getErrorMessage(error));
    }
  }

   return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-200 via-pink-100 to-white">
         <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
           <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
             Wonder Weave
           </h1>
           <p className="text-center text-gray-500 mb-6">
             Adventure begins with a single sign up.
           </p>
   
           <form onSubmit={handleLogin} className="space-y-4">

             <input
               type="email"
               placeholder="Email"
               className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-400"
               onChange={(e) => setEmail(e.target.value)}
             />
             <input
               type="password"
               placeholder="Password"
               className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-400"
                onChange={(e) => setPassword(e.target.value)}
             />
             <AuthBtn type="submit" text= "Login" />
           </form>
   
           <div className="flex items-center my-4">
             <hr className="flex-1 border-gray-300" />
             <span className="px-2 text-gray-500 text-sm">OR</span>
             <hr className="flex-1 border-gray-300" />
           </div>
   
           <button className="w-full py-3 rounded-lg border flex items-center justify-center gap-2 hover:bg-gray-100 transition">
             <span>G</span> Login with Google
           </button>

                     <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Signup
            </button>
          </p>
         </div>
       </div>
     );
}