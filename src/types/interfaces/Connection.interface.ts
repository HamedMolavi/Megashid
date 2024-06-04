import mongoose, { Document, Model } from "mongoose";

//create Connection type
export interface IConnection {
  _id: mongoose.Types.ObjectId;
  name: string;
  password: string;
  created_date: Date;
};

export interface IConnectionDocument extends IConnection, Document {
  _id: mongoose.Types.ObjectId;
  setPassword: (password: string, Connectionname: string) => string;
  checkPassword: (password: string) => Promise<boolean>;
};

export interface IConnectionModel extends Model<IConnectionDocument> {
  setPassword: (password: string, Connectionname: string) => string;
  checkPassword: (password: string) => Promise<boolean>;
};