import crypto from "node:crypto";

export function createIPC() {
  function sendToMaster<T>(type: string, payload: unknown): Promise<T> {
    return new Promise((resolve) => {
      const requestId = crypto.randomUUID();

      function onMessage(msg: { requestId: string; data: T }) {
        if (msg.requestId === requestId) {
          process.off("message", onMessage);
          resolve(msg.data);
        }
      }

      process.on("message", onMessage);
      process.send!({ type, payload, requestId });
    });
  }

  return { sendToMaster };
}
