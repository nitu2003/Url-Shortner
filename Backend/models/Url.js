const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
      longUrl:{type:String,required:true},
      alias: { type: String, required: true, unique: true },
      topic: { type: String },
      shortUrl: { type: String },
      clicks:{type:Number,default:0},
      analytics: [
        {
          date: { type: Date, default: Date.now },
          userId: { type: String }, // Unique identifier for user
          os: { type: String }, // Operating system
          device: { type: String }, // Device type
        },
      ],
  }, { timestamps: true })
module.exports = mongoose.model('Url',urlSchema)