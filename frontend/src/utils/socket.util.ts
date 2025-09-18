import { global_socket } from "../sockets/index.socket";

function emit(ev: string, payload: any) {
  return new Promise((resolve, reject) => {
    try {
      global_socket.emit(ev, payload, (data: any) => {
        resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export { emit };
