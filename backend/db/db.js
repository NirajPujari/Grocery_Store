const mongoose = require("mongoose");

const dbConfig = async () => {
    const instance = await mongoose.connect(process.env.MONGODB_URL, {
        dbName: process.env.DB_NAME, // Correct way to specify the database name
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");
    return instance;
};

module.exports = { dbConfig };
