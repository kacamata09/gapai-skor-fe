import React, { useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";

const Soal = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Session 1",
      questions: [
        {
          id: 1,
          text: "Listen to the audio and answer the question:",
          audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Link contoh audio
          options: ["Option A", "Option B", "Option C"],
          selectedAnswer: null,
        },
        {
          id: 2,
          text: "Choose the correct option:",
          options: ["Option 1", "Option 2", "Option 3"],
          selectedAnswer: null,
        },
      ],
    },
    {
      id: 2,
      title: "Session 2",
      questions: [
        {
          id: 1,
          text: "Identify the synonym of 'happy':",
          options: ["Sad", "Joyful", "Angry"],
          selectedAnswer: null,
        },
      ],
    },
    {
      id: 3,
      title: "Session 3",
      questions: [
        {
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

  const currentSession = sessions[currentSessionIndex];

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card className="text-unmuted">
            <Card.Header>
              <Card.Title as="h5">{currentSession.title}</Card.Title>
            </Card.Header>
            <Card.Body>
              {currentSession.questions.map((question) => (
                <div key={question.id} className="mb-4">
                  <Card.Text>{question.text}</Card.Text>
                  {question.audio && (
                    // <audio controls className="mb-3">
                    //   <source src={question.audio} type="audio/mpeg" />
                    //   Your browser does not support the audio element.
                    // </audio>
                    <audio controls className="mb-3">
                      <source src={question.audio} type="audio/mpeg" />
                      <track kind="captions" srcLang="en" label="English captions" />
                      Your browser does not support the audio element.
                    </audio>

                  )}
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
                            handleAnswerChange(
                              currentSession.id,
                              question.id,
                              option
                            )
                          }
                          checked={
                            question.selectedAnswer === option
                          }
                        />
                      ))}
                    </Form.Group>
                  </fieldset>
                </div>
              ))}
            </Card.Body>
            <Card.Footer className="text-end">
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
          Selamat, Anda telah menyelesaikan semua sesi soal!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Soal;
