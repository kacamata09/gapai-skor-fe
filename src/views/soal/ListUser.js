import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import apiClient from '../../utils/apiclient';

const UserManagement = () => {
//   const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'detail', or 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    last_login: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const dummyData = [
    {
      id: 1,
      fullname: "John Doe",
      username: "johndoe",
      email: "johndoe@example.com",
      phone: "081234567890",
      password: "********",
      last_login: "2024-12-01 08:00:00",
      role: "Admin"
    },
    {
      id: 2,
      fullname: "Jane Smith",
      username: "janesmith",
      email: "janesmith@example.com",
      phone: "081298765432",
      password: "********",
      last_login: "2024-12-01 09:00:00",
      role: "User"
    }
  ];

  // Fetch data dari API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/users');
      const fetchedUsers = response.data.data || [];
      setUsers(fetchedUsers.length > 0 ? fetchedUsers : dummyData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers(dummyData); // Menggunakan data dummy jika API gagal
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle perubahan input di modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Tambahkan data pengguna baru
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.fullname || !newUser.username || !newUser.email || !newUser.phone || !newUser.password || !newUser.role) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      await apiClient.post('/users', newUser);
      setModalShow(false);
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Hapus data pengguna
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/users/${selectedUser.id}`);
      setModalShow(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Edit data pengguna
  const handleEdit = async () => {
    if (!newUser.fullname || !newUser.username || !newUser.email || !newUser.phone || !newUser.role) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      await apiClient.put(`/users/${selectedUser.id}`, newUser);
      setModalShow(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Buka modal
  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (type === 'edit' && user) {
      setNewUser({
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        password: "",
        last_login: user.last_login,
        role: user.role
      });
    } else if (type === 'add') {
      setNewUser({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        last_login: "",
        role: ""
      });
    }
    setModalShow(true);
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">Manajemen Pengguna</Card.Title>
              <Button variant="primary" onClick={() => openModal('add')}>
                Tambah Pengguna
              </Button>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <p className="text-center">Loading data...</p>
              ) : users.length === 0 ? (
                <p className="text-center">Tidak ada data tersedia.</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Nama Lengkap</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Telepon</th>
                      <th>Role</th>
                      <th>Login Terakhir</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.fullname}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>{user.last_login}</td>
                        <td>
                          <Button variant="info" size="sm" onClick={() => openModal('detail', user)}>
                            Detail
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => openModal('edit', user)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => openModal('delete', user)}>
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Popup */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'add' && 'Tambah Pengguna'}
            {modalType === 'edit' && 'Edit Pengguna'}
            {modalType === 'detail' && 'Detail Pengguna'}
            {modalType === 'delete' && 'Hapus Pengguna'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'detail' ? (
            <div>
              <p><strong>Nama Lengkap:</strong> {selectedUser?.fullname}</p>
              <p><strong>Username:</strong> {selectedUser?.username}</p>
              <p><strong>Email:</strong> {selectedUser?.email}</p>
              <p><strong>Telepon:</strong> {selectedUser?.phone}</p>
              <p><strong>Role:</strong> {selectedUser?.role}</p>
              <p><strong>Login Terakhir:</strong> {selectedUser?.last_login}</p>
            </div>
          ) : modalType === 'delete' ? (
            <div>
              <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
              <p><strong>Nama Lengkap:</strong> {selectedUser?.fullname}</p>
            </div>
          ) : (
            <Form onSubmit={modalType === 'add' ? handleAddUser : handleEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Lengkap</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  name="fullname"
                  value={newUser.fullname}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Masukkan email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Telepon</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan nomor telepon"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Masukkan password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan role pengguna"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Batal
          </Button>
          {modalType === 'add' && (
            <Button variant="primary" onClick={handleAddUser}>
              Tambah
            </Button>
          )}
          {modalType === 'edit' && (
            <Button variant="primary" onClick={handleEdit}>
              Simpan
            </Button>
          )}
          {modalType === 'delete' && (
            <Button variant="danger" onClick={handleDelete}>
              Hapus
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default UserManagement;
