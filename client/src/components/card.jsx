export default function Card({ card, showIndice }) {
  return (
    <div className="border border-white rounded-xl p-4 m-2 bg-black text-center w-[150px]">
      <p className="font-bold text-[#FFD100]">{card.nome}</p>
      <img
        src={card.immagine}
        alt={card.nome}
        className="w-full h-[100px] object-cover rounded-md mb-2"
      />
      {showIndice && (
        <p className="text-sm text-white">
          Indice: {card.indice_sfortuna.toFixed(1)}
        </p>
      )}
    </div>
  );
}