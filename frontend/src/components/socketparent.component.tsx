"use client";
import { useState, useEffect } from "react";
import { global_socket } from "@/sockets/index.socket";
import { useRouter } from "next/navigation";
import Image from "next/image";
import spinner from "../assets/spinner-svgrepo-com.svg";

export default function SocketParent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connected, setConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected!");
      setConnected(true);
    };
    const handleError = (err: Error) => {
      console.info("Failure");
      alert(err.message);
      router.push("/");
    };

    global_socket.on("connect", handleConnect);
    global_socket.on("connect_error", handleError);

    return () => {
      global_socket.off("connect", handleConnect);
      global_socket.off("connect_error", handleError);
    };
  }, [router]);

  if (!connected)
    return (
      <div className="flex flex-col justify-center items-center">
        <div>
          <Image
            src={spinner}
            alt="spinner"
            height={50}
            width={50}
            className="animate-spin filter invert"
          />
        </div>
        <div>Connecting to server...</div>
      </div>
    );

  return <>{children}</>;
}
