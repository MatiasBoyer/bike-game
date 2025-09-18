"use client";
import { Layer, Stage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import { global_socket } from "@/sockets/index.socket";
import Player from "@/components/game/player";
import { IPlayer } from "@/types/player.type";
import { IScene } from "@/types/scene.type";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      password: formData.get("i-roompw"),
    };

    global_socket.emit("room:create", data, (cb: any) => {
      console.log(cb);
      if (cb.success) {
        alert(`Room ID: ${cb?.data?.id}\nRoom PW: ${cb?.data?.password}`);
        router.push("/game");
      } else {
        alert(
          `${
            cb.err
              ? cb.err.map((e: any) => e.message).join("\n")
              : "unexpected error"
          }`
        );
      }
    });
  };

  return (
    <form
      className="flex flex-col justify-center items-center w-full max-w-md"
      onSubmit={handle_submit}
    >
      <div className="flex flex-row w-full items-center justify-center m-3">
        host
      </div>
      <div className="flex flex-row w-full">
        <label htmlFor="i-roompw" className="m-2 w-32">
          room password
        </label>
        <input
          id="i-roompw"
          name="i-roompw"
          className="flex-1 m-2 border rounded px-2"
          placeholder="topsecretpw"
          required={true}
          minLength={3}
        />
      </div>
      <button
        className="w-full m-2 bg-gray-700 hover:bg-gray-900 text-white py-2 rounded"
        type="submit"
      >
        host
      </button>
    </form>
  );
}
