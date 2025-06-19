import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {AuthContext} from "../context/authContext.jsx";

export default function GetStartedPopUp({ onCancel, demo }) {
  const navigate = useNavigate();
  const {user, setUser} = useContext(AuthContext)

  const handleConfirm = () => {
    if(demo === false){
      navigate(`/match/${user.id}`, { state: { demo } });
    }else{
      navigate(`/match/0`, { state: { demo } });
    }
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
          variant="warning"
          className="fw-bold shadow"
          style={{ color: '#000' }}
          onClick={onCancel}
        >
          Annulla
        </Button>

        <Button
          variant="warning"
          className="fw-bold shadow"
          style={{ color: '#000' }}
          onClick={handleConfirm}
        >
          Iniziamo!
        </Button>
      </div>
    </div>
  );
}


