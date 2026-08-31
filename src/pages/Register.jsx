// src/pages/Register.jsx
import React, { useState } from "react";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();
  const dispatch = useDispatch()


  // Backend integration here (POST to /api/users)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      dispatch(setUser(data.newUser));

      // localStorage.setItem("userInfo", JSON.stringify(data.newUser));

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <Typography variant="h4" className="mb-6 text-center font-bold">
          Create Account
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="Choose a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth className="mt-4">
            Sign Up
          </Button>
        </form>
        <Typography
          variant="small"
          className="mt-6 text-center text-gray-600 dark:text-gray-400"
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-primary font-semibold"
          >
            Sign In
          </span>
        </Typography>
      </Card>
    </div>
  );
}
