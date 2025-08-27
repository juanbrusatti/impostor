import React, { useState } from "react";

export default function Card({ index, role, playerName, playerRole, playerRealName, onFlip }) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    const newFlipped = !flipped;
    setFlipped(newFlipped);
    if (newFlipped && onFlip) {
      onFlip(index);
    }
  };

  return (
    <div
      className="w-28 h-44 sm:w-32 sm:h-48 perspective cursor-pointer select-none"
      onClick={handleClick}
      title="Tocar para dar vuelta"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Back of card - Show player's real name */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-[#4cafef] flex items-center justify-center p-2">
          <span className="text-white font-bold text-center break-words text-lg">
            {playerRealName || '?'}
          </span>
        </div>

        {/* Front of card - Show role/football player */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-white text-black font-bold p-3 flex flex-col items-center justify-center text-center">
          <span className="text-sm text-gray-600 mb-1">
            {playerRealName || 'Jugador'}
          </span>
          <div className="w-full h-px bg-gray-200 my-1"></div>
          <span className="text-lg font-bold">
            {role === "IMPOSTOR" ? (
              <span className="text-red-600">IMPOSTOR</span>
            ) : (
              <span className="text-green-600">{playerName || "INOCENTE"}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
