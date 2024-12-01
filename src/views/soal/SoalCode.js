import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InputCodeSoal = () => {
  const navigate = useNavigate()

  const buttons = [
    { variant: 'primary', label: 'Klaim Sertifikat Tes Sebelumnya', icon: 'feather icon-check', link: "https://api.whatsapp.com/send?phone=6285795596736" },
    { variant: 'secondary', label: 'Lihat Riwayat Tes', icon: 'feather icon-eye', link: "/riwayat_test" },
  ];

  const [testCode, setTestCode] = useState("test")

    const handleBuatSoalNavigation = () => {
      navigate('/soal', { state: { test_code: testCode } });
    };    
        
  return ( 
    <React.Fragment>
      <Row className="mb-4">
        {/* Kartu Masukkan Kode */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title as="h5">Masukkan Kode Ujian</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text className="text-muted mb-4">
                Masukkan kode ujian yang telah diberikan oleh tutor Anda di sini.
              </Card.Text>
              <Form className="d-inline-flex">
                <Form.Group className="d-inline-flex align-items-center mx-3">
                  <Form.Label className="mb-0">Kode:</Form.Label>
                  <Form.Control
                    onChange={(e)=> {
                      e.preventDefault()
                      const { value } = e.target;
                      setTestCode(value)
                    }}
                    className="mx-2"
                    type="text"
                    placeholder="Masukkan kode ujian"
                  />
                </Form.Group>
                <Form.Group className="d-inline-flex mx-3">
                  <Button variant="primary" className="mb-0" onClick={handleBuatSoalNavigation}>
                    Masuk
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Kartu Tes Sebelumnya */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title as="h5">Tes Sebelumnya</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center">
              {buttons.map((button, idx) => (
                <Button
                  onClick={(e)=> {
                    e.preventDefault()
                    if (button.link.startsWith("http")) {
                      window.location.href = button.link; // Arahkan ke tautan sertifikat
                    } else {
                      navigate(button.link)
                    }
                  }}
                  key={idx}
                  variant={button.variant}
                  className="mb-2 d-flex align-items-center justify-content-center"
                >
                  <i className={`${button.icon} mx-2`} />
                  {button.label}
                </Button>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

        {/* Kartu Tes Kepribadian */}
      {/* <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Tes Kepribadian</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                {[1, 2, 3].map((_, index) => (
                  <Col md={4} key={index}>
                    <Form>
                      <h4>Tes MBTI</h4>
                      <Card.Text className="text-muted mb-4">
                        Tes MBTI memberikan hasil tentang tipe kepribadian Anda, seperti introvert atau extrovert.
                      </Card.Text>
                      <Button variant="primary">Kerjakan</Button>
                    </Form>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
      
    </React.Fragment>
  );
};

export default InputCodeSoal;
