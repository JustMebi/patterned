export const notImplemented = <T>(message: string): T => {
  throw new Error(message);
};
