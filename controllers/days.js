const mongoose = require("mongoose");
const Days = require("../schemas/days");
const Product = require("../schemas/products");
const Summary = require("../schemas/summary");
const moment = require("moment-timezone");
const ObjectId = mongoose.Types.ObjectId;
// const { findById } = require("../schemas/users");

const addProduct = async (body, userId) => {
  try {
    const { date, productId, weight: amount } = body;
    const dayCurrent = {
      $gte: moment.tz(new Date(`${date}T00:00:00.000`), "America/Bogota").utc(),
      $lte: moment.tz(new Date(`${date}T23:59:59.999`), "America/Bogota").utc(),
    };
    const dataProduct = await Product.findById(productId);
    const { _id, weight, calories, title, groupBloodNotAllowed } = dataProduct;

    const daySummary = await Summary.findOne({ date: dayCurrent, userId });
    const { _id: sumId, left, consumed, dailyRate } = daySummary;

    const caloriesPerAmount = Math.ceil((amount / weight) * calories);
    const consumedLeft = left - caloriesPerAmount;
    const consumedTotal = consumed + caloriesPerAmount;
    const perOfDay = (consumedTotal / dailyRate) * 100;

    daySummary.left = consumedLeft;
    daySummary.consumed = consumedTotal;
    daySummary.percentOfDailyRate = perOfDay;
    await daySummary.save();

    const dataDayUpdate = {
      $push: { productsId: { foodId: _id, amount, caloriesPerAmount } },
      userId,
      weight,
      calories: caloriesPerAmount,
      sumId,
    };
    const dataDay = await Days.findOneAndUpdate(
      {
        userId,
        date: dayCurrent,
      },
      dataDayUpdate,
      {
        new: true,
      }
    );
    console.log(dataDay);
    return {
      addedProduct: {
        product: { _id, weight, calories, title, groupBloodNotAllowed },
        dayId: dataDay._id,
        userId,
        weight: amount,
        calories: caloriesPerAmount,
      },
      summary: daySummary,
    };
  } catch (error) {
    console.error("database error:", error);
  }
};
const getDayInfo = async (body, userId) => {
  const dayRange = {
    $gte: moment
      .tz(new Date(`${body.date}T00:00:00.000`), "America/Bogota")
      .utc(),
    $lte: moment
      .tz(new Date(`${body.date}T23:59:59.999`), "America/Bogota")
      .utc(),
  };
  const dataSummary = await Summary.findOne({ date: dayRange, userId });
  
  const dataDay = await Days.findOne({ date: dayRange, userId });
  const getProductsAllowed = dataDay.productsId.map((product) =>
    Product.findById(product.foodId)
  );
  const getAllowed = await Promise.all(getProductsAllowed);
  const data = await Promise.all(getAllowed.map((product) => product.toJSON()));
  return {
    idDay: dataDay._id,
    eatenProducts: data,
    date: body.date,
    daySummary: dataSummary,
  };
};
const removeProduct = async ({ dayId, productId, sumId }) => {
  const tempDay = await Days.findById(dayId);
  const tempDayProducts = tempDay.productsId;
  const productToRemove = tempDayProducts.find((product) =>
    product.foodId.equals(new ObjectId(productId))
  );
  console.log(tempDay.productsId);
  const updateSummary = await Summary.findByIdAndUpdate(
    sumId,
    {
      $inc: {
        left: productToRemove.caloriesPerAmount,
        consumed: -productToRemove.caloriesPerAmount,
      },
    },
    { new: true }
  );

  const updateDay = await Days.findByIdAndUpdate(
    dayId,
    { $pull: { productsId: { foodId: productId } } },
    { new: true }
  );
  const response = updateDay
    ? { updateDay, message: "Food deleted", summary: updateSummary }
    : { message: "The food has not been added yet." };
  return response;
};

module.exports = {
  addProduct,
  getDayInfo,
  removeProduct,
};
