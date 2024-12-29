import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../../utils/apiclient';
import { useLocation } from 'react-router-dom';

const UserListWithHoverModal = () => {
  const location = useLocation();
  const testState = location.state;

  const [users, setUsers] = useState([
    { id: 1, fullname: 'Tidak ada user', email: '', phone: '', score: 680 },
  ]);

  const fetchData = async () => {
    try {
      const data = await apiClient.get(`/attempt/user/${testState.test_id}`);
      const dataAttempt = data.data.data;
      if (dataAttempt.length > 0) {

        setUsers(dataAttempt);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attemptToDelete, setAttemptToDelete] = useState(null);

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };

  const handleOpenDeleteModal = (user, e) => {
    e.stopPropagation();
    setAttemptToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setAttemptToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteUser = async () => {
    if (attemptToDelete) {
      try {
        await apiClient.delete(`/attempt/${attemptToDelete.id}`); // Sesuaikan endpoint API Anda
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== attemptToDelete.id));
        // alert('Pengguna berhasil dihapus.');
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat menghapus pengguna.');
      } finally {
        handleCloseDeleteModal();
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <h3 className="mb-4">Daftar Pengguna</h3>

      <Form.Control
        type="text"
        placeholder="Cari berdasarkan nama..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Row>
        {filteredUsers.map((user) => (
          <Col key={user.id} sm={4}>
            <Card
              className="shadow-sm border-0 p-3"
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderRadius: '15px',
                backgroundColor: '#394a64',
                color: '#ffffff',
              }}
              onClick={() => handleCardClick(user)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Row className="align-items-center">
                <Col xs={2} className="text-center">
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#57677b',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                    }}
                  >
                    {user.fullname.charAt(0)}
                  </div>
                </Col>
                <Col xs={6}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>
                    {user.fullname}
                  </div>
                  <div style={{ fontSize: '14px', color: '#d1d9e6' }}>
                    Score: {user.score}
                  </div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button className='feather icon-trash'
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => handleOpenDeleteModal(user, e)}
                  >
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showUserModal} onHide={handleCloseUserModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detail Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>
                <strong>Nama:</strong> {selectedUser.fullname}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Telepon:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Score:</strong> {selectedUser.score}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() =>
              window.open(`https://wa.me/${selectedUser.phone}`, '_blank')
            }
          >
            Kirim WhatsApp
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              window.open(`mailto:${selectedUser.email}`, '_blank')
            }
          >
            Kirim Email
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Penghapusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin menghapus pengguna {attemptToDelete?.fullname}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default UserListWithHoverModal;
