import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';
import apiClient from '../../utils/apiclient';
import { useLocation } from 'react-router-dom';

const UserListWithHoverModal = () => {
    const location = useLocation();
    const testState = location.state;


    const [users, setUsers] = useState([
      { id: 1, fullname: 'John Doe', email: 'john@example.com', phone: '+123456789', score: 85 },
      { id: 2, fullname: 'Jane Smith', email: 'jane@example.com', phone: '+987654321', score: 92 },
      { id: 3, fullname: 'Mike Johnson', email: 'mike@example.com', phone: '+192837465', score: 78 },
    ])

  const fetchData = async () => {
  
  
    try {
      const data = await apiClient.get(`/attempt/user/${testState.test_id}`);
      const dataAttempt = data.data.data;
      console.log(dataAttempt);
      setUsers(dataAttempt);
      console.log(testHistory);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');  // State untuk pencarian

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  // Filter users berdasarkan nama
  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())  // Case-insensitive search
  );

  return (
    <React.Fragment>
      <h3 className="mb-4">
        Daftar Pengguna
      </h3>

      {/* Input Pencarian */}
      <Form.Control
        type="text"
        placeholder="Cari berdasarkan nama..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Row className="">
        {filteredUsers.map((user) => (
          <Col key={user.id} sm={4}>
            <Card
              className="shadow-sm border-0 p-3"
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderRadius: '15px',
                backgroundColor: '#394a64', // Biru dongker pastel
                color: '#ffffff', // Warna teks putih untuk kontras
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
                      backgroundColor: '#57677b', // Warna lebih terang untuk lingkaran
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
                <Col xs={8}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>
                    {user.fullname}
                  </div>
                  <div style={{ fontSize: '14px', color: '#d1d9e6' }}>
                    Score: {user.score} {/* Menampilkan score bukan email */}
                  </div>
                </Col>
                <Col xs={2} className="text-end">
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#d1d9e6',
                    }}
                  >
                    User
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
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
                <strong>Score:</strong> {selectedUser.score} {/* Menampilkan score di modal */}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer">
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
    </React.Fragment>
  );
};

export default UserListWithHoverModal;
