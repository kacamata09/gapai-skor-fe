import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import apiClient from '../../../utils/apiclient';

const SignUp1 = () => {
  const navigate = useNavigate()
  
  const [dataUser, setDataUser] = useState({
    fullname : "",
    username : "",
    phone: "",
    email : "",
    password : "",
  })

   const handleLogin = async (e) => {

    e.preventDefault();
    if (dataUser.email) {
      try {
        console.log(dataUser)
        const response = await apiClient.post('/user', dataUser)
        console.log(response.data.data)
        localStorage.setItem('accessToken', response.data.data);
        // Redirect or do something after successful login
        navigate('/')
      } catch (error) {
        console.log('Login failed. Please check your credentials and try again.');
        console.error('Error during login:', error);
      }
    }
    
  }
  

  const changeInput = (e) => {const { value, name } = e.target;
  console.log(value, name)
  setDataUser({
    ...dataUser, [name] : value
  })
  console.log(dataUser)
}
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
                  <div className="input-group mb-3">
                    <input
                    name='fullname'
                    onChange={changeInput} 
                    type="text" 
                    className="form-control" 
                    placeholder="Nama Lengkap" 
                  />
                  </div>
                  <div className="input-group mb-3">
                    <input
                    name='username'
                    onChange={changeInput} 
                    type="text" 
                    className="form-control" 
                    placeholder="Username" 
                  />
                  </div>
                  <div className="input-group mb-3">
                    <input 
                    onChange={changeInput} 
                    type="email" 
                    name='email'
                    className="form-control" 
                    placeholder="Email address" />
                    
                  </div>
                  <div className="input-group mb-3">
                    <input
                    name='phone'
                    onChange={changeInput} 
                    type="text" 
                    className="form-control" 
                    placeholder="No. Telepon (Whatsapp)" 
                  />
                  </div>
                  <div className="input-group mb-4">
                    <input 
                    onChange={changeInput} 
                    type="password" 
                    name='password'
                    className="form-control" 
                    placeholder="Password" />
                  </div>
              <form noValidate onSubmit={handleLogin}>

                  <button onSubmit={handleLogin} type='submit' className="btn btn-primary mb-4">REGISTER</button>
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
