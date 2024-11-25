import React, { useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";

const Soal = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Listening",
      questions: [
        {
          questionNumber: 1,
          id: 1,
          text: "What audio said?",
          audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Link contoh audio
          image: 'https://www.researchgate.net/publication/327267367/figure/fig1/AS:664590664880143@1535462170643/Reading-section-directions-for-TOEFL-iBT-on-the-computer-screen-passage-are-also.png',
          options: ["Option A", "Option B", "Option C"],
          selectedAnswer: null,
        },
        {
          questionNumber: 2,
          id: 2,
          text: "Choose the correct option:",
          options: ["Option 1", "Option 2", "Option 3"],
          selectedAnswer: null,
        },
      ],
    },
    {
      id: 2,
      title: "Structure",
      questions: [
        {
          questionNumber: 1,
          id: 1,
          text: "Identify the synonym of 'happy':",
          image: "https://via.placeholder.com/150", // Contoh gambar
          options: ["Sad", "Joyful", "Angry"],
          selectedAnswer: null,
        },
      ],
    },
    {
      id: 3,
      title: "Reading",
      questions: [
        {
          questionNumber: 1,
          id: 1,
          text: "Complete the sentence: 'She is ____ than her brother.'",
          options: ["taller", "shorter", "older"],
          selectedAnswer: null,
        },
      ],
    },
  ]);
  

  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200); // Durasi 120 menit dalam detik

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          setShowModal(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (sessionId, questionId, answer) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        const updatedQuestions = session.questions.map((question) =>
          question.id === questionId
            ? { ...question, selectedAnswer: answer }
            : question
        );
        return { ...session, questions: updatedQuestions };
      }
      return session;
    });
    setSessions(updatedSessions);
  };

  const handleNextSession = () => {
    if (currentSessionIndex < sessions.length - 1) {
      setCurrentSessionIndex(currentSessionIndex + 1);
    } else {
      setShowModal(true); // Menampilkan popup saat sesi terakhir selesai
    }
  };

  const handlePreviousSession = () => {
    if (currentSessionIndex > 0) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    }
  };

  const currentSession = sessions[currentSessionIndex];

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            <h4>

            <strong className="text-unmuted">Waktu tersisa: {formatTime(timeLeft)}</strong>
            </h4>
          </div>
          <Card className="text-unmuted">
            <Card.Header>
              <Card.Title as="h5">{currentSession.title}</Card.Title>
            </Card.Header>
            <Card.Body>
            {currentSession.questions.map((question) => (
            <div key={question.id} className="mb-4">
              {/* Audio */}
              {question.audio && (
                <>
                  <Card.Text>Note: This audio just play one time </Card.Text>
                  <Card.Text>Listen to the audio and answer the question: () </Card.Text>
                  <audio controls className="mb-3">
                    <source src={question.audio} type="audio/mpeg" />
                    <track
                      kind="captions"
                      srcLang="en"
                      label="English captions"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </>
              )}

              {/* Gambar */}
              {question.image && (
                <div className="mb-3">
                  <img
                    src={question.image}
                    alt="Question related"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              )}

              {/* Tampilkan nomor soal berdasarkan questionNumber */}
              <Card.Text>
                <b>
                <strong>{`${question.questionNumber}. `}</strong> {question.text}

                </b>
              </Card.Text>

              {/* Pilihan jawaban */}
              <fieldset>
                <Form.Group>
                  {question.options.map((option, optionIndex) => (
                    <Form.Check
                      key={optionIndex}
                      type="radio"
                      label={option}
                      name={`session-${currentSession.id}-question-${question.id}`}
                      id={`session-${currentSession.id}-question-${question.id}-option-${optionIndex}`}
                      onChange={() =>
                        handleAnswerChange(currentSession.id, question.id, option)
                      }
                      checked={question.selectedAnswer === option}
                    />
                  ))}
                </Form.Group>
              </fieldset>
            </div>
          ))}

            </Card.Body>
            <Card.Footer className="text-end">
              <Button
                variant="secondary"
                onClick={handlePreviousSession}
                disabled={currentSessionIndex === 0} // Disable jika sesi pertama
                className="me-2"
              >
                Previous Session
              </Button>
              <Button
                variant="primary"
                onClick={handleNextSession}
                disabled={
                  currentSession.questions.some(
                    (q) => q.selectedAnswer === null
                  ) // Tombol disable jika jawaban belum dipilih
                }
              >
                {currentSessionIndex < sessions.length - 1
                  ? "Next Session"
                  : "Submit"}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Modal Popup */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Berhasil Submit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Selamat, Anda telah menyelesaikan semua sesi soal! nilai anda lebih dari 500, detail nilainya saat klaim Sertifikat
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            Klaim Sertifikat
          </Button>
          <Button variant="success" onClick={() => setShowModal(false)}>
            Tidak
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Soal;
