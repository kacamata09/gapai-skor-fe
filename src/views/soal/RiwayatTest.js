import React, { useEffect, useState } from "react";
import { Card, Modal, Button, Container, Row, Col } from "react-bootstrap";
import { apiClient } from "../../utils/apiclient";
import { getLocalStorageItem } from "../../utils/localStorage";


const TestHistory = () => {


  const dataUser = getLocalStorageItem('dataUser')

  const [testHistory, setTestHistory] = useState([
    // {
    //   id: 1,
    //   test_title: "TOEFL Gapai try out",
    //   attempt_date: "2024-11-20",
    //   score: 85,
    //   details: "Listening comprehension with audio.",
    //   certificateAvailable: true,
    //   certificateLink: "https://example.com/toefl-listening-cert",
    // }
  ]);

  const fetchData = async () => {
    try {
      const data = await apiClient.get(`/attempt/history/${dataUser.id}`);
      const dataAttempt = data.data.data
      console.log(dataAttempt)
      const newAttempt = []
      for (const i of dataAttempt) {

        const newScore = Math.floor(i.score / 100) * 100;
        const formatDataHistory = {
            ...i,
            score : newScore,
            details: "Listening comprehension with audio.",
            certificateAvailable: true,
            certificateLink: "https://example.com/toefl-listening-cert",
        }
        newAttempt.push(formatDataHistory)
      }
      setTestHistory(newAttempt)
      console.log(testHistory)
      

    } catch (error) {
      console.log(error)
    } 
  };


  useEffect(() => {
    fetchData();
  }, []);



  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const handleCardClick = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTest(null);
  };

  const handleClaimCertificate = (link) => {
    if (link) {
      window.location.href = link; // Arahkan ke tautan sertifikat
    }
  };

  return (
    <Container className="mt-4">
      <h3>Riwayat Tes</h3>
      <Row>
        {testHistory.map((test) => (
          <Col key={test.id} sm={12} md={6} lg={4} className="mb-3">
            <Card
              className="h-100 shadow-sm"
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={() => handleCardClick(test)}
            >
              <Card.Body>
                <Card.Title>{test.test_title}</Card.Title>
                <Card.Text>
                  <strong>Date:</strong> {test.attempt_date}
                </Card.Text>
                <Card.Text>
                  <strong>Score: Diatas</strong> {test.score}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Test Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detail Tes</Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          {selectedTest && (
            <>
              <h4>{selectedTest.test_title}</h4>
              <h5>
                <strong>Date:</strong> {selectedTest.attempt_date}
              </h5>
              <h5>
                <strong>Score: Diatas</strong> {selectedTest.score}
              </h5>
              <p>{selectedTest.details}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedTest && selectedTest.certificateAvailable ? (
            <Button
              variant="primary"
              onClick={() => handleClaimCertificate("https://lynk.id/gapaiskor")}
            >
              Claim Sertifikat
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              Tidak Tersedia / Sudah di Klaim
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TestHistory;
