import { useState } from 'react';
import StatisticCard from './statisticCard.jsx';

const PAGE_SIZE = 3;

export default function GameRuleCard({ section, isLoggedIn, stats }) {
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

