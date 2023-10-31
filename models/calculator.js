const Days = require("../schemas/products");
const Summary = require("../schemas/summary");

const calculator = async (body, userId) => {
  try {
      const { age, height, weight_desired, weight_current } = body;
      const dailyRate =
        10 * weight_current +
        6.25 * height -
        5 * age -
        161 -
        10 * (weight_current - weight_desired);
;
      const sumObject = {
        date: new Date,
        user_id: userId,
        daily_rate: dailyRate,
        left: dailyRate,
        consumed:0,
        percentage_of_normal: 0,
      };
    const newSummary = await Summary.create(sumObject);
    newSummary.save();
    return newSummary;
  } catch (error) {
    console.error("database error:", error);
  }
};

module.exports = {
  calculator,
};