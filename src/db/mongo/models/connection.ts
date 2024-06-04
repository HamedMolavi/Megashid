import mongoose, { Schema } from "mongoose";
import { genSaltSync, compareSync, hashSync } from "bcrypt";
import { IConnectionDocument, IConnectionModel } from "../../../types/interfaces/Connection.interface";
import { getEntries, setNestedObjectValue } from "../../../tools/utils.tools";

//create Connection model with schema for save in DB
const ConnectionSchema: Schema<IConnectionDocument> = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
  },
  {
    collection: "Connection",
    toJSON: {
      transform(_doc, ret: any) {
        delete ret["password"];
        return ret;
      },
    }
  }
);

//compare password
ConnectionSchema.methods.checkPassword = function (password: string) {
  let Connection = this;
  return compareSync(password + Connection.name, Connection.password);
};

ConnectionSchema.methods.setPassword = function (password: string, name: string) {
  const salt = genSaltSync(SALT_FACTOR);
  const result = hashSync(password + name, salt);
  return result
};


//for encrypt password
const SALT_FACTOR = 10;
ConnectionSchema.pre("save", function (done: Function) {
  try {
    const Connection = this;
    if (!Connection.isModified("password")) return done();
    Connection.password = Connection.setPassword(Connection.password, Connection.name);
    done();
  } catch (err) {
    done(err);
  };
});
ConnectionSchema.pre("findOneAndUpdate", async function (done) {
  const doc = await this.model.findOne(this.getQuery());
  const updatingFields: { [key: string]: string } = Object(this.getUpdate());
  if (!getEntries(updatingFields).some(([path, _]) => path.includes("password"))) return done(); // password didn't updated
  const [passwordPath, rawPassword] = getEntries(updatingFields).find(([path, _]) => path.includes("password")) ?? ["", ""];
  const password = doc.setPassword(rawPassword, doc.name);
  if (!!passwordPath) setNestedObjectValue(updatingFields, passwordPath?.split("."), password);
  this.setUpdate(updatingFields);
  done();
})
// Compile model from schema
const Connection = mongoose.model<IConnectionDocument, IConnectionModel>("Connection", ConnectionSchema);
export default Connection;
