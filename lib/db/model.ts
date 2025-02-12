import mongoose from 'mongoose';

import { timestamp } from './plugins';

const faucetRequestRecordSchema = new mongoose.Schema({
  discord_id: {
    type: String,
    require: true,
    unique: true,
  },
  discord_username: String,
  last_request_time: String, // ISO string
  request_wallet: [ String ],
});

const faucetRequestRecordMocaSchema = new mongoose.Schema({
  wallet_address: {
    type: String,
    require: true,
    unique: true,
  },
  last_request_time: String, // ISO string
});

faucetRequestRecordSchema.plugin(timestamp);
faucetRequestRecordMocaSchema.plugin(timestamp);

export const FaucetRequestRecord = mongoose.models.faucet_request_record || mongoose.model('faucet_request_record', faucetRequestRecordSchema);
// eslint-disable-next-line max-len
export const FaucetRequestRecordMoca = mongoose.models.faucet_request_record_moca || mongoose.model('faucet_request_record_moca', faucetRequestRecordMocaSchema);
