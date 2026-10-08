// Repository - DAO - Data Access Only
const Url = require("../models/url.model");
const Counter = require("../models/url.counter.model");

// Generate auto-increment numeric ID
const getNextSequence = async () => {
    const counter = await Counter.findOneAndUpdate(
        {name: "url_counter"},
        {$inc: {value: 1}},
        {new: true, upsert: true}
    )
    return counter.value;
}

exports.create = async (originalUrl) => {
    const numericId = await getNextSequence();
    console.log("Creating URL in DB...",originalUrl);
    await Url.create({
        _id: numericId,
        originalUrl
    });
    console.log("URL created in DB...");
    return numericId;
}

exports.updatedCode = async(id, code) => {
    console.log("Updating short code");
    return Url.findByIdAndUpdate(id, {shortCode : code});
}

exports.findByCode = async(code) => {
    return Url.findOne({shortCode : code});
};

