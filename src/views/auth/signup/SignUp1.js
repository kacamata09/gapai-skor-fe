import React, { useState } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import apiClient from '../../../utils/apiclient';

const SignUp1 = () => {
  const navigate = useNavigate();
  const [dataUser, setDataUser] = useState({
    fullname: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    const { fullname, username, phone, email, password, confirmPassword } = dataUser;

    // Validasi input wajib dan kesesuaian password
    if (!fullname || !username || !phone || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/user', { fullname, username, phone, email, password });
      console.log(response.data.data);
      navigate('/login');
    } catch (error) {
      console.error('Error during register:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const changeInput = (e) => {
    const { value, name } = e.target;
    setDataUser((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">REGISTER</h3>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <form noValidate onSubmit={handleRegister}>
                    <div className="input-group mb-3">
                      <input
                        name="fullname"
                        onChange={changeInput}
                        type="text"
                        className="form-control"
                        placeholder="Nama Lengkap"
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        name="username"
                        onChange={changeInput}
                        type="text"
                        className="form-control"
                        placeholder="Username"
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        name="email"
                        onChange={changeInput}
                        type="email"
                        className="form-control"
                        placeholder="Email address"
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        name="phone"
                        onChange={changeInput}
                        type="text"
                        className="form-control"
                        placeholder="No. Telepon (Whatsapp)"
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        name="password"
                        onChange={changeInput}
                        type="password"
                        className="form-control"
                        placeholder="Password"
                      />
                    </div>
                    <div className="input-group mb-4">
                      <input
                        name="confirmPassword"
                        onChange={changeInput}
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary mb-4" disabled={loading}>
                      {loading ? <Spinner as="span" animation="border" size="sm" /> : 'REGISTER'}
                    </button>
                  </form>
                  <p className="mb-2">
                    Sudah punya akun?{' '}
                    <NavLink to="/auth/signin-1" className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;