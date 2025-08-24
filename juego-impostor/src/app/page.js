"use client";

import { useState } from "react";

export default function Home() {
  const [playersInput, setPlayersInput] = useState("");
  const [roles, setRoles] = useState([]); // arreglo de 5: 4 jugador + 1 IMPOSTOR

  function startGame() {
    const list = playersInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (list.length === 0) {
      alert("Ingresá al menos un futbolista (uno por línea).");
      return;
    }

    const chosen = list[Math.floor(Math.random() * list.length)];
    const roles5 = shuffle([...Array(4).fill(chosen), "IMPOSTOR"]);
    setRoles(roles5);
  }

  function resetGame() {
    setRoles([]);
  }

  return (
    <main className="min-h-screen bg-[#1e1e2f] text-white flex flex-col items-center p-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Juego del Impostor ⚽</h1>
      <p className="opacity-80 mb-2 text-center">
        Escribí <b>futbolistas</b> (uno por línea). El juego elegirá uno al azar,
        creará <b>5 cartas</b> (4 iguales y 1 <b>IMPOSTOR</b>) y podrás
        darlas vuelta tocándolas.
      </p>

      {/* Configuración */}
      {roles.length === 0 && (
        <div className="w-full max-w-lg mt-4">
          <textarea
            className="w-full h-36 p-3 rounded-lg bg-[#111528] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4cafef]"
            placeholder={`Ej:\nMessi\nCristiano Ronaldo\nMbappé\nNeymar\nMaradona`}
            value={playersInput}
            onChange={(e) => setPlayersInput(e.target.value)}
          />
          <button
            onClick={startGame}
            className="mt-4 w-full bg-[#4cafef] hover:bg-[#3196e8] px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Comenzar
          </button>
        </div>
      )}

      {/* Cartas */}
      {roles.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {roles.map((role, i) => (
              <Card key={`${role}-${i}`} role={role} />
            ))}
          </div>

          <button
            onClick={resetGame}
            className="mt-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
          >
            Reiniciar ronda
          </button>
        </>
      )}
    </main>
  );
}

/* ---- Helpers ---- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---- Componente Carta ---- */
function Card({ role }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-28 h-44 sm:w-32 sm:h-48 perspective cursor-pointer select-none"
      onClick={() => setFlipped((f) => !f)}
      title="Tocar para dar vuelta"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Dorso */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-[#4cafef] flex items-center justify-center text-4xl font-bold">
          ?
        </div>

        {/* Frente */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-white text-black font-bold p-3 flex items-center justify-center text-center">
          {role === "IMPOSTOR" ? (
            <span className="text-red-600">IMPOSTOR</span>
          ) : (
            role
          )}
        </div>
      </div>
    </div>
  );
}
