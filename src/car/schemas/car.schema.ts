import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Car extends Document {
  @Prop({ required: true, index: true })
  carModel: string;

  @Prop({ required: true, index: true })
  make: string;

  @Prop({ required: true, index: true })
  year: number;

  @Prop({ required: true, index: true })
  mileAge: number;

  @Prop({ required: true, index: true })
  pricePerDay: number;
}

export const CarSchema = SchemaFactory.createForClass(Car);
