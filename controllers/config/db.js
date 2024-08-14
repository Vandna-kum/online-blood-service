const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = async () => {
   try {
      // @ts-ignore
      await mongoose.connect(process.env.MONGO_URL);
      console.log(`Connected To Mongodb Database
          ${mongoose.connection.host}`);



   } catch (error) {
      // @ts-ignore
      console.log(`Mongodb Database Error  ${error}`.bgRed.white);

   }


}

module.exports = connectDB;