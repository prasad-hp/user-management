import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5050/api/v1/user/login', formData);
            alert(response.data.message);
            if(response.data.message == "Logged In"){
                navigate("/home")
            }
        } catch (err) {
            console.log(err)
            alert(err.response.data.message?.issues[0]?.message || "An error occured");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} className="form-control" placeholder="Enter your email" required />
                </div>
                <div className="form-group mt-3">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} className="form-control" placeholder="Enter your password" required />
                </div>
                <button type="submit" className="btn btn-primary mt-4">Login</button>
            </form>
        </div>
    );
};

export default Login;
