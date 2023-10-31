const { Schema, model } = require("mongoose");

const summarySchema = new Schema(
  {
    date: Date,
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    daily_rate: Number,
    left: Number,
    consumed: Number,
    percentage_of_normal: Number,
  },
  { versionKey: false, timestamps: true }
);
const SummarySchema = model("Summary", summarySchema);

module.exports = SummarySchema;
