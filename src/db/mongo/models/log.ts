import mongoose, { Schema } from "mongoose";
import { IData } from "../../../types/interfaces/data.interface";


//create Data model with schema for save in DB
const DataSchema: Schema<IData> = new Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    ts: { type: Number, required: true },
  },
  {
    collection: "Data",
  }
);


// DataSchema.post('save', balanceNewData);
// DataSchema.post(["remove", "deleteOne", "deleteMany", "findOneAndDelete", "findOneAndRemove"], async (doc) => {
// });


// Compile model from schema
const Data = mongoose.model("Data", DataSchema);
export default Data;
