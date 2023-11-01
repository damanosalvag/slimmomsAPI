const { Schema, model } = require("mongoose");

const summarySchema = new Schema(
  {
    date: Date,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dailyRate: { type: Number, default: 2000 },
    left: { type: Number, default: 2000 },
    consumed: { type: Number, default: 0 },
    percentOfDailyRate: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);
const SummarySchema = model("Summary", summarySchema);

module.exports = SummarySchema;
