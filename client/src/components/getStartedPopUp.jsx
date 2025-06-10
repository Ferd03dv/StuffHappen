import { useNavigate } from 'react-router-dom';


export default function GetStartedPopUp({ onCancel, demo }) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/match', { state: { demo } });
  };

  return (
     <div className="p-3 border rounded" style={{ backgroundColor: '#111', minHeight: '150px' }}>
        <p className="mb-4 text-lg font-semibold">
          {demo
          ? 'Stai per iniziare una partita demo. Continuare?'
          : 'Stai per iniziare una nuova partita. Continuare?'}
        </p>
        <div className="flex justify-around">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-white text-[#FFD100] hover:bg-white hover:text-black transition"
          >
            Annulla
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded border border-white text-[#FFD100] hover:bg-[#FFD100] hover:text-black font-bold transition"
          >
            Iniziamo!
          </button>
        </div>
     </div>
  );
}

