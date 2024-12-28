import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiclient';

const InputTestAdmin = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'detail', or 'delete'
  const [selectedRow, setSelectedRow] = useState(null);
  const [newData, setNewData] = useState({ test_code: "", test_title: "", duration: 0, created_by: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data dari API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/test');
      setTableData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle perubahan input di modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  // Tambahkan data baru
  const handleAddData = async (e) => {
    e.preventDefault();
    if (!newData.test_code || !newData.test_title || !newData.created_by) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      await apiClient.post('/test', newData);
      setModalShow(false);
      fetchData();
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  // Hapus data dengan konfirmasi
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/test/${selectedRow.id}`);
      setModalShow(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Edit data
  const handleEdit = async () => {
    if (!newData.test_code || !newData.test_title || !newData.created_by) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      await apiClient.put(`/test/${selectedRow.id}`, newData);
      setModalShow(false);
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Buka modal
  const openModal = (type, row = null) => {
    setModalType(type);
    setSelectedRow(row);
    if (type === 'edit' && row) {
      setNewData({ test_code: row.test_code, test_title: row.test_title, duration: row.duration, created_by: row.created_by });
    } else if (type === 'add') {
      setNewData({ test_code: "", test_title: "", duration: 0, created_by: "" });
    }
    setModalShow(true);
  };

  // Navigasi ke halaman detail
  const handleDetailNavigation = () => {
    navigate('/admin_soal', { state: { test_id: selectedRow.id } });
  };

  // Navigasi ke halaman list soal
  const handleListNavigation = () => {
    navigate('/list_attempt_user', { state: { test_id: selectedRow.id } });
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">Daftar Test</Card.Title>
              <Button variant="primary" onClick={() => openModal('add')}>
                Tambah Data
              </Button>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <p className="text-center">Loading data...</p>
              ) : tableData.length === 0 ? (
                <p className="text-center">Tidak ada data tersedia.</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Kode Test</th>
                      <th>Nama Test</th>
                      <th>Durasi</th>
                      <th>Pembuat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id}>
                        <td>{row.test_code}</td>
                        <td>{row.test_title}</td>
                        <td>{row.duration}</td>
                        <td>{row.created_by}</td>
                        <td>
                          <Button variant="info" size="sm" onClick={() => openModal('detail', row)}>
                            Detail
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => openModal('edit', row)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => openModal('delete', row)}>
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
            {modalType === 'add' && 'Tambah Data'}
            {modalType === 'edit' && 'Edit Data'}
            {modalType === 'detail' && 'Detail Data'}
            {modalType === 'delete' && 'Hapus Data'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'detail' ? (
            <div>
              <p><strong>Kode Test:</strong> {selectedRow?.test_code}</p>
              <p><strong>Nama Test:</strong> {selectedRow?.test_title}</p>
              <p><strong>Durasi:</strong> {selectedRow?.duration}</p>
              <p><strong>Pembuat:</strong> {selectedRow?.created_by}</p>
              <Button variant="primary" onClick={handleDetailNavigation}>
                Buat Soal
              </Button>
              <Button variant="secondary" onClick={handleListNavigation}>
                List Soal
              </Button>
            </div>
          ) : modalType === 'delete' ? (
            <div>
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <p><strong>Nama Test:</strong> {selectedRow?.test_title}</p>
            </div>
          ) : (
            <Form onSubmit={modalType === 'add' ? handleAddData : handleEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Test</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama test"
                  name="test_title"
                  value={newData.test_title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kode Test</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan kode test"
                  name="test_code"
                  value={newData.test_code}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pembuat</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama pembuat"
                  name="created_by"
                  value={newData.created_by}
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
            <Button variant="primary" onClick={handleAddData}>
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

export default InputTestAdmin;
