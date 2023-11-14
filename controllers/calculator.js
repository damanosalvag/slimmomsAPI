const User = require("../schemas/users");
const Summary = require("../schemas/summary");
const Day = require("../schemas/days");
const moment = require("moment-timezone");

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
};

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
    const dataSummaryUpdate = {
      dailyRate,
      left: dailyRate,
      consumed: 0,
    };
    const dateCurrent = new Date();
    const currentDateBogota = moment(dateCurrent).tz("America/Bogota");
    const summaryUpdate = await Summary.findOneAndUpdate(
      {
        userId,
        _id: userUpdate.summaryId,
      },
      dataSummaryUpdate,
      {
        new: true,
      }
    );

    await Day.findOneAndUpdate(
      {
        userId,
        date: currentDateBogota.format('YYYY-MM-DD'),
      },
      {
        date: currentDateBogota.format('YYYY-MM-DD'),
        userId,
        productsId: [],
        sumId: summaryUpdate._id,
        weight: 0,
        calories: 0,
      },
      {
        new: true,
        upsert: true,
      }
    );
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
