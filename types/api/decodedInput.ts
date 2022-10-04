export interface DecodedInput {
  method_call: string;
  method_id: string;
  parameters: Array<DecodedInputParams>;
}

export interface DecodedInputParams {
  name: string;
  type: string;
  value: string;
}
