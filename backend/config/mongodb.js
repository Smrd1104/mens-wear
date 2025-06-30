import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected");
  });

  mongoose.connection.on("error", (err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
