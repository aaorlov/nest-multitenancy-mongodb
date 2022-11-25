import { v4 as uuid4 } from 'uuid';
import mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'users',
  autoCreate: true,
  versionKey: false,
  strict: false,
  timestamps: { createdAt: true, updatedAt: true },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => { delete ret._id; },
  },
})
export class UserEntity {
  @Prop({ type: String, required: true, default: uuid4 })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  tenantId: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;
}

export type UserDocument = UserEntity & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(UserEntity);

UserSchema.virtual('id').get(function() {
  return this._id;
});

