const Products = require("../schemas/products");
const { filterProducts } = require("./filters");

const listProducts = async (query) => {
  try {
    const data = await Products.find(query);
    return data;
  } catch (error) {
    console.error("database error:", error);
  }
};

const getUnhealthyList = async (typeBlood, query) => {
  const findProducts = (await Products.find({
    [`groupBloodNotAllowed.${typeBlood}`]: true,
  })) || {
    message: "products, no found",
  };
  const listProductsUnHealthy = filterProducts(findProducts, query);
  return listProductsUnHealthy;
};

// const addContact = async (body, ownerId) => {
//   const newContact = await Contact.create(body);
//   newContact.owner = ownerId;
//   newContact.save();
//   return newContact;
// };
// const removeContact = async (contactId, ownerId) => {
//   const removedContact = await Contact.findOneAndRemove({
//     _id: contactId,
//     owner: ownerId,
//   });
//   const response = removedContact
//     ? { removedContact, message: "Contact deleted" }
//     : { message: "Contact, no found" };
//   return response;
// };

// const updateContact = async (contactId, dataUpdate, ownerId) => {
//   const updatedContact = await Contact.findOneAndUpdate(
//     { _id: contactId, owner: ownerId },
//     dataUpdate,
//     {
//       new: true,
//     }
//   );
//   const response = updatedContact
//     ? { updatedContact, message: "Contact updated" }
//     : { message: "Contact, no found" };
//   return response;
// };
// const updateStatusContact = async (contactId, body, ownerId) => {
//   const updatedStatus = await Contact.findOneAndUpdate(
//     { _id: contactId, owner: ownerId  },
//     body,
//     {
//       new: true,
//     }
//   );
//   const response = updatedStatus
//     ? { updatedStatus, message: "Favorite contact" }
//     : { message: "Contact, no found" };
//   return response;
// };

module.exports = {
  listProducts,
  getUnhealthyList,
  // removeContact,
  // addContact,
  // updateContact,
  // updateStatusContact,
};
