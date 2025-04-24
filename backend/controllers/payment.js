const { BuyProduct } = require("../models/buyProduct.model.js")
const { Payment } = require("../models/payment.model.js")
const { asyncHandler } = require("../service/asyncHandler.js")
const mongoose=require("mongoose")

let payment = asyncHandler(async (req, res) => {
    const cardHolderName=req.body.cardHolderName
    const cardNumber=req.body.cardNumber
    const total=req.body.total
    const products=req.body.products
    const userid=req.body.userid

    const formatDateTime = (date = new Date()) => {
        const pad = (n) => n.toString().padStart(2, "0");
    
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1); // Months are 0-indexed
        const year = date.getFullYear().toString().slice(-2);
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
    
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let payment=await Payment.create({userid:userid,cardHolderName:cardHolderName,cardNumber:cardNumber,total:total})
        products.forEach(async(element) => {
            await BuyProduct.create({userid:userid,paymentid:payment._id,name:element.name,category:element.category,price:element.price,date:formatDateTime(),status:"Not Delivered"});
        });
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.json({ status: false });
    }
    res.json({ status: true });
})
module.exports = { payment }