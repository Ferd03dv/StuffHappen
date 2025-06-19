import { useState } from 'react';
import StatisticCard from './statisticCard.jsx';

const PAGE_SIZE = 3;

export default function GameRuleCard({ section, stats, currentPage, setCurrentPage }) {
  const totalPages = Math.ceil((stats?.length || 0) / PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-3 border rounded" style={{ backgroundColor: '#111', minHeight: '150px' }}>
      {section === 'rules' && (
        <div>
          <h5>Regole del gioco</h5>
          <p>
            In <strong>Stuff Happens</strong>, il tuo compito è semplice (ma crudele): ordinare eventi disastrosi in base al loro <strong>Indice di Sfiga</strong> da 1 a 100.<br /><br />
            Ogni carta rappresenta una disavventura con tematica sui trasporti quando si è studente fuorisede (es: "perdi il bus", "ti chiudi dentro le porte della metro", "ti dimentichi il laptop sul treno") con un valore assegnato da esperti del dolore, della psicologia... e un po’ di umorismo nero.
          </p>
          <ul className="text-start">
            <li>Inizia con 3 carte ordinate per valore.</li>
            <li>A turno, pescherai una nuova carta.</li>
            <li>Dovrai indovinare l'indice di sfortuna della carta.</li>
            <li>Se indovini correttamente, guadagni la carta.</li>
            <li>Se sbagli perdi la carta.</li>
          </ul>
          <p>
            Vince se collezioni <strong>3 carte corrette</strong> e perdi se sbagli 3 round anche non consecutivi<br />
            <em>Buona sfortuna!</em>
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
              <StatisticCard stats={stats} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

