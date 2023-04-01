
const debug = true;

export const log = (...args: any) => {
  if (debug) {
    console.log(...args);
  }
}