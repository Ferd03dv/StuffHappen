import { useState } from "react";
import { Card, Button, Row, Col, Pagination, Table } from "react-bootstrap";

const PAGE_SIZE = 3;

export default function StatisticCard({ stats }) {
  const [page, setPage] = useState(1);

  if (!Array.isArray(stats) || stats.length === 0) {
    return <p>Non hai ancora giocato nessuna partita.</p>;
  }

  const grouped = stats.reduce((acc, item) => {
    const id = item.idPartita;
    if (!acc[id]) {
      acc[id] = {
        id,
        date: item.date,
        risultato: item.risultato,
        carte_vinte: item.carte_vinte,
        iniziali: [],
        rounds: [],
      };
    }

    const carta = {
      id: item.idCarta,
      nome: item.nome,
      immagine: item.immagine,
      round: item.numeroRound,
      vinta: item.vinta,
    };

    if (item.isIniziali) {
      acc[id].iniziali.push(carta);
    } else {
      acc[id].rounds.push(carta);
    }

    return acc;
  }, {});

  const partite = Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(partite.length / PAGE_SIZE);
  const paginated = partite.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <Row xs={1} md={1} className="g-4">
        {paginated.map((partita) => (
          <Col key={partita.id}>
            <Card bg="dark" text="light" className="border-warning">
              <Card.Header className="fw-bold">
                Partita #{partita.id} – {new Date(partita.date).toLocaleDateString()}
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="mb-0">
                    <strong>Esito:</strong>{' '}
                    <span className={partita.risultato === 'Vittoria' ? 'text-success' : 'text-danger'}>
                      {partita.risultato}
                    </span>
                  </p>
                  <p className="mb-0"><strong>Carte vinte:</strong> {partita.carte_vinte}</p>
                </div>


                <div className="mb-3">
                  <h6>Carte iniziali</h6>
                  <Table striped bordered hover variant="dark" size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partita.iniziali.map((carta, index) => (
                        <tr key={carta.id}>
                          <td>{index + 1}</td>
                          <td>{carta.nome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div>
                  <h6>Round giocati</h6>
                  {partita.rounds.length === 0 ? (
                    <p>Nessun round giocato.</p>
                  ) : (
                    <Table striped bordered hover variant="dark" size="sm">
                      <thead>
                        <tr>
                          <th>Round</th>
                          <th>Nome Carta</th>
                          <th>Esito</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partita.rounds.map((carta) => (
                          <tr key={carta.id}>
                            <td>{carta.round}</td>
                            <td>{carta.nome}</td>
                            <td className={carta.vinta ? "text-success" : "text-danger"}>
                              {carta.vinta ? "Vinta" : "Persa"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item key={i} active={i + 1 === page} onClick={() => setPage(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
}
