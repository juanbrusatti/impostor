
import React from "react";

/**
 * Card (modo grid)
 * Se recomienda usar CardFullScreen para la experiencia de pantalla completa y swipe.
 */
export default function Card({ index, role, playerName, playerRole, playerRealName }) {
  return (
    <div
      className="w-28 h-44 sm:w-32 sm:h-48 rounded-xl shadow-lg bg-gradient-to-br from-[#4cafef] to-[#1e1e2f] flex flex-col items-center justify-center select-none"
      title="Carta"
    >
      <span className="text-xs text-white/70 mb-1">Jugador {index + 1}</span>
      <div className="w-full h-px bg-white/20 my-1"></div>
      <span className="text-lg font-bold text-white mb-2">{playerRealName || "Jugador"}</span>
      {role === "IMPOSTOR" ? (
        <span className="text-red-500 font-extrabold text-xl">IMPOSTOR</span>
      ) : (
        <span className="text-green-400 font-bold text-lg">{playerName || "INOCENTE"}</span>
      )}
    </div>
  );
}
