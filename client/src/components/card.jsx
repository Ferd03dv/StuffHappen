import { Card as BootstrapCard } from 'react-bootstrap';

export default function Card({ card, showIndice = true }) {
  return (
    <BootstrapCard 
      bg="dark" 
      text="warning" 
      className="border border-warning shadow-sm h-100"
      style={{ width: '350px', height: '450px' }}
    >
      <div style={{ height: '80px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <BootstrapCard.Title 
          className="text-center mb-0" 
          style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.3', color: '#FFD100' }}
        >
          {card.nome}
        </BootstrapCard.Title>
      </div>
      
      <div style={{ height: '300px', overflow: 'hidden', margin: '0 12px', borderRadius: '6px' }}>
        <BootstrapCard.Img
          src={`http://localhost:3001/images/${card.immagine}`}
          alt={card.nome}
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        />
      </div>
      
      <div style={{ height: '40px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {showIndice && (
          <BootstrapCard.Text 
            className="text-center mb-0" 
            style={{ fontSize: '12px', color: 'white' }}
          >
            Indice: {card.indice_sfortuna.toFixed(1)}
          </BootstrapCard.Text>
        )}
      </div>
    </BootstrapCard>
  );
}


