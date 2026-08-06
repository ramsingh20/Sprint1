// src/pages/Login.jsx
import React, { useState } from "react";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // // Example logic: redirect new users to register
    // if (email === "new@user.com") {
    //   navigate("/register");
    // } else {
    //   navigate("/");
    // }

    console.log("Submit Clicked");

        try {
            const response = await fetch(`http://localhost:3000/api/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json()

            console.log("data", data);
            console.log("data user", data.Ruser);
            // console.log("data user.name", data.user.name);
            
            dispatch(setUser(data.Ruser))
            navigate('/')

            localStorage.setItem("userInfo", JSON.stringify(data.Ruser))

            // <Navigate to={'/'} />
        } catch (error) {
            console.log("LoginPage lineNo. 33",error);
        }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <Typography variant="h4" className="mb-6 text-center font-bold">
          Welcome Back
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth className="mt-4">
            Sign In
          </Button>
        </form>
        <Typography
          variant="small"
          className="mt-6 text-center text-gray-600 dark:text-gray-400"
        >
          New user?{" "}
          <Link to="/register" className="text-primary font-semibold">
            Create an account
          </Link>
        </Typography>
      </Card>
    </div>
  );
}
