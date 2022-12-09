const { ApolloServer} = require('apollo-server');
const dotenv = require('dotenv')
dotenv.config()
const { mongoose } = require("mongoose");
const url = process.env.MONGO_URL;
const { Authentication }= require('.././src/middleware/JWT')

const {typeDefs} = require('./graphql/types/typeDefs')
const {resolvers} = require('./graphql/resolvers/resolver')

const server = new ApolloServer({ typeDefs, resolvers ,
    // context : async ({req})=>{
    //     const token = req.headers["authorization"];
    //     if(token){
    //        let user = await Authentication(token);
    //        return user ? { user } : null
    //     }
    //     return {token}
    // }
});

mongoose.connect('mongodb+srv://developer:DB4Z0lO2oeTCpR7s@imaginarium-graphql.hm3kerl.mongodb.net/?retryWrites=true&w=majority', (err) => {
    err ? console.log(err.message) : console.log("connect to DB!!!");
  });
  
server.listen().then(({url}) => {
    console.log(`server is running on ${url}`);
}).catch((err) => {
    console.log(err.message);
});