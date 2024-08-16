import type { Schema } from 'mongoose';

export function timestamp(schema: Schema) {
  schema.add({
    created_at: String,
    updated_at: String,
  });

  schema.pre('save', function(next) {
    const now = new Date().toISOString();

    this.updated_at = now;
    if (!this.created_at) {
      this.created_at = now;
    }
    next();
  });
}
