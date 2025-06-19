import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useContext } from "react";
import { Container, Button, ToggleButton, ButtonGroup, Card, Modal } from "react-bootstrap";
import GameRuleCard from "./gameRuleCard.jsx";
import GetStartedPopUp from "./getStartedPopUp.jsx";
import API from '../API/API.mjs';
import {AuthContext} from "../context/authContext.jsx";

export default function Home() {
  const [section, setSection] = useState("rules");
  const [stats, setStats] = useState(null);
  const [showPopUp, setPopUp] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {user, setUser} = useContext(AuthContext)
  const [message, setMessage] = useState('');

  const loadStats = async () => {
    try {
      const statistic = await API.getStatistic(user.id);
      setStats(statistic);
      setCurrentPage(1); 
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  return (
    <Container className="py-5 text-center text-warning" style={{ position: "relative" }}>
      <h2 className="fw-bold mb-4">Benvenuto, {user?.username || "🙂"}!</h2>

      <div className="mb-4">
        <Button
          variant="warning"
          className="fw-bold"
          style={{ color: "#000" }}
          onClick={() => setPopUp(true)}
        >
          Nuova Partita
        </Button>
      </div>

      <ButtonGroup className="mb-4">
        <ToggleButton
          type="radio"
          variant={section === "rules" ? "warning" : "outline-light"}
          checked={section === "rules"}
          style={{ fontWeight: section === "rules" ? "bold" : "normal" }}
          onClick={() => setSection("rules")}
        >
          Regolamento
        </ToggleButton>
        <ToggleButton
          type="radio"
          variant={section === "stats" ? "warning" : "outline-light"}
          style={{ fontWeight: section === "stats" ? "bold" : "normal" }}
          checked={section === "stats"}
          onClick={async () => {
            await loadStats();
            setSection("stats");
          }}
        >
          Le Statistiche
        </ToggleButton>
      </ButtonGroup>

      <div className="d-flex justify-content-center">
        <Card
          className="shadow-lg p-4"
          style={{
            backgroundColor: "#111",
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "800px",
            color: "#FFD100",
          }}
        >
          <GameRuleCard section={section} stats={stats} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </Card>
      </div>

      <Modal
        show={showPopUp}
        onHide={() => setPopUp(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="p-0">
          <GetStartedPopUp onCancel={() => setPopUp(false)} demo={false} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}


