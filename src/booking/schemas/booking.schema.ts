import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
  IN_PROGRESS = 'In Progress',
}

export interface Cancellation {
  reason?: string;
  cancelledBy?: string;
}

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Car', required: true })
  car: mongoose.Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ enum: BookingStatus, required: true })
  status: BookingStatus;

  //Instead of tracking cancellation only, all statuses should be tracked (who & when)
  @Prop({ required: false })
  cancelledAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
