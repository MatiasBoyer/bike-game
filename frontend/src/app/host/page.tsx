"use client";
import { global_socket } from "@/sockets/index.socket";
import { IResponse } from "@/types/ioresponse.type";
import { IRoomCreate } from "@/types/room.type";
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

    global_socket.emit("room:create", data, (cb: IResponse<IRoomCreate>) => {
      console.log(cb);
      if (cb.success) {
        alert(`Room ID: ${cb?.data?.id}\nRoom PW: ${cb?.data?.password}`);
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
