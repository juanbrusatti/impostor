import React, { useState } from "react";

export default function VotingScreen({ players, impostorName, onFinish, onRestart }) {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [votes, setVotes] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const result = React.useMemo(() => {
    if (!showResult) return {
      voteCounts: {},
      maxVotes: 0,
      mostVotedIndexes: [],
      mostVotedName: "",
      impostorDiscovered: false
    };
    const voteCounts = votes.reduce((acc, idx) => {
      acc[idx] = (acc[idx] || 0) + 1;
      return acc;
    }, {});
    const maxVotes = Math.max(...Object.values(voteCounts), 0);
    const mostVotedIndexes = Object.keys(voteCounts).filter(idx => voteCounts[idx] === maxVotes);
    const mostVotedName = mostVotedIndexes.length > 0 ? players[parseInt(mostVotedIndexes[0])] : "";
    const impostorDiscovered = mostVotedName === impostorName && maxVotes > 0;
    return { voteCounts, maxVotes, mostVotedIndexes, mostVotedName, impostorDiscovered };
  }, [showResult, votes, players, impostorName]);
  const { impostorDiscovered, maxVotes, mostVotedName } = result;

  const handleVote = (votedIndex) => {
    setVotes([...votes, votedIndex]);
    if (currentTurn + 1 < players.length) {
      setCurrentTurn(currentTurn + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1e2f] to-[#4cafef] text-white p-6">
      {!showResult ? (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Votación</h2>
          <p className="text-lg text-white/80 mb-4 text-center">
            Turno de <span className="font-bold text-[#4cafef]">{players[currentTurn]}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {players.map((name, idx) => (
              <button
                key={name}
                className="bg-white/10 hover:bg-[#4cafef] text-white font-semibold rounded-xl p-4 shadow-lg transition-all text-lg"
                onClick={() => handleVote(idx)}
                disabled={idx === currentTurn}
              >
                {name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-6 text-center">Tu voto es secreto</p>
        </div>
      ) : (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-8 relative">
          {/* Animación confetis o dedos */}
          {impostorDiscovered && (
            <div className="absolute inset-0 pointer-events-none z-10 flex">
              <div className="w-1/2 flex justify-start items-start">
                <span className="animate-confetti text-6xl">🎉</span>
              </div>
              <div className="w-1/2 flex justify-end items-start">
                <span className="animate-confetti text-6xl">🎉</span>
              </div>
            </div>
          )}
          {!impostorDiscovered && maxVotes > 0 && (
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
              <span className="animate-fingers text-6xl mb-2">👎👎👎</span>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2 text-center">Resultado</h2>
          <div className="bg-white/10 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <span className="text-lg text-white/80 mb-2">El verdadero impostor era:</span>
            <span className="text-3xl font-extrabold text-red-500 mb-4">{impostorName}</span>
            <span className="text-lg text-white/80 mt-2">El jugador más votado fue:</span>
            <span className="text-2xl font-bold text-[#4cafef] mb-2">{mostVotedName || "Nadie"}</span>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className="bg-[#4cafef] hover:bg-[#3196e8] px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
              onClick={onRestart}
            >
              Volver a jugar
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
              onClick={onFinish}
            >
              Terminar
            </button>
          </div>
          {/* Animaciones CSS */}
          <style jsx>{`
            .animate-confetti {
              animation: confetti 1.2s ease-in-out 0s 1;
            }
            @keyframes confetti {
              0% { transform: translateY(-100px) scale(0.5); opacity: 0; }
              50% { transform: translateY(40px) scale(1.2); opacity: 1; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            .animate-fingers {
              animation: fingers 1.2s ease-in-out 0s 1;
            }
            @keyframes fingers {
              0% { transform: translateY(-60px) scale(0.5); opacity: 0; }
              50% { transform: translateY(20px) scale(1.2); opacity: 1; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
