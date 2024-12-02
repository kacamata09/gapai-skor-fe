import React, { useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";

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

  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200);

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

  const currentSession = sessions[currentSessionIndex];

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            <h4>
              <strong>Waktu tersisa: {formatTime(timeLeft)}</strong>
            </h4>
          </div>
          <Card>
            <Card.Header>
              <Card.Title as="h5">{currentSession.session_type}</Card.Title>
            </Card.Header>
            <Card.Body>
              {currentSession.questions.map((question) => (
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
              ))}
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
                disabled={currentSession.questions.some((q) => !q.selected_answer)}
              >
                {currentSessionIndex < sessions.length - 1 ? "Next Session" : "Submit"}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Submission Complete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have successfully completed all sessions! Your score will be displayed upon certificate claim.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            Claim Certificate
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Soal;
