"use client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  function onHostClick()
  {
    router.push('/host')
  }

  function onJoinClick()
  {
    router.push('/join')
  }

  return (
    <div className="flex flex-col gap-5 w-50">
      <button className="bg-gray-500 hover:bg-gray-800 p-5" onClick={onHostClick}>HOST</button>
      <button className="bg-gray-500 hover:bg-gray-800 p-5" onClick={onJoinClick}>JOIN</button>
    </div>
  );
}
