const mongoose = requrie("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requried: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timeStamp: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
