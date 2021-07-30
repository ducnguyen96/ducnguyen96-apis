import { Snowyflake, Epochs } from 'snowyflake';

export const snowflake = new Snowyflake({
  // workerId: 1n,
  epoch: Epochs.TWITTER, // BigInt timestamp
});
