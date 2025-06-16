import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function GetStartedPopUp({ onCancel, demo }) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/match', { state: { demo } });
  };

  return (
    <div
      className="text-center p-4 rounded shadow"
      style={{ backgroundColor: '#111', color: '#FFD100' }}
    >
      <p className="fs-5 fw-semibold mb-4">
        {demo
          ? 'Stai per iniziare una partita demo. Continuare?'
          : 'Stai per iniziare una nuova partita. Continuare?'}
      </p>

      <div className="d-flex justify-content-center gap-3">
        <Button
          variant="outline-light"
          onClick={onCancel}
        >
          Annulla
        </Button>

        <Button
          variant="warning"
          style={{ color: '#000', fontWeight: 'bold' }}
          onClick={handleConfirm}
        >
          Iniziamo!
        </Button>
      </div>
    </div>
  );
}


