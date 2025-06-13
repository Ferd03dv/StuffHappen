export default function StatisticCard({ stats }) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return <p>Non hai ancora giocato nessuna partita.</p>;
  }

  const grouped = stats.reduce((acc, item) => {
    if (!acc[item.idPartita]) {
      acc[item.idPartita] = {
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
      acc[item.idPartita].iniziali.push(carta);
    } else {
      acc[item.idPartita].rounds.push(carta);
    }

    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([id, partita]) => (
        <div key={id} className="mb-4 p-3 border rounded bg-dark text-light">
          <h5>Partita #{id}</h5>
          <p><strong>Data:</strong> {new Date(partita.date).toLocaleString()}</p>
          <p><strong>Esito:</strong> {partita.risultato} — <strong>Carte vinte:</strong> {partita.carte_vinte}</p>

          <div>
            <h6>Carte iniziali:</h6>
            <ul>
              {partita.iniziali.map((carta) => (
                <li key={carta.id}>
                  {carta.nome}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6>Round giocati:</h6>
            {partita.rounds.length === 0 ? (
              <p>Nessun round giocato.</p>
            ) : (
              <ul>
                {partita.rounds.map((carta) => (
                  <li key={carta.id}>
                    Round {carta.round}: {carta.nome} — {carta.vinta ? 'Vinta' : 'Persa'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
