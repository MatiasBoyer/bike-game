"use client";
import { Layer, Stage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import { global_socket } from "@/sockets/index.socket";
import Player from "@/components/game/player";
import { IPlayer } from "@/types/player.type";

export default function Page() {
  const [connectionState, setConnectionState] = useState({ connected: false });
  const [players, setPlayers] = useState<IPlayer[]>([]);

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
    global_socket.emit("room:create", { password: "1234" }, (data: any) => {
      setConnectionState((prev) => ({
        ...prev,
        connected: true,
      }));
    });

    global_socket.on("game:update", (data: any) => {
      if (!data.players) return;
      setPlayers(data.players);
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

  return (
    <>
      <div
        style={{ fontSize: "14px", top: "0", width: "100%", display: "block" }}
      >
        <div style={{ background: "grey" }}>
          {JSON.stringify(connectionState)}
        </div>
        <div style={{ background: "grey" }}>{JSON.stringify(players)}</div>
      </div>
      <div className="flex justify-center items-center flex-col w-screen">
        <Stage width={500} height={500} style={{ background: "white" }}>
          {players.map((p) => (
            <Player points={p.points} stroke={p.stroke} key={"abcd"} />
          ))}
        </Stage>
      </div>
    </>
  );
}
