const mongoose = require('mongoose');
const {Schema} = mongoose;

const walletSchema = new Schema({
    userId: String,
    hasDeposited:Boolean,
    walletBalance:Number,
    noOfDeposits:Number
});

walletSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
    const self = this;
    const newDocument = doc;

    return new Promise((resolve, reject) => {

        return self.findOne(condition)
            .then((result) => {
                if (result) {
                    return resolve(result);
                }
                return self.create(newDocument)
                    .then((result) => {
                        return resolve(result);
                    }).catch((error) => {
                        return reject(error);
                    })
            }).catch((error) => {
                return reject(error);
                })
        });
};

mongoose.model('Wallet', walletSchema);