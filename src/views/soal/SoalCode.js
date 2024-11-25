import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';

const InputCodeSoal = () => {

  // const buttonOnlyIconOptions = [
  //   { variant: 'primary', icon: 'feather icon-thumbs-up' },
  //   { variant: 'secondary', icon: 'feather icon-camera' },
  //   { variant: 'success', icon: 'feather icon-check-circle' },
  // ];

  const buttonOptions = [
    { variant: 'primary', icon: 'feather icon-thumbs-up mx-1' },
    // { variant: 'secondary', icon: 'feather icon-camera mx-1' },
    // { variant: 'success', icon: 'feather icon-check-circle mx-1' },
    // { variant: 'danger', icon: 'feather icon-slash mx-1' },
    // { variant: 'warning', icon: 'feather icon-alert-triangle mx-1' },
    // { variant: 'info', icon: 'feather icon-info mx-1' }
  ];




  const iconButtons = buttonOptions.map((button, idx) => (
    <Button key={idx} variant={button.variant} className="p-4 text-capitalize">
      <i className={button.icon} />
      {button.variant}
    </Button>
  ));

  return (
    <React.Fragment>
      <Row>
        <Col sm={4}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Test Dengan Kode</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={12} style={{ overflowX: 'auto' }}>
                  <Card.Text className="text-muted mb-4">
                  Masukkan Kode Test yang diberikan oleh tutor anda
                  </Card.Text>
                  <Form className="d-inline-flex">
                    
                    <Form.Group className="d-inline-flex mr-5 mx-3 align-items-center">
                      <Form.Label className="mb-0">KODE:</Form.Label>
                      <Form.Control className="mx-2" type="text" placeholder="Masukkan kode test" />
                    </Form.Group>
                    <Form.Group className="d-inline-flex mx-3" style={{ overflow: 'unset' }}>
                      <Button className="mb-0">Masuk</Button>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
        <Card>
            <Card.Header>
              <Card.Title as="h5">Test sebelumnya</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card title="Button With Icon">{iconButtons}</Card>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Test Kepribadian</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form>
                    <h4>Test MBTI</h4>
                    <Card.Text className="text-unmuted mb-4">
                    Test MBTI adalah gini gitu gini, yang biasanya ada introvert, extrovert yang gitulah ya, paham kan ya
                    </Card.Text>
                    <Button variant="primary">Kerjakan</Button>
                  </Form>
                </Col>
                <Col md={4}>
                  <Form>
                    <h4>Test MBTI</h4>
                    <Card.Text className="text-unmuted mb-4">
                    Test MBTI adalah gini gitu gini, yang biasanya ada introvert, extrovert yang gitulah ya, paham kan ya
                    </Card.Text>
                    <Button variant="primary">Kerjakan</Button>
                  </Form>
                </Col>
                <Col md={4}>
                  <Form>
                    <h4>Test MBTI</h4>
                    <Card.Text className="text-unmuted mb-4">
                    Test MBTI adalah gini gitu gini, yang biasanya ada introvert, extrovert yang gitulah ya, paham kan ya
                    </Card.Text>
                    <Button variant="primary">Kerjakan</Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* <Col md={6}>
          <Card title="Only Icon">{onlyIconButtons}</Card>
        </Col> */}
      </Row>
    </React.Fragment>
  );
};

export default InputCodeSoal;
