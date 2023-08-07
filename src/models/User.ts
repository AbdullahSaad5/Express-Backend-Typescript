import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePicture: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as IUser;
  return await bcrypt.compare(candidatePassword, user.password);
};

export interface IUser extends mongoose.Document {
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  resetPasswordToken: number;
  resetPasswordExpires: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

userSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);
