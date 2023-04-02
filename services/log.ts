
const debug = process.env.IS_DEV;

export const log = (...args: any) => {
  if (debug) {
    console.log(...args);
  }
}