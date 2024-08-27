import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', phoneNumber: '' });
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5050/api/v1/user/');
                const data = Array.isArray(response.data.users) ? response.data.users : [];
                setUsers(data);
            } catch (err) {
                console.log('Failed to fetch users');
            }
        };
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditingUserId(user._id);
        setEditFormData({ name: user.name, phoneNumber: user.phoneNumber });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios({
                method:"patch",
                url: "http://localhost:5050/api/v1/user/update",
                data: {
                    email: users.find(user => user._id === editingUserId).email,
                    name: editFormData.name,
                    phoneNumber: editFormData.phoneNumber,
                }
            })
            window.location.reload(false);
            setEditingUserId(null);
        } catch (err) {
            console.log('Failed to update user');
        }
    };

    const handleDeleteClick = async (userId) => {
        try {
            console.log(userId)
            const response = await axios({
                method: "delete",
                url: "http://localhost:5050/api/v1/user/delete",
                data: {
                    userId: userId,
                },
            });

            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            console.log(err)
            console.log('Failed to delete user');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light flex justify-between px-5">
                <a className="navbar-brand" href="#">User Management</a>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </nav>

            <div className="container mt-5">
                <h2 className="text-center">Registered Users</h2>
                <table className="table table-striped mt-4">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Profession</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>
                                    {editingUserId === user._id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditChange}
                                            className="form-control"
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={editFormData.phoneNumber}
                                            onChange={handleEditChange}
                                            className="form-control"
                                        />
                                    ) : (
                                        user.phoneNumber
                                    )}
                                </td>
                                <td>{user.profession}</td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <>
                                            <button className="btn btn-success mr-2" onClick={handleEditSubmit}>
                                                Save
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => setEditingUserId(null)}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-primary mr-2" onClick={() => handleEditClick(user)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteClick(user._id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Home;
