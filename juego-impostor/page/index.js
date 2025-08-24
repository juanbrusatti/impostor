import { useState } from "react";

export default function Home() {
  const [playersInput, setPlayersInput] = useState("");
  const [roles, setRoles] = useState([]);

  const startGame = () => {
    const players = playersInput
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p);
    if (players.length === 0) {
      alert("Por favor ingresa al menos un jugador.");
      return;
    }

    const chosenPlayer = players[Math.floor(Math.random() * players.length)];
    const newRoles = [chosenPlayer, chosenPlayer, chosenPlayer, chosenPlayer, "IMPOSTOR"];
    setRoles(shuffleArray(newRoles));
  };

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Juego del Impostor ⚽</h1>
      <p className="mb-2">Escribe una lista de jugadores (uno por línea):</p>
      <textarea
        className="w-80 h-32 p-2 rounded-lg text-black mb-4"
        value={playersInput}
        onChange={(e) => setPlayersInput(e.target.value)}
        placeholder="Ej: Messi&#10;Ronaldo&#10;Mbappé..."
      />
      <button
        className="px-6 py-2 bg-[#4cafef] text-white rounded-lg mb-6"
        onClick={startGame}
      >
        Comenzar
      </button>

      <div className="flex flex-wrap justify-center gap-4">
        {roles.map((role, idx) => (
          <Card key={idx} role={role} />
        ))}
      </div>
    </div>
  );
}

function Card({ role }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`w-28 h-44 perspective cursor-pointer`}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full text-center transition-transform duration-500 transform ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-[#4cafef] text-white text-3xl rounded-lg">
          ?
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-white text-black font-bold rounded-lg p-2">
          {role}
        </div>
      </div>
    </div>
  );
}
