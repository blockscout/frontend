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

faucetRequestRecordSchema.plugin(timestamp);

export const FaucetRequestRecord = mongoose.models.faucet_request_record || mongoose.model('faucet_request_record', faucetRequestRecordSchema);
