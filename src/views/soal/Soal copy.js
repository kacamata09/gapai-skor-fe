import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";

const Soal = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Listening",
      parts: [
        {
          partTitle: "Part A",
          questions: [
           
            { id: 1, text: "Question 1A", options: ["A", "B", "C"],  audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", selectedAnswer: null },
            { id: 2, text: "Question 2A", options: ["A", "B", "C"], selectedAnswer: null },
          ],
        },
        {
          partTitle: "Part B",
          questions: [
            { id: 3, text: "Question 1B", options: ["A", "B", "C"], selectedAnswer: null },
            { id: 4, text: "Question 2B", options: ["A", "B", "C"], selectedAnswer: null },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Structure",
      parts: [
        {
          partTitle: "Part A",
          questions: [
            { id: 1, text: "Identify the correct synonym of 'Happy'", options: ["Sad", "Joyful", "Angry"], selectedAnswer: null },
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Reading",
      parts: [
        {
          partTitle: "Part A",
          questions: [
            { id: 1, text: "Complete the sentence: 'She is ____ than her brother.'", options: ["taller", "shorter", "older"], selectedAnswer: null },
          ],
        },
      ],
    },
  ]);

  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // Timer untuk sesi

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval); // Hentikan timer jika habis
          setShowModal(true); // Tampilkan modal waktu habis
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleAnswerChange = (sessionId, partIndex, questionId, answer) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        const updatedParts = session.parts.map((part, index) => {
          if (index === partIndex) {
            const updatedQuestions = part.questions.map((question) =>
              question.id === questionId
                ? { ...question, selectedAnswer: answer }
                : question
            );
            return { ...part, questions: updatedQuestions };
          }
          return part;
        });
        return { ...session, parts: updatedParts };
      }
      return session;
    });
    setSessions(updatedSessions);
  };

  const handleNextSession = () => {
    if (currentSessionIndex < sessions.length - 1) {
      setCurrentSessionIndex(currentSessionIndex + 1);
    } else {
      setShowModal(true); // Menampilkan modal jika sesi terakhir selesai
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
        <Col sm={12} className="mb-3">
          <Card>
            <Card.Body className="p-2">
              <h5 className="mb-0">Waktu Anda Tersisa: {formatTime(timeLeft)}</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col sm={12}>
          <Card className="text-unmuted">
            <Card.Header>
              <Card.Title as="h5">{currentSession.title}</Card.Title>
            </Card.Header>
            <Card.Body>
              {currentSession.parts.map((part, partIndex) => (
                <div key={partIndex} className="mb-4">
                  <h3>{part.partTitle}</h3>
                  {part.questions.map((question) => (
                    <div key={question.id} className="mb-3">
                      <Card.Text>{question.text}</Card.Text>
                      <Form.Group>
                      {question.audio && (
                    <audio controls className="mb-3">
                      <source src={question.audio} type="audio/mpeg" />
                      <track kind="captions" srcLang="en" label="English captions" />
                      Your browser does not support the audio element.
                    </audio>
                      )}
                        {question.options.map((option, index) => (
                          <Form.Check
                            key={index}
                            type="radio"
                            label={option}
                            name={`session-${currentSession.id}-part-${partIndex}-question-${question.id}`}
                            id={`session-${currentSession.id}-part-${partIndex}-question-${question.id}-option-${index}`}
                            onChange={() =>
                              handleAnswerChange(
                                currentSession.id,
                                partIndex,
                                question.id,
                                option
                              )
                            }
                            
                            checked={question.selectedAnswer === option}
                          />
                        ))}
                      </Form.Group>
                    </div>
                  ))}
                </div>
              ))}
            </Card.Body>
            <Card.Footer className="text-end">
              <Button
                variant="secondary"
                onClick={handlePreviousSession}
                disabled={currentSessionIndex === 0}
              >
                Back
              </Button>{" "}
              <Button
                variant="primary"
                onClick={handleNextSession}
                disabled={currentSession.parts.some((part) =>
                  part.questions.some((q) => q.selectedAnswer === null)
                )}
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
              Selamat, Anda telah menyelesaikan semua sesi soal! Nilai anda lebih dari 500, detail nilainya saat klaim Sertifikat
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={() => setShowModal(false)}>
                Klaim Sertifikat
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Tidak
              </Button>
            </Modal.Footer>
          </Modal>
    </React.Fragment>
  );
};

export default Soal;
