import crypto from "node:crypto";

export function createIPC() {
  async function sendToMaster<T>(type: string, payload: unknown): Promise<T> {
    if (!process.send) {
      throw new Error("IPC not available");
    }

    const requestId = crypto.randomUUID();

    const result = await new Promise<T>((resolve) => {
      const handler = (msg: { requestId: string; data: T }) => {
        if (msg.requestId !== requestId) return;

        process.off("message", handler);
        resolve(msg.data);
      };

      process.on("message", handler);
      process.send!({ type, payload, requestId });
    });

    return result;
  }

  return sendToMaster;
}
