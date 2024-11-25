import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// import avatar1 from '../../assets/images/user/avatar-1.jpg';
// import avatar2 from '../../assets/images/user/avatar-2.jpg';
// import avatar3 from '../../assets/images/user/avatar-3.jpg';

const dashSalesData = [
  { title: 'Total Test Dikerjakan', amount: '30', icon: 'text-c-green', class: 'progress-c-theme' },
  // { title: 'Soal Berjalan', amount: '2.942.32', icon: 'icon-arrow-down text-c-red', class: 'progress-c-theme2' },
  { title: 'Total Sertifikat Diklaim', amount: '20', icon: 'text-c-green', color: 'progress-c-theme' },
  { title: 'Nilai TOEFL Tertiggi', amount: '502', icon: 'text-c-green', color: 'progress-c-theme' },
  { title: 'Test MBTI', amount: 'INTP', icon: 'text-c-green', color: 'progress-c-theme' }
];

const DashDefault = () => {
  return (
    <React.Fragment>
      <Row>
        {dashSalesData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={3} md={3}>
              <Card>
                <Card.Body>
                  <h4 className="mb-4">{data.title}</h4>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather {data.icon} f-30 m-r-5`} /> {data.amount}
                      </h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}

      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
