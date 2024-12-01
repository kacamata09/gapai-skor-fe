import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

export const AuthGuard = ({ children }) => {
  const dataUser = localStorage.getItem('dataUser');
  if (!dataUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired, // Validasi properti children
};

export const PublicGuard = ({ children }) => {
  const dataUser = localStorage.getItem('dataUser');
  if (dataUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

PublicGuard.propTypes = {
  children: PropTypes.node.isRequired, // Validasi properti children
};
