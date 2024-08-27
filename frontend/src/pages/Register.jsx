import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phoneNumber: '', profession: ''
    });
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5050/api/v1/user/signup', formData);
            alert(response.data.message);
            if(response.data.message == "User Created Successfully"){
                navigate("/home")
                localStorage.setItem("token", "Bearer"+ response.data.token)
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                     err.response?.data?.message?.issues?.[0]?.message ||
                     "An error occurred";
            alert(errorMessage);

        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Register</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" onChange={handleChange} className="form-control" placeholder="Enter your name" required />
                </div>
                <div className="form-group mt-3">
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} className="form-control" placeholder="Enter your email" required />
                </div>
                <div className="form-group mt-3">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} className="form-control" placeholder="Enter your password" required />
                </div>
                <div className="form-group mt-3">
                    <label>Phone</label>
                    <input type="text" name="phoneNumber" onChange={handleChange} className="form-control" placeholder="Enter your phone number" required />
                </div>
                <div className="form-group mt-3">
                    <label>Profession</label>
                    <input type="text" name="profession" onChange={handleChange} className="form-control" placeholder="Enter your profession" required />
                </div>
                <button type="submit" className="btn btn-primary mt-4">Register</button>
            </form>
        </div>
    );
};

export default Register;
