const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Number, String } = Schema.Types;

const UserSchema = new Schema(
  {
    displayName: { type: String },
    provider: { type: String },
  },
  { collection: "Users", timestamps: true }
);

var User = mongoose.model("Users", UserSchema);

module.exports = { User };
