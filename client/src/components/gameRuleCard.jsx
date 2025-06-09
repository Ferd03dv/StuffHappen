export default function GameRuleCard({section, isLoggedIn, stats}) {
  return (
    <div className="p-3 border rounded" style={{ backgroundColor: '#111', minHeight: '150px' }}>
        {section === 'rules' && (
          <div>
            <h5>Regole del gioco</h5>
            <p>
              Posiziona correttamente gli eventi sulla scala della sfortuna. Vince chi ne indovina di più!
            </p>
          </div>
        )}

        {section === 'stats' && (
        <div>
            <h5>Statistiche</h5>
                {(!stats || stats.length === 0) ? (
                <p>Non hai ancora giocato nessuna partita.</p>
            ) : (
                <ul className="list-unstyled">
                {stats.map((stat, index) => (
                    <li key={index}>
                        Partita #{index + 1} - Punteggio: {stat.score}
                    </li>
                    ))}
                </ul>
            )}
            </div>
        )}
      </div>
  );
}
