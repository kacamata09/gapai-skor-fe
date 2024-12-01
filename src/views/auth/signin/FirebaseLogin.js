import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';

import * as Yup from 'yup';
import { Formik } from 'formik';
import apiClient from '../../../utils/apiclient';
import { useNavigate } from 'react-router-dom';
import { setLocalStorageItem } from '../../../utils/localStorage';

const FirebaseLogin = ({ className, ...rest }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (values, { setSubmitting }) => {
    setErrorMessage(''); // Reset error message
    try {
      const response = await apiClient.post('/auth/login', {
        username: values.username,
        password: values.password,
      });

      const token = response.data?.data?.data_user;
      console.log(token)
      if (token) {
        // localStorage.setItem('dataUser', JSON.stringify(token));
        setLocalStorageItem('dataUser', token)

        navigate('/');
      } else {
        setErrorMessage('Login failed: Invalid credentials');
      }
    } catch (error) {
      setErrorMessage('Login failed: Please check your credentials and try again.');
      console.error('Error during login:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required('Username is required'),
          password: Yup.string().required('Password is required'),
        })}
        onSubmit={handleLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <div className="form-group mb-3">
              <input
                className="form-control"
                label="Username"
                name="username"
                placeholder='Masukkan Username'
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.username}
              />
              {touched.username && errors.username && (
                <small className="text-danger form-text">{errors.username}</small>
              )}
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control"
                label="Password"
                name="password"
                placeholder='Masukkan Password'
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              {touched.password && errors.password && (
                <small className="text-danger form-text">{errors.password}</small>
              )}
            </div>

            {errorMessage && (
              <Col sm={12}>
                <Alert variant="danger">{errorMessage}</Alert>
              </Col>
            )}

            {/* <div className="custom-control custom-checkbox text-start mb-4 mt-2">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Save credentials.
              </label>
            </div> */}

            <Row>
              <Col mt={2}>
                <Button
                  className="btn-block"
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="primary"
                >
                  Sign in
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>

      {/* <Row>
        <Col sm={12}>
          <h5 className="my-3"> OR </h5>
        </Col>
      </Row> */}

      {/* <Row>
        <Col sm={12}>
          <Button variant="danger">
            <i className="fa fa-lock" /> Sign in with Google
          </Button>
        </Col>
      </Row> */}

      <hr />
    </React.Fragment>
  );
};

FirebaseLogin.propTypes = {
  className: PropTypes.string,
};

export default FirebaseLogin;
