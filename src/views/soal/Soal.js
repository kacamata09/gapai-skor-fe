import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { apiClient } from '../../utils/apiclient';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLocalStorageItem } from '../../utils/localStorage';

const Soal = () => {
  const dataUser = getLocalStorageItem('dataUser');

  const [dataAttempt, setDataAttempt] = useState({});
  const [sessions, setSessions] = useState([
    {
      id: 1,
      session_type: 'Listening',
      questions: [
        {
          question_number: 1,
          id: 1,
          text: 'What did the audio say?',
          audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          image: 'https://via.placeholder.com/150',
          options: ['Option A', 'Option B', 'Option C'],
          selected_answer: null,
          play_count: 0
        },
        {
          question_number: 2,
          id: 2,
          text: 'Choose the correct option:',
          options: ['Option 1', 'Option 2', 'Option 3'],
          selected_answer: null
        }
      ]
    },
    {
      id: 2,
      session_type: 'Structure',
      questions: [
        {
          question_number: 1,
          id: 1,
          text: "Identify the synonym of 'happy':",
          image: 'https://via.placeholder.com/150',
          options: ['Sad', 'Joyful', 'Angry'],
          selected_answer: null
        }
      ]
    },
    {
      id: 3,
      session_type: 'Reading',
      questions: [
        {
          question_number: 1,
          id: 1,
          text: "Complete the sentence: 'She is ____ than her brother.'",
          options: ['taller', 'shorter', 'older'],
          selected_answer: null
        }
      ]
    }
  ]);
  const location = useLocation();
  const testState = location.state;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Modal error state
  const [timeLeft, setTimeLeft] = useState(7200);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  const fetchData = async () => {
    try {
      const data = await apiClient.get(`/test/code/${testState.test_code}`);
      const dataTest = data.data.data;
      setSessions(dataTest.sessions);
      console.log(dataTest);
      if (dataTest.sessions[0].questions == null) {
        setShowErrorModal(true); // Show error modal on fetch failure
      }

      const formatDataTest = {
        user_id: dataUser.id,
        test_id: dataTest.id
      };
      console.log(formatDataTest);
      const response = await apiClient.post('/attempt', formatDataTest);
      console.log(response);
      setDataAttempt(response.data.data);
    } catch (error) {
      setShowErrorModal(true); // Show error modal on fetch failure
    }
  };

  const getScore = async () => {
    try {
      const data = await apiClient.get(`/attempt/score/${dataAttempt.id}`);
      setDataAttempt(data.data.data);
      console.log(dataAttempt, 'scorererrererer');

      const newScore = Math.floor(dataAttempt.score / 100) * 100;

      setDataAttempt({ ...dataAttempt, score: newScore });
      setShowModal(true);
    } catch (error) {
      console.log('gagal ambil skor');
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
          getScore();
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
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // const handleAnswerChange = async (sessionId, questionId, answer, answer_id) => {
  //   const formatAttemptAnswer = {
  //     attempt_id: dataAttempt.id,
  //     question_id: questionId,
  //     selected_answer_option_id: answer_id
  //   };

  //   console.log(answer_id);
  //   const response = await apiClient.post('/attempt/answer', formatAttemptAnswer);
  //   console.log(response);

  //   const updatedSessions = sessions.map((session) => {
  //     if (session.id === sessionId) {
  //       const updatedQuestions = session.questions.map((question) =>
  //         question.id === questionId ? { ...question, selected_answer: answer } : question
  //       );
  //       return { ...session, questions: updatedQuestions };
  //     }
  //     return session;
  //   });
  //   setSessions(updatedSessions);
  // };
  const handleAnswerChange = async (sessionId, questionId, answer, answer_id) => {
    const formatAttemptAnswer = {
      attempt_id: dataAttempt.id,
      question_id: questionId,
      selected_answer_option_id: answer_id
    };

    // Update state terlebih dahulu
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        const updatedQuestions = session.questions.map((question) =>
          question.id === questionId ? { ...question, selected_answer: answer } : question
        );
        return { ...session, questions: updatedQuestions };
      }
      return session;
    });
    setSessions(updatedSessions);

    // Kirim data ke server tanpa menunggu
    await apiClient
      .post('/attempt/answer', formatAttemptAnswer)
      .then((response) => console.log('API Response:', response))
      .catch((error) => console.error('API Error:', error));
  };

  const handleAudioPlay = (sessionId, questionId) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        const updatedQuestions = session.questions.map((question) =>
          question.id === questionId ? { ...question, play_count: question.play_count + 1 } : question
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
      getScore();
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
    navigate('/'); // Redirect to home page after closing error modal
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <div style={{ textAlign: 'left', marginBottom: '10px' }}>
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
                        {/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(question.audio) ? (
                          <>
                            <Card.Text>Look at the image and answer the question:</Card.Text>
                            <img src={question.audio} alt="Question related" className="img-fluid mb-3" />
                          </>
                        ) : (
                          <>
                            <Card.Text>Listen to the audio and answer the question:</Card.Text>
                            <audio
                              controls
                              className="mb-3"
                              onPlay={() => handleAudioPlay(currentSession.id, question.id)}
                              onEnded={() => {
                                if (question.play_count >= 1) {
                                  const audioElement = document.querySelector(`audio[src="${question.audio}"]`);
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
                            {/* <p className="text-muted">
                                Note: Audio can only be played 2 times.
                              </p> */}
                          </>
                        )}
                      </>
                    )}

                    {question.image && (
                      <div className="mb-3">
                        <img src={question.image} alt="Question related" style={{ maxWidth: '100%', height: 'auto' }} />
                      </div>
                    )}
                    <Card.Text>
                      <strong>{`${question.question_number}. ${question.text}`}</strong>
                    </Card.Text>
                    <fieldset>
                      <Form.Group>
                        {/* {question.options.map((option, index) => (
                          <Form.Check
                            // key={index}
                            key={`question-${currentSession.id}-${question.id}-option-${index}`}
                            type="radio"
                            label={option}
                            name={`session-${currentSession.id}-question-${question.id}`}
                            id={`session-${currentSession.id}-question-${question.id}-option-${index}`}
                            onChange={() => handleAnswerChange(currentSession.id, question.id, option, question.answer_id[index])}
                            checked={question.selected_answer === option}
                          />
                        ))} */}
                        {question.options && question.options.length > 0 ? (
                          question.options.map((option, index) => (
                            <Form.Check
                              key={`option-${question.id}-${index}`}
                              type="radio"
                              label={option}
                              name={`session-${currentSession.id}-question-${question.id}`}
                              id={`session-${currentSession.id}-question-${question.id}-option-${index}`}
                              onChange={() => handleAnswerChange(currentSession.id, question.id, option, question.answer_id?.[index])}
                              checked={question.selected_answer === option}
                            />
                          ))
                        ) : (
                          <p>Loading options...</p>
                        )}
                      </Form.Group>
                    </fieldset>
                  </div>
                ))
              ) : (
                <Card.Text>No questions available for this session.</Card.Text>
              )}
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="secondary" onClick={handlePreviousSession} disabled={currentSessionIndex === 0} className="me-2">
                Previous Session
              </Button>
              <Button variant="primary" onClick={handleNextSession} disabled={currentQuestions.some((q) => !q.selected_answer)}>
                {currentSessionIndex < sessions.length - 1 ? 'Next Session' : 'Submit'}
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
        <Modal.Body>Kode test yang Anda masukkan salah atau sudah kadaluarsa.</Modal.Body>
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
          Selamat anda telah menyelesaikan semua sesi soal! Nilai anda lebih dari {dataAttempt.score}, detail nilainya saat klaim Sertifikat
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              navigate('/riwayat_test');
              setShowModal(false);
            }}
          >
            Klaim Sertifikat
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              navigate('/');
              setShowModal(false);
            }}
          >
            Tidak
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Soal;
