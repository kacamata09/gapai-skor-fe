import React, { useState } from 'react';
import { ListGroup, Dropdown, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getLocalStorageItem } from '../../../../utils/localStorage';
import ChatList from './ChatList';

import avatar1 from '../../../../assets/images/user/avatar-1.jpg';

const NavRight = () => {
  
  const [listOpen, setListOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Untuk navigasi setelah logout

  const dataUser = getLocalStorageItem('dataUser')

  const handleLogout = () => {
    // Hapus dataUser dari localStorage
    localStorage.removeItem('dataUser');
    // Arahkan ke halaman login
    navigate('/login');
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="start" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>{dataUser.fullname}</span>
                <Link to="#" className="dud-logout" title="Logout" onClick={handleModalShow}>
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item" onClick={handleModalShow}>
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />

      {/* Modal untuk Konfirmasi Logout */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default NavRight;
