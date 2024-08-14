import mongoose from 'mongoose';

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

export const FaucetRequestRecord = mongoose.model('faucet_request_record', faucetRequestRecordSchema);
