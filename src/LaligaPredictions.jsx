import { useEffect, useState } from "react";

export default function LaligaPredictions() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("https://laliga-api.onrender.com/predicciones")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error("Error cargando predicciones:", err));
  }, []);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="px-8 py-14 max-w-screen-xl mx-auto text-2xl">
      <h1 className="text-6xl font-extrabold mb-14 text-center text-blue-900">🔮 Predicciones de LaLiga</h1>
      <div className="max-h-[80vh] overflow-y-auto space-y-14">
        {matches.length === 0 ? (
          <p className="text-center text-gray-500 text-3xl">Cargando predicciones...</p>
        ) : (
          matches.map((match, idx) => {
            const totalScore = match.scoreHome + match.scoreAway;
            const homePercent = (match.scoreHome / totalScore) * 100;
            const awayPercent = (match.scoreAway / totalScore) * 100;
            const drawPercent = 100 - homePercent - awayPercent;

            const confiable = match.confidence >= 25;
            const empateProbable = match.drawProbability >= 80;

            return (
              <div key={idx} className="border-4 border-blue-300 rounded-3xl shadow-2xl p-12 bg-white">
                <div className="mb-6">
                  <p className="text-5xl text-blue-800 font-bold text-center underline decoration-wavy decoration-blue-400">
                    {formatDate(match.date)}
                  </p>
                </div>
                <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
                  {match.home} <span className="text-gray-400 font-light">vs</span> {match.away}
                </h2>
                <div className="grid grid-cols-2 gap-10 text-3xl text-center">
                  <p className="text-gray-700">⚽ Score {match.home}: <strong>{match.scoreHome.toFixed(2)}</strong></p>
                  <p className="text-gray-700">⚽ Score {match.away}: <strong>{match.scoreAway.toFixed(2)}</strong></p>
                </div>
                <p className="mt-10 text-4xl font-bold text-green-700 text-center">
                  🏆 Predicción: <span className="font-extrabold">{match.prediction}</span>
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-2xl font-semibold">
                    <span className="text-blue-800">{match.home} ({homePercent.toFixed(1)}%)</span>
                    <span> /// </span>
                    <span className="text-red-800">{match.away} ({awayPercent.toFixed(1)}%)</span>
                  </div>
                  <div className="text-center text-2xl text-orange-600 mt-4 font-semibold">
                    🟠 Probabilidad de empate: <strong>{match.drawProbability?.toFixed(1)}%</strong>
                    {empateProbable && (
                      <div className="text-3xl text-orange-800 font-bold mt-2">⚠️ Empate muy probable</div>
                    )}
                  </div>
                  <div className="w-full h-8 bg-gray-300 rounded-full flex overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${homePercent}%` }}></div>
                    <div className="bg-orange-400 h-full" style={{ width: `${drawPercent}%` }}></div>
                    <div className="bg-red-600 h-full" style={{ width: `${awayPercent}%` }}></div>
                  </div>
                </div>

                <p className="text-2xl text-gray-600 mt-8 text-center">
                  Confianza estimada: <strong>{match.confidence.toFixed(1)}%</strong> — {confiable ? (
                    <span className="text-green-600 font-bold">Entrada confiable</span>
                  ) : (
                    <span className="text-yellow-600 font-bold">Entrada dudosa</span>
                  )}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}