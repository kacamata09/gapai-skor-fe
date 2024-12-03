import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import apiClient from '../../utils/apiclient';

const InputTestAdmin = () => {
  const navigate = useNavigate(); // Hook untuk navigasi
  const fetchData = async () => {

    const data = await apiClient.get('/test')
    setTableData(data.data.data)
    
  }
  
  useEffect(()=> {
    fetchData()
  }, [])

  const [tableData, setTableData] = useState([
    { id: 1, test_code: "d", test_title: 'Mark', duration: 'Otto', created_by: '@mdo' },
    { id: 2, test_code: "f", test_title: 'Jacob', duration: 'Thornton', created_by: '@fat' },
    { id: 3, test_code: "f", test_title: 'Larry', duration: 'Bird', created_by: '@twitter' },
  ]);

  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', or 'detail'
  const [selectedRow, setSelectedRow] = useState(null);
  const [newData, setNewData] = useState({ test_code: "", test_title: '', duration: 0, created_by: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleAddData = async (e) => {

    e.preventDefault();
    if (newData.test_code) {
      try {
        console.log(newData)

        const response = await apiClient.post('/test', newData)
        // const response = await apiClient.post('/test', {test_code: "manai", test_title: 'Larry', duration: 0, created_by: '' })
        console.log(response.data)
        // Redirect or do something after successful login
          // setTableData([...tableData, newEntry]);
          setNewData({ test_code: "", test_title: '', duration: '', created_by: '' });
          setModalShow(false);
          fetchData()
      } catch (error) {
        console.error('Error during input:', error);
      }
    }
  }

  const handleDelete = (id) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  const handleEdit = () => {
    const updatedData = tableData.map((row) =>
      row.id === selectedRow.id ? { ...selectedRow, ...newData } : row
    );
    setTableData(updatedData);
    setModalShow(false);
  };

  const openModal = (type, row = null) => {
    setModalType(type);
    setSelectedRow(row);
    if (type === 'edit' && row) {
      setNewData({ test_code: row.test_code, test_title: row.test_title, duration: row.duration, created_by: row.created_by });
    } else if (type === 'add') {
      setNewData({ test_code: "", test_title: '', duration: 0, created_by: '' });
    }
    setModalShow(true);
  };

  // Fungsi untuk membuka halaman BuatSoal dengan mengirimkan test_code
  const handleDetailNavigation = () => {
    // Arahkan ke halaman BuatSoal dan kirimkan test_code melalui query params atau state
    navigate('/admin/soal', { state: { test_id: selectedRow.id } });
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title as="h5">Hover Table</Card.Title>
                <span className="d-block m-t-5">
                  use props <code>hover</code> with <code>Table</code> component
                </span>
              </div>
              <Button variant="primary" onClick={() => openModal('add')}>
                Tambah Data
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Kode Test</th>
                    <th>Nama Test</th>
                    <th>Durasi</th>
                    <th>Pembuat</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Data tidak ada
                    </td>
                  </tr>
                ) : (
                  tableData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.test_code}</td>
                      <td>{row.test_title}</td>
                      <td>{row.duration}</td>
                      <td>{row.created_by}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => openModal('detail', row)}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => openModal('edit', row)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(row.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              </Table>
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
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'detail' ? (
            <div>
              <p>
                <strong>Kode Test:</strong> {selectedRow?.test_code}
              </p>
              <p>
                <strong>Nama Test:</strong> {selectedRow?.test_title}
              </p>
              <p>
                <strong>Durasi:</strong> {selectedRow?.duration}
              </p>
              <p>
                <strong>Pembuat:</strong> {selectedRow?.created_by}
              </p>
              {/* Tombol untuk navigasi ke halaman BuatSoal */}
              <Button variant="primary" onClick={handleDetailNavigation}>
                Buat Soal
              </Button>
            </div>
          ) : (
            <Form>
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>Nama Test</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="test_title"
                  value={newData.test_title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>Kode Test</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="test_code"
                  value={newData.test_code}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter created_by"
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
            <form onSubmit={handleAddData}>

            <Button variant="primary" type='submit' onClick={handleAddData}>
              Tambah
            </Button>
            </form>
          )}
          {modalType === 'edit' && (
            <Button variant="primary" onClick={handleEdit}>
              Simpan
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default InputTestAdmin;
