import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GetStartedPopUp from './getStartedPopUp.jsx';
import Card from './card.jsx'; 
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { AuthContext } from "../context/authContext.jsx";

export default function CardSummary() {
  const [showPopUp, setPopUp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cards = location.state?.cards ?? [];
  const { user } = useContext(AuthContext);
  

  if (!cards || cards.length === 0) {
    return (
      <Container className="text-center mt-5 text-light">
        <Alert variant="warning">Nessuna carta da mostrare.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-light">
      <Row className="mb-4 justify-content-center">
        <Col xs="auto" className="mb-2">
          <Button 
            variant="warning"
            className="fw-bold shadow"
            style={{ color: '#000' }} 
            onClick={() => setPopUp(true)}>Nuova Partita</Button>
        </Col>
        <Col xs="auto" className="mb-2">
          <Button 
            variant="warning"
            className="fw-bold shadow"
            style={{ color: '#000' }} 
            onClick={() => navigate(`/home/${user.id}`)}>Torna alla Home</Button>
        </Col>
      </Row>

      {showPopUp && <GetStartedPopUp onCancel={() => setPopUp(false)} demo={false} />}

      <Row className="justify-content-center">
        {[...cards]
          .sort((a, b) => a.indice_sfortuna - b.indice_sfortuna) 
          .map(card => (
            <Col key={card.id} xs="auto" className="mb-4 d-flex justify-content-center">
              <Card card={card} showIndice={true} />
            </Col>
          ))}
      </Row>

    </Container>
  );
}

