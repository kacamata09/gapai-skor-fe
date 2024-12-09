import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InputCodeSoal = () => {
  const navigate = useNavigate();

  // Data tombol untuk tes sebelumnya
  const buttons = [
    { variant: 'primary', label: 'Klaim Sertifikat Tes Sebelumnya', icon: 'feather icon-check', link: "https://lynk.id/gapaiskor" },
    { variant: 'danger', label: 'Lihat Riwayat Tes', icon: 'feather icon-eye', link: "/riwayat_test" },
  ];

  const [testCode, setTestCode] = useState("test");

  const handleBuatSoalNavigation = () => {
    navigate('/soal', { state: { test_code: testCode } });
  };

  // Data soal MBTI
  const mbtiTests = [
    {
      title: "Tes MBTI - Introvert vs Extrovert",
      description:
        "Tes ini membantu Anda memahami apakah Anda cenderung introvert atau extrovert.",
      disabled: true,
    },
    {
      title: "Tes MBTI - Sensing vs Intuition",
      description:
        "Tes ini membantu Anda menentukan cara Anda mengumpulkan informasi, melalui penginderaan atau intuisi.",
      disabled: true,
    },
    {
      title: "Tes MBTI - Thinking vs Feeling",
      description:
        "Tes ini mengidentifikasi bagaimana Anda membuat keputusan, berdasarkan logika atau perasaan.",
      disabled: true,
    },
  ];

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
                    onChange={(e) => {
                      e.preventDefault();
                      const { value } = e.target;
                      setTestCode(value);
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (button.link.startsWith("http")) {
                      window.location.href = button.link; // Arahkan ke tautan sertifikat
                    } else {
                      navigate(button.link);
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
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Tes Kepribadian (COMING SOON)</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                {mbtiTests.map((test, index) => (
                  <Col md={4} key={index}>
                    <Card className="mb-3">
                      <Card.Body>
                        <h4>{test.title}</h4>
                        <Card.Text className="text-muted mb-4">
                          {test.description}
                        </Card.Text>
                        <Button disabled={test.disabled} variant="secondary">
                          {test.disabled ? "Kerjakan" : "Mulai"}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default InputCodeSoal;