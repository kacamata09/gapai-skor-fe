import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import apiClient from '../../utils/apiclient';
import { useLocation } from 'react-router-dom';


const BuatSoal = () => {

  const location = useLocation();
  const testState = location.state;

  console.log('State from navigate:', testState)


  const fetchData = async () => {
    try {
      
      const data = await apiClient.get('/question/test_id/' + testState.test_id)
      setSoals(data.data.data)
      if (data.data.data == null)  {
      setSoals([])
      }
      console.log(soals)
      console.log(data)
    } catch (error) {
      setSoals([])
    }

    
  }
  
  useEffect(()=> {
    fetchData()
  }, [])




  
  const [soal, setSoal] = useState({
    test_id: testState.test_id,
    content_question: '', // Ganti 'text' menjadi 'content_question'
    option_text: ['', '', '', ''],
    answer_options : [],
    correctOption: null, // Menyimpan indeks jawaban yang benar
    audio_url: null, // Ganti 'audio' menjadi 'audio_url'
    // audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Ganti 'audio' menjadi 'audio_url'
    
    image_url: null, // Menambahkan image_url
    question_number: 0,
    question_type: 'Listening', // Ganti 'type' menjadi 'question_type'
  });
  const [soals, setSoals] = useState([]); // Daftar soal
  const [isEdit, setIsEdit] = useState(false); // Menandakan jika sedang mengedit
  // const [editIndex, setEditIndex] = useState(null); // Index soal yang sedang diedit
  const [showModal, setShowModal] = useState(false); // Menampilkan modal konfirmasi hapus
  const [deleteIndex, setDeleteIndex] = useState(null); // Menyimpan index soal yang akan dihapus

  const handlePartChange = (e) => {
    setSoal({ ...soal, question_number: Number(e.target.value) });
  };

  const handleContentQuestionChange = (e) => {
    setSoal({ ...soal, content_question: e.target.value }); // Update 'text' menjadi 'content_question'
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...soal.option_text];
    newOptions[index] = e.target.value;
    setSoal({ ...soal, option_text: newOptions });
  };

  const handleAddOption = () => {
    setSoal({ ...soal, option_text: [...soal.option_text, ''] });
  };

  const handleRemoveOption = (index) => {
    const newOptions = soal.option_text.filter((_, i) => i !== index);
    setSoal({ ...soal, option_text: newOptions });
  };

  const handleAddAudio = (e) => {
    setSoal({ ...soal, audio_url: e.target.files[0] }); // Update 'audio' menjadi 'audio_url'
  };

  const handleAddImage = (e) => {
    setSoal({ ...soal, image_url: e.target.files[0] }); // Menambahkan image_url
  };

  const handleTypeChange = (e) => {
    setSoal({ ...soal, question_type: e.target.value }); // Update 'type' menjadi 'question_type'
  };

  const handleCorrectOptionChange = (index) => {
    setSoal({ ...soal, correctOption: index }); // Menyimpan indeks soal yang benar
  };

  // const handleAddSoal = (e) => {
  //   e.preventDefault()
  //   if (soal.content_question.trim() && soal.option_text.every(option => option.trim()) && soal.correctOption !== null) {
  //     if (isEdit) {
  //       // Jika sedang dalam mode edit, update soal yang ada
  //       const updatedSoals = [...soals];
  //       updatedSoals[editIndex] = soal;
  //       setSoals(updatedSoals);
  //     } else {
  //       setSoals([...soals, soal]); // Menambah soal baru
  //     }
  //     // setSoal({ content_question: '', option_text: ['', '', '', ''], correctOption: null, audio_url: null, image_url: null, question_type: 'Listening' }); // Reset form
  //     setIsEdit(false); // Reset mode edit
  //     setEditIndex(null); // Reset index edit
  //   } else {
  //     alert("Pastikan semua kolom terisi dengan benar dan jawaban yang benar dipilih!");
  //   }
  // };

  const handleAddData = async (e) => {

    console.log('sfsf')
    e.preventDefault();
    if (soal.content_question) {
      try {
        console.log(soal)
        for (let i in soal.option_text) {
          console.log("soal")

          let optionFormat = {
            is_correct : i == soal.correctOption ? 1 : 0,
            content_answer : soal.option_text[i]
          }
          soal.answer_options.push(optionFormat)
          console.log("tyyadf")
        }
        console.log(soal)

        const response = await apiClient.post('/question_options', soal)
        // const response = await apiClient.post('/test', {test_code: "manai", test_title: 'Larry', duration: 0, created_by: '' })
        console.log(response.data)
        // Redirect or do something after successful login
          // setTableData([...tableData, newEntry]);
          setSoal({ 
            test_code: 'nanti dari state yang halaman test akan mengisi ini',
            test_id : testState.test_id,
            content_question: '', // Ganti 'text' menjadi 'content_question'
            option_text: ['', '', '', ''],
            correctOption: null, // Menyimpan indeks jawaban yang benar
            answer_options: [],
            // audio_url: null, // Ganti 'audio' menjadi 'audio_url'
            audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Ganti 'audio' menjadi 'audio_url'
            image_url: null, // Menambahkan image_url
            question_number: 0,
            question_type: 'Listening', // Ganti 'type' menjadi 'question_type'
          });
          fetchData()
      } catch (error) {
        console.log('Add data failed and try again.');
        console.error('Error failed:', error);
      }
    }
  }

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
  const sortedSoals = [...soals].sort((a, b) => a.question_type.localeCompare(b.question_type));

  // Menghitung jumlah soal berdasarkan tipe
  const countSoalByType = (type) => {
    return soals.filter(soal => soal.question_type === type).length;
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card className='text-unmuted'>
            <Card.Header>
              <Card.Title as="h5">Buat Soal</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="formBasicContentQuestion" className='mb-3'>
                  <Form.Label>Soal</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={soal.content_question}
                    onChange={handleContentQuestionChange} // Update 'text' menjadi 'content_question'
                    placeholder="Masukkan soal"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicOptions" className='mb-3'>
                  <Form.Label>Opsi Jawaban</Form.Label>
                  {soal.option_text.map((option, index) => (
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
                        disabled={soal.option_text.length <= 2}
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
                    onChange={handleAddAudio} // Update 'audio' menjadi 'audio_url'
                  />
                </Form.Group>

                <Form.Group controlId="formBasicImage">
                  <Form.Label>Gambar Soal</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleAddImage} // Menambahkan gambar
                  />
                </Form.Group>

                <Form.Group controlId="formBasicType">
                  <Form.Label>Tipe Soal</Form.Label>
                  <Form.Control
                    as="select"
                    value={soal.question_type}
                    onChange={handleTypeChange} // Update 'type' menjadi 'question_type'
                  >
                    <option value="Listening">Listening</option>
                    <option value="Structure">Structure</option>
                    <option value="Reading">Reading</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formBasicPart" className='mb-3'>
                  <Form.Label>Nomor</Form.Label>
                  <Form.Control
                    type="number"
                    value={soal.question_number}
                    onChange={handlePartChange}
                    placeholder="Masukkan Nomor Berapa"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <form onSubmit={handleAddData}>
                  <Button variant="primary" type='submit' onClick={handleAddData}>
                    {isEdit ? 'Update Soal' : 'Tambah Soal'}
                  </Button>
                  </form>
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
                <li>Listening: {countSoalByType('Listening')}</li>
                <li>Structure: {countSoalByType('Structure')}</li>
                <li>Reading: {countSoalByType('Reading')}</li>
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
              {(soals || soals.length > 0) ? (
                sortedSoals.map((item, index) => (
                  <li key={index}>
                    <div>
                      <strong>{item.content_question}</strong>
                      <br />
                      Tipe: {item.question_type}, Nomor: {item.question_number}
                      <br />
                      {/* Opsi Jawaban: {item.option_text.join(', ')} */}
                      <br />
                      {item.audio_url && (
                        <audio controls className="mb-3">
                          {/* <source src={URL.createObjectURL(item.audio_url)} type="audio/mpeg" /> */}
                          <source src={item.audio_url} type="audio/mpeg" />
                          <track
                            kind="captions"
                            srcLang="en"
                            label="English captions"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      {item.image_url && <img src={item.image_url} alt="Gambar soal" className="mb-3" />}
                    </div>
                    <div>
                      <Button variant="outline-warning" onClick={() => handleEditSoal(index)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleDeleteSoal(index)}>
                        Hapus
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No data available</p>
              )}

              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal konfirmasi hapus soal */}
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
