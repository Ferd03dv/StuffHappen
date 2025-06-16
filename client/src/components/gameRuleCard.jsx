import { useState } from 'react';
import StatisticCard from './statisticCard.jsx';

const PAGE_SIZE = 3;

export default function GameRuleCard({ section, stats }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((stats?.length || 0) / PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedStats = stats?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) || [];

  return (
    <div className="p-3 border rounded" style={{ backgroundColor: '#111', minHeight: '150px' }}>
      {section === 'rules' && (
        <div>
          <h5>Regole del gioco</h5>
          <p>
            In <strong>Stuff Happens</strong>, il tuo compito è semplice (ma crudele): ordinare eventi disastrosi in base al loro <strong>Indice di Sfiga</strong> da 1 a 100.<br /><br />
            Ogni carta rappresenta una disavventura (es: "perdi il lavoro", "ti chiudono in ascensore con un clown", "ti si rompe il telefono nel WC") con un valore assegnato da esperti del dolore, della psicologia... e un po’ di umorismo nero.
          </p>
          <ul className="text-start">
            <li>Ogni giocatore inizia con 3 carte ordinate per valore.</li>
            <li>A turno, un giocatore pesca una nuova carta e legge solo l'evento (non il numero!).</li>
            <li>Gli altri devono indovinare dove si posiziona nella linea temporale della sfortuna.</li>
            <li>Se indovinano correttamente, guadagnano la carta.</li>
            <li>Se sbagliano, la carta torna in fondo al mazzo.</li>
          </ul>
          <p>
            Vince chi colleziona per primo <strong>3 carte corrette</strong> (o un numero stabilito all’inizio).<br />
            <em>Preparati a scoprire cosa è peggio tra “una multa da 500€” o “camminare su un Lego nudo”!</em>
          </p>
        </div>
      )}

      {section === 'stats' && (
        <div>
          <h5>Statistiche</h5>
          {(!stats || stats.length === 0) ? (
            <p>Non hai ancora giocato nessuna partita.</p>
          ) : (
            <>
              <StatisticCard stats={paginatedStats} />

              <div className="mt-3 d-flex flex-wrap gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`btn btn-sm ${currentPage === idx + 1 ? 'btn-warning' : 'btn-outline-light'}`}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

