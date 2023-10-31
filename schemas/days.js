const { Schema, model } = require("mongoose");

const daySchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    sum_id: { type: Schema.Types.ObjectId, ref: "Summary" },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    weight: Number,
    calories: Number,
  },
  { versionKey: false, timestamps: true }
);
const DaySchema = model("Day", daySchema);

module.exports = DaySchema;
