const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter the community name!"],
      trim: true,
    },

    email: {
      type: String,
      unique: [true, "community with this email already exist"],
      required: [true, "Please provide your email"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide valid email"],
    },

    phone: {
      type: String,
      required: [true, "Please provide your phone"],
    },
    type: {
      type: String,
      enum: ["organization", "education institue", "NGO"],
      required: [true, "Please provide your email"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [8, "Password must be of atleast 8 characters long"],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and Confirm-password are not same!",
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

communitySchema.virtual("createdEvents", {
  ref: "Event",
  localField: "_id",
  foreignField: "communityID",
});

communitySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
communitySchema.methods.correctPassword = async function (communityPassword, encryptedPassword) {
  return await bcrypt.compare(communityPassword, encryptedPassword);
};
const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
