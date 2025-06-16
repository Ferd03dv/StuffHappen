import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import GameRuleCard from './gameRuleCard.jsx';
import GetStartedPopUp from './getStartedPopUp.jsx';

export default function LandingPage() {
  const [showPopUp, setPopUp] = useState(false);

  return (
    <Container className="py-5 text-center text-warning" style={{ position: 'relative' }}>
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <h1 className="display-6 fw-bold">
            Benvenuto in <span className="bg-warning text-dark px-3 py-1 rounded">Stuff Happens</span>
          </h1>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col md="auto">
          <Button
            variant="warning"
            className="fw-bold shadow"
            style={{ color: '#000' }}
            onClick={() => setPopUp(true)}
          >
            Prova la Demo
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card
            className="shadow-lg p-4"
            style={{
              backgroundColor: '#111',
              borderRadius: '1rem',
              color: '#FFD100'
            }}
          >
            <GameRuleCard section="rules" />
          </Card>
        </Col>
      </Row>

      <Modal
        show={showPopUp}
        onHide={() => setPopUp(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="p-0">
          <GetStartedPopUp onCancel={() => setPopUp(false)} demo={true} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

