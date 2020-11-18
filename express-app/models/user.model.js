module.exports = mongoose => mongoose.model(
    "User",
    mongoose.Schema(
        {
            name: String,
            pass: String
        }
    )
)