import { global_socket } from "../sockets/index.socket";

function emit(ev: string, payload: unknown) {
  return new Promise((resolve, reject) => {
    try {
      global_socket.emit(ev, payload, (data: unknown) => {
        resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export { emit };
