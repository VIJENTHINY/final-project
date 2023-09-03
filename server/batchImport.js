
// // const companies = require('./data/companies.json');
// // const items = require('./data/items.json'); 

// const { MongoClient } = require("mongodb");

// require("dotenv").config();
// const { MONGO_URI } = process.env;

// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// };

// const hello = () => {
//     console.log("hello")
// }

// const batchImport = async () => {
//     const client = new MongoClient(MONGO_URI, options);
//     try {
//     await client.connect();
//     const db = client.db("eCommerce");
//     console.log("connected!");
//     const result1 = await db.collection("notebooks").insertMany(notebooks);
//     const result2 = await db.collection("homeworks").insertMany(homeworks);
//     client.close();
//     console.log("disconnected!");
//     console.log(({ status: 201 }))
//     } catch (err) {
//     console.log(err.stack);
//     console.log({ status: 500, data: req.body, message: err.message });
//     }
// }

// batchImport(); 
// hello(); 