"use client";
import { Layer, Stage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import { global_socket } from "@/sockets/index.socket";
import Player from "@/components/game/player";
import { IPlayer } from "@/types/player.type";
import { IScene } from "@/types/scene.type";
import { IGameState } from "@/types/gamestate.type";

function AskForReadyness({ onReady }: { onReady: () => void }) {
  return (
    <div className="flex justify-center items-center flex-col w-screen">
      <button className="bg-gray-500 hover:bg-gray-700 p-2" onClick={onReady}>
        READY
      </button>
    </div>
  );
}

function GameScene({
  sceneInfo,
  players,
}: {
  sceneInfo: IScene | null;
  players: IPlayer[];
}) {
  return (
    <div className="flex justify-center items-center flex-col w-screen">
      {sceneInfo && (
        <Stage
          width={sceneInfo.scene_width}
          height={sceneInfo.scene_height}
          style={{ background: "white" }}
        >
          {players.map((p) => (
            <Player
              points={p.points}
              stroke={p.stroke}
              isAlive={p.state === 2}
              width={sceneInfo.lineWidth}
              key={p.id}
            />
          ))}
        </Stage>
      )}
      {!sceneInfo && <>Not loaded</>}
    </div>
  );
}

export default function Page() {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [localIsReady, setReadyness] = useState<boolean>(false);
  const [gameState, setGameState] = useState<IGameState | null>(null);
  const [sceneInfo, setSceneInfo] = useState<IScene | null>(null);

  const keydown = (ev: any) => {
    const dir: [number, number] = [0, 0];
    switch (ev.key) {
      case "ArrowUp":
      case "w":
      case "W":
        dir[0] = 0;
        dir[1] = -1;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        dir[0] = 0;
        dir[1] = 1;
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        dir[0] = -1;
        dir[1] = 0;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        dir[0] = 1;
        dir[1] = 0;
        break;
      default:
        return;
    }

    global_socket.emit(
      "player:update_direction",
      { x: dir[0], y: dir[1] },
      (cb: any) => {
        //console.info(cb);
      }
    );
  };

  const onConnected = () => {
    // DEBUG OPTION!!!!!!!
    /*global_socket.emit("room:create", { password: "1234" }, (data: any) => {
      setConnectionState((prev) => ({
        ...prev,
        connected: true,
      }));
    });*/
    // DEBUG OPTION!!!!!!!

    const raw = sessionStorage.getItem("sceneInfo");
    if (raw) setSceneInfo(JSON.parse(raw));

    global_socket.on("game:init", (data: any) => {
      setSceneInfo(data.scene);
    });

    global_socket.on("game:update", (data: any) => {
      setGameState((prev) => {
        console.log(prev);
        if (data.scene) setSceneInfo(data.scene);
        if (data.players) setPlayers(data.players);
        if (data.state === 3) setReadyness(false);
        return data;
      });
    });

    window.addEventListener("keydown", keydown, true);
  };

  const onDisconnected = () => {
    window.removeEventListener("keydown", keydown);
  };

  useEffect(() => {
    onConnected();
    return () => onDisconnected();
  }, []);

  const onReady = () => {
    console.log("readyness sent");
    global_socket.emit("player:set_readyness", (data: any) => {
      console.log("cb:", data);
      if (data.success) setReadyness(true);
    });
  };

  return (
    <>
      {/** If gameState exists */}
      {gameState && (
        <>
          {/** Waiting for player to say that its ready */}
          {gameState.state === 0 && !localIsReady && (
            <AskForReadyness onReady={onReady} />
          )}

          {/** Game scene */}
          {[1, 2, 3].includes(gameState.state) && (
            <GameScene sceneInfo={sceneInfo} players={players} />
          )}
        </>
      )}
      {/** If NO gameState exists */}
      {!gameState && <>critical error</>}
    </>
  );
}
