import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const User_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: 8,
      maxLength: 10,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, "give a valid phone number"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    accessToken: String,
    refreshToken: String,
    forgotPassToken: String,
  },
  {
    timestamps: true,
  },
);

User_schema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
// User_schema.pre("save", async function () {
//   if (!this.isModified("refreshToken")) return;
//   this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
// });
User_schema.methods.genAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.SECRET_ACCESS_TOKEN!,
    {
      expiresIn: "15m",
    },
  );
};

User_schema.methods.genRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.SECRET_REFRESH_TOKEN!,
    {
      expiresIn: "1d",
    },
  );
};
User_schema.methods.genforgotPassToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.SECRET_FORGOTPASS_TOKEN!,
    {
      expiresIn: "1d",
    },
  );
};

User_schema.methods.isPasswordCorrect = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.models.users || mongoose.model("users", User_schema);

export { User, User_schema };
