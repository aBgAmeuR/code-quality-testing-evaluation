import React, { PropsWithChildren } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/UserList';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import Navigation from './components/Navigation';

const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = ({ children }: PropsWithChildren) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <div className="app-container" style={{padding: '20px'}}>
                {isAuthenticated() && <Navigation />}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <UserList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/products"
                        element={
                            <ProtectedRoute>
                                <ProductList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-product"
                        element={
                            <ProtectedRoute>
                                <AddProduct />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isAuthenticated() ?
                                <Navigate to="/products" replace /> :
                                <Navigate to="/login" replace />
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
