const User = require("../schemas/users");
const Summary = require("../schemas/summary");

const { getUnhealthyList } = require("./products");

const calculatorPublic = async (body) => {
  try {
    const { age, blood, height, weightDesired, weightCurrent } = body;
    const dataUnHealthyList = await getUnhealthyList(blood, {
      page: 1,
      limit: 4,
    });
    const notAllowedProducts = dataUnHealthyList.products.map(
      (product) => product.title
    );
    const dailyRate =
      10 * weightCurrent +
      6.25 * height -
      5 * age -
      161 -
      10 * (weightCurrent - weightDesired);
   
    return {
      dailyRate,
      notHealthy: notAllowedProducts,
    };
  } catch (error) {
    console.error("database error:", error);
  }
 }

const calculator = async (body, userId) => {
  try {
    const { age, blood, height, weightDesired, weightCurrent } = body;
    const dataUnHealthyList = await getUnhealthyList(blood, {
      page: 1,
      limit: 4,
    });
    const notAllowedProducts = dataUnHealthyList.products.map(
      (product) => product.title
    );
    const dailyRate =
      10 * weightCurrent +
      6.25 * height -
      5 * age -
      161 -
      10 * (weightCurrent - weightDesired);
    const dataUpdate = {
      blood,
      height,
      age,
      weightCurrent,
      weightDesired,
      dailyRate,
      notAllowedProducts,
    };
    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      dataUpdate,
      {
        new: true,
      }
    );
    userUpdate.save();
    const dataSummaryUpdate = {
      dailyRate,
      left: dailyRate,
    };
    const dateCurrent = new Date().toISOString().split("T")[0];
    const summaryUpdate = await Summary.findOneAndUpdate(
      {
        userId,
        date: {
          $gte: new Date(`${dateCurrent}T00:00:00.000Z`),
          $lte: new Date(`${dateCurrent}T23:59:59.999Z`),
        },
      },
      dataSummaryUpdate,
      {
        new: true,
      }
    );
    summaryUpdate.save();
    return {
      user: userUpdate,
      notHealthy: dataUnHealthyList,
      summary: summaryUpdate,
    };
  } catch (error) {
    console.error("database error:", error);
  }
};

module.exports = {
  calculator,
  calculatorPublic,
};
