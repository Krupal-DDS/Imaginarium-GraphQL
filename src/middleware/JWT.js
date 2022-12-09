
const { ApolloError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const UserAuth = require('../model/Auth')

const Authentication = async (req, res, next) => {
  let user = null
  const token = req.split(" ")[1];
  if (token) {
    try {
      const decodetoken = jwt.verify(token, "Imaginarium-GraphQL");
      user = await UserAuth?.findOne({id:decodetoken.id})      
    } catch (error) {
      throw new AuthenticationError("Invalid Token.....");
    }
  }
  return user
  };

module.exports = {Authentication};
