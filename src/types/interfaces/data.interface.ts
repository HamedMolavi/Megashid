import mongoose, { Schema } from "mongoose";

export interface IData extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  value: string;
  ts: number;
}