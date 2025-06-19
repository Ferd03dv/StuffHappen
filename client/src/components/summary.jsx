import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GetStartedPopUp from './getStartedPopUp.jsx';
import { Container, Row, Col, Card as BootstrapCard, Button, Alert } from 'react-bootstrap';

export default function CardSummary() {
  const [showPopUp, setPopUp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cards = location.state?.cards ?? [];

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
          <Button variant="warning" onClick={() => setPopUp(true)}>Nuova Partita</Button>
        </Col>
        <Col xs="auto" className="mb-2">
          <Button variant="outline-light" onClick={() => navigate(`/home/${1}`)}>Torna alla Home</Button>
        </Col>
      </Row>

      {showPopUp && <GetStartedPopUp onCancel={() => setPopUp(false)} demo={false} />}

      <Row>
        {cards.map(card => (
          <Col key={card.id} xs={12} sm={6} md={4} className="mb-4">
            <BootstrapCard bg="dark" text="warning" className="border border-warning shadow-sm h-100">
              <BootstrapCard.Img
                variant="top"
                src={card.immagine}
                alt={card.nome}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <BootstrapCard.Body>
                <BootstrapCard.Title className="text-center">{card.nome}</BootstrapCard.Title>
                <BootstrapCard.Text className="text-center">
                  Indice di sfortuna: <strong className="font-monospace">{card.indice_sfortuna}</strong>
                </BootstrapCard.Text>
              </BootstrapCard.Body>
            </BootstrapCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

