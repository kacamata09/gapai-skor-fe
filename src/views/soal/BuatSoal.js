import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, Modal } from 'react-bootstrap';

const BuatSoal = () => {
  const [soal, setSoal] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOption: null, // Menyimpan indeks jawaban yang benar
    audio: null,
    type: 'Pilihan Ganda', // Default tipe soal
  });
  const [soals, setSoals] = useState([]); // Daftar soal
  const [isEdit, setIsEdit] = useState(false); // Menandakan jika sedang mengedit
  const [editIndex, setEditIndex] = useState(null); // Index soal yang sedang diedit
  const [showModal, setShowModal] = useState(false); // Menampilkan modal konfirmasi hapus
  const [deleteIndex, setDeleteIndex] = useState(null); // Menyimpan index soal yang akan dihapus

  const handleTextChange = (e) => {
    setSoal({ ...soal, text: e.target.value });
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...soal.options];
    newOptions[index] = e.target.value;
    setSoal({ ...soal, options: newOptions });
  };

  const handleAddOption = () => {
    setSoal({ ...soal, options: [...soal.options, ''] });
  };

  const handleRemoveOption = (index) => {
    const newOptions = soal.options.filter((_, i) => i !== index);
    setSoal({ ...soal, options: newOptions });
  };

  const handleAddAudio = (e) => {
    setSoal({ ...soal, audio: e.target.files[0] });
  };

  const handleTypeChange = (e) => {
    setSoal({ ...soal, type: e.target.value });
  };

  const handleCorrectOptionChange = (index) => {
    setSoal({ ...soal, correctOption: index }); // Menyimpan indeks soal yang benar
  };

  const handleAddSoal = () => {
    if (soal.text.trim() && soal.options.every(option => option.trim()) && soal.correctOption !== null) {
      if (isEdit) {
        // Jika sedang dalam mode edit, update soal yang ada
        const updatedSoals = [...soals];
        updatedSoals[editIndex] = soal;
        setSoals(updatedSoals);
      } else {
        setSoals([...soals, soal]); // Menambah soal baru
      }
      setSoal({ text: '', options: ['', '', '', ''], correctOption: null, audio: null, type: 'Pilihan Ganda' }); // Reset form
      setIsEdit(false); // Reset mode edit
      setEditIndex(null); // Reset index edit
    } else {
      alert("Pastikan semua kolom terisi dengan benar dan jawaban yang benar dipilih!");
    }
  };

  const handleEditSoal = (index) => {
    setSoal(soals[index]);
    setIsEdit(true);
    setEditIndex(index);
  };

  const handleDeleteSoal = (index) => {
    setDeleteIndex(index);
    setShowModal(true); // Menampilkan modal konfirmasi hapus
  };

  const handleConfirmDelete = () => {
    const updatedSoals = [...soals];
    updatedSoals.splice(deleteIndex, 1); // Menghapus soal dari daftar
    setSoals(updatedSoals);
    setShowModal(false); // Menutup modal
    setDeleteIndex(null); // Reset index delete
  };

  const handleCloseModal = () => {
    setShowModal(false); // Menutup modal tanpa menghapus soal
    setDeleteIndex(null); // Reset index delete
  };

  // Menyortir soal berdasarkan tipe soal
  const sortedSoals = [...soals].sort((a, b) => a.type.localeCompare(b.type));

  // Menghitung jumlah soal berdasarkan tipe
  const countSoalByType = (type) => {
    return soals.filter(soal => soal.type === type).length;
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Buat Soal</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="formBasicText" className='mb-3'>
                  <Form.Label>Soal</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={soal.text}
                    onChange={handleTextChange}
                    placeholder="Masukkan soal"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicOptions" className='mb-3'>
                  <Form.Label>Opsi Jawaban</Form.Label>
                  {soal.options.map((option, index) => (
                    <InputGroup className="mb-3" key={index}>
                      <Form.Control
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e)}
                        placeholder={`Opsi ${index + 1}`}
                      />
                      <Button
                        variant="outline-danger"
                        onClick={() => handleRemoveOption(index)}
                        disabled={soal.options.length <= 2}
                      >
                        Hapus
                      </Button>
                      <InputGroup.Text>
                      Benar <input
                          type="radio"
                          checked={soal.correctOption === index}
                          onChange={() => handleCorrectOptionChange(index)}
                        /> 
                      </InputGroup.Text>
                    </InputGroup>
                  ))}
                  <Button variant="outline-primary" onClick={handleAddOption}>
                    Tambah Opsi
                  </Button>
                </Form.Group>

                <Form.Group controlId="formBasicAudio">
                  <Form.Label>Audio Soal</Form.Label>
                  <Form.Control
                    type="file"
                    accept="audio/*"
                    onChange={handleAddAudio}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicType">
                  <Form.Label>Tipe Soal</Form.Label>
                  <Form.Control
                    as="select"
                    value={soal.type}
                    onChange={handleTypeChange}
                  >
                    <option value="Pilihan Ganda">Pilihan Ganda</option>
                    <option value="Essay">Essay</option>
                    <option value="True/False">True/False</option>
                  </Form.Control>
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="primary" onClick={handleAddSoal}>
                    {isEdit ? 'Update Soal' : 'Tambah Soal'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Menampilkan jumlah soal berdasarkan tipe */}
        <Col sm={12} className="mt-4">
          <Card>
            <Card.Header>
              <Card.Title as="h5">Jumlah Soal per Tipe</Card.Title>
            </Card.Header>
            <Card.Body>
              <ul>
                <li>Pilihan Ganda: {countSoalByType('Pilihan Ganda')}</li>
                <li>Essay: {countSoalByType('Essay')}</li>
                <li>True/False: {countSoalByType('True/False')}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        {/* Menampilkan daftar soal, sudah disortir berdasarkan tipe soal */}
        <Col sm={12} className="mt-4">
          <Card>
            <Card.Header>
              <Card.Title as="h5">Daftar Soal</Card.Title>
            </Card.Header>
            <Card.Body>
              <ul>
                {sortedSoals.map((item, index) => (
                  <li key={index}>
                    <strong>Soal:</strong> {item.text} <br />
                    <strong>Opsi:</strong> {item.options.join(', ')} <br />
                    <strong>Tipe Soal:</strong> {item.type} <br />
                    <strong>Jawaban Benar:</strong> {item.options[item.correctOption]} <br />
                    {item.audio && 
                    // <audio controls><source src={URL.createObjectURL(item.audio)} type="audio/mp3" /></audio>
                    <audio controls className="mb-3">
                    <source src={question.audio} type="audio/mpeg" />
                    <track kind="captions" srcLang="en" label="English captions" />
                    Your browser does not support the audio element.
                    </audio>
                    }
                    <Button variant="outline-info" onClick={() => handleEditSoal(index)} className="ml-2">Edit</Button>
                    <Button variant="outline-danger" onClick={() => handleDeleteSoal(index)} className="ml-2">Hapus</Button>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Konfirmasi Hapus */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus soal ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default BuatSoal;
