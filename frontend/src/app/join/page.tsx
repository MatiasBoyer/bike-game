"use client";
import { global_socket } from "@/sockets/index.socket";
import { IResponse } from "@/types/ioresponse.type";
import { IRoomJoin } from "@/types/room.type";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      id: formData.get("i-roomid"),
      password: formData.get("i-roompw"),
    };

    global_socket.emit("room:join", data, (cb: IResponse<IRoomJoin>) => {
      console.log(cb);
      if (cb.success) {
        sessionStorage.setItem(
          "sceneInfo",
          JSON.stringify(cb?.data?.sceneInfo)
        );
        router.push("/game");
      } else {
        alert(`${cb.err ? cb.err.join("\n") : "unexpected error"}`);
      }
    });
  };

  return (
    <form
      className="flex flex-col justify-center items-center w-full max-w-md"
      onSubmit={handle_submit}
    >
      <div className="flex flex-row w-full">
        <label htmlFor="i-roomid" className="m-2 w-32">
          room id
        </label>
        <input
          id="i-roomid"
          name="i-roomid"
          className="flex-1 m-2 border rounded px-2"
          placeholder="123ASD"
          required={true}
          minLength={6}
        />
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
        join
      </button>
    </form>
  );
}
