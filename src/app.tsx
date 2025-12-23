import React, { useEffect } from "react";
import { useGameStore } from "./store/game-store";
import { usePlayerStore } from "./store/player-store";
import { useConnectionStore } from "./store/connection-store";
import { generateCourse } from "./services/game/course-generator";
import { GameLobby } from "./components/layout/game-lobby";
import { Header } from "./components/layout/header";
import { GameCanvas } from "./components/game/game-canvas";
import { PowerMeter } from "./components/game/power-meter";
import { ObstaclePlacer } from "./components/game/obstacle-placer";
import { Button } from "./components/ui/button";
import { RoomCodeDisplay } from "./components/ui/room-code-display";
import { useGameState } from "./hooks/use-game-state";
import { createGameMessage } from "./services/webrtc/message-handler";

function App() {
  const { currentPlayer } = usePlayerStore();
  const { isConnected, roomCode } = useConnectionStore();
  const {
    gameStatus,
    currentHole,
    totalHoles,
    course,
    currentPlayerId,
    players,
    addPlayerObstacle,
    setGameStatus,
    setCurrentHole,
    setCourse,
  } = useGameStore();

  // Initialize course when game starts
  useEffect(() => {
    if (gameStatus === "playing" && !course) {
      const newCourse = generateCourse();
      setCourse(newCourse);
    }
  }, [gameStatus, course, setCourse]);

  const handleStartGame = () => {
    if (!currentPlayer) return;

    const newCourse = generateCourse();
    setCourse(newCourse);
    setGameStatus("playing");

    // Add current player if not already added
    if (!players.find((p: any) => p.id === currentPlayer.id)) {
      useGameStore.getState().addPlayer(currentPlayer);
    }
  };

  const handleBallStop = () => {
    // Ball has stopped moving
    console.log("Ball stopped");
  };

  const handleHoleComplete = () => {
    if (!currentPlayer) return;

    // Mark hole as complete
    if (currentHole < totalHoles) {
      setCurrentHole(currentHole + 1);
    } else {
      setGameStatus("finished");
    }
  };

  const handleObstaclePlaced = (obstacle: any) => {
    addPlayerObstacle(obstacle);

    // Broadcast obstacle placement
    if (currentPlayer && isConnected) {
      createGameMessage("obstacle-placed", obstacle, currentPlayer.id);
      // Broadcast via WebRTC (would need to access peer manager)
    }
  };

  if (!currentPlayer || !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <GameLobby />
      </div>
    );
  }

  if (gameStatus === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-gray-600 mb-6">
              Room: {roomCode} • {players.length} player
              {players.length !== 1 ? "s" : ""}
            </p>
            <RoomCodeDisplay roomCode={roomCode || ""} />
            <Button onClick={handleStartGame} size="lg" className="mt-6">
              Start Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === "finished") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
            <p className="text-gray-600 mb-6">Thanks for playing GhostPutt!</p>
            <Button onClick={() => setGameStatus("lobby")}>
              Back to Lobby
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentHoleData = course?.holes.find(
    (h: any) => h.number === currentHole
  );
  const isMyTurn = currentPlayerId === currentPlayer.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GameCanvas
              onBallStop={handleBallStop}
              onHoleComplete={handleHoleComplete}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-3">Players</h3>
              <div className="space-y-2">
                {players.map((player: any) => (
                  <div
                    key={player.id}
                    className={`p-2 rounded ${
                      player.id === currentPlayerId
                        ? "bg-primary-100"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{player.name}</span>
                      {player.id === currentPlayerId && (
                        <span className="text-xs text-primary-600">
                          Your Turn
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isMyTurn && (
              <>
                <PowerMeter
                  onPowerSelected={(power) => {
                    // Handle shot with power
                    console.log("Shot with power:", power);
                  }}
                  isActive={isMyTurn}
                />
                <ObstaclePlacer onObstaclePlaced={handleObstaclePlaced} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
