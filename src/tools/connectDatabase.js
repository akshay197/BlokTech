const mongoose = require('mongoose');

const connectToDatabase = () => {
    let uri;
    if (process.env.DB_URI) {
        uri = process.env.DB_URI;
    }

    if (uri) {
        mongoose
            .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Connected to Database');
            })
            .catch((err) => {
                throw err;
            });
    }
};

module.exports = connectToDatabase;
