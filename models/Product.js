const mongoose = require('mongoose');
const valid = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    required:true,
    trim: true,
  },
  parent:{
    type:String,
    required: true,
    trim:true,
  },
  children:{
    type:String,
    required: true,
    trim:true,
  },
  backSideType:[{
    image:String,
    name:String,
  }],
  // relatedImages: [{
  //   type: String,
  //   required: false,
  //   validate: [valid.isURL, "wrong url"]
  // }],
  image:{
    type:String,
    required: true,
    validate: [valid.isURL, "wrong url"]
  },
  originalPrice: {
    type: Number,
    required: true,
    min: [0, "Price can't be negative"],
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Price can't be negative"],
  },
  discount: {
    type: Number,
    required: false,
    default: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: ObjectId,
      ref: "Category",
      required: true,
    }
  },
  quantity: {
    type: Number,
    required: true,
  },
  sizes:[String],
  type:String,
  itemInfo:String,
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inActive'],
  },
},{
  timestamps: true
})

const Product = mongoose.model('Products',productSchema);
module.exports = Product;