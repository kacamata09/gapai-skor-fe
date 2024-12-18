import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { apiClient } from "../../utils/apiclient";
import { useLocation, useNavigate } from "react-router-dom";

const Soal = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      session_type: "Listening",
      questions: [
        {
          question_number: 1,
          id: 1,
          text: "What did the audio say?",
          audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          image: "https://via.placeholder.com/150",
          options: ["Option A", "Option B", "Option C"],
          selected_answer: null,
          play_count: 0,
        },
        {
          question_number: 2,
          id: 2,
          text: "Choose the correct option:",
          options: ["Option 1", "Option 2", "Option 3"],
          selected_answer: null,
        },
      ],
    },
    {
      id: 2,
      session_type: "Structure",
      questions: [
        {
          question_number: 1,
          id: 1,
          text: "Identify the synonym of 'happy':",
          image: "https://via.placeholder.com/150",
          options: ["Sad", "Joyful", "Angry"],
          selected_answer: null,
        },
      ],
    },
    {
      id: 3,
      session_type: "Reading",
      questions: [
        {
          question_number: 1,
          id: 1,
          text: "Complete the sentence: 'She is ____ than her brother.'",
          options: ["taller", "shorter", "older"],
          selected_answer: null,
        },
      ],
    },
  ]);
  const location = useLocation();
  const testState = location.state;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Modal error state
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  const fetchData = async () => {
    try {
      const data = await apiClient.get(`/test/code/${testState.test_code}`);
      setSessions(data.data.data.sessions);
      console.log(data.data.data.sessions )
      if (data.data.data.sessions[0].questions == null) {
        setShowErrorModal(true); // Show error modal on fetch failure
      }
    } catch (error) {
      setShowErrorModal(true); // Show error modal on fetch failure
    } 
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            ? { ...question, selected_answer: answer }
            : question
        );
        return { ...session, questions: updatedQuestions };
      }
      return session;
    });
    setSessions(updatedSessions);
  };

  const handleAudioPlay = (sessionId, questionId) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        const updatedQuestions = session.questions.map((question) =>
          question.id === questionId
            ? { ...question, play_count: question.play_count + 1 }
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
      setShowModal(true);
    }
  };

  const handlePreviousSession = () => {
    if (currentSessionIndex > 0) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    }
  };

  const currentSession = sessions[currentSessionIndex] || {}; // Handle undefined session
  const currentQuestions = currentSession.questions || []; // Handle undefined questions

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    navigate("/"); // Redirect to home page after closing error modal
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            <h4>
              <strong>Waktu tersisa: {formatTime(timeLeft)}</strong>
            </h4>
          </div>
          <Card className="text-unmuted">
            <Card.Header>
              <Card.Title as="h5">{currentSession.session_type}</Card.Title>
            </Card.Header>
            <Card.Body>
              {currentQuestions.length > 0 ? (
                currentQuestions.map((question) => (
                  <div key={question.id} className="mb-4">
                    {question.audio && (
                      <>
                        <Card.Text>Listen to the audio and answer the question:</Card.Text>
                        <audio
                          controls
                          className="mb-3"
                          onPlay={() => handleAudioPlay(currentSession.id, question.id)}
                          onEnded={() => {
                            if (question.play_count >= 1) {
                              const audioElement = document.querySelector(
                                `audio[src="${question.audio}"]`
                              );
                              if (audioElement) {
                                audioElement.controls = false;
                              }
                            }
                          }}
                        >
                          <source src={question.audio} type="audio/mpeg" />
                          <track kind="captions" srcLang="en" label="English captions" />
                          Your browser does not support the audio element.
                        </audio>
                        <p className="text-muted">
                          Note: Audio can only be played 2 times.
                        </p>
                      </>
                    )}
                    {question.image && (
                      <div className="mb-3">
                        <img
                          src={question.image}
                          alt="Question related"
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </div>
                    )}
                    <Card.Text>
                      <strong>{`${question.question_number}. ${question.text}`}</strong>
                    </Card.Text>
                    <fieldset>
                      <Form.Group>
                        {question.options.map((option, index) => (
                          <Form.Check
                            key={index}
                            type="radio"
                            label={option}
                            name={`session-${currentSession.id}-question-${question.id}`}
                            id={`session-${currentSession.id}-question-${question.id}-option-${index}`}
                            onChange={() =>
                              handleAnswerChange(currentSession.id, question.id, option)
                            }
                            checked={question.selected_answer === option}
                          />
                        ))}
                      </Form.Group>
                    </fieldset>
                  </div>
                ))
              ) : (
                <Card.Text>No questions available for this session.</Card.Text>
              )}
            </Card.Body>
            <Card.Footer className="text-end">
              <Button
                variant="secondary"
                onClick={handlePreviousSession}
                disabled={currentSessionIndex === 0}
                className="me-2"
              >
                Previous Session
              </Button>
              <Button
                variant="primary"
                onClick={handleNextSession}
                disabled={currentQuestions.some((q) => !q.selected_answer)}
              >
                {currentSessionIndex < sessions.length - 1 ? "Next Session" : "Submit"}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Error Modal */}
      <Modal show={showErrorModal} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Kode test yang Anda masukkan salah atau sudah kadaluarsa.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseErrorModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Timeout Modal */}
      <Modal show={showModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
              <Modal.Title>Ujian Selesai</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Selamat anda telah menyelesaikan semua sesi soal! Nilai anda lebih dari 500, detail nilainya saat klaim Sertifikat
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
