import mongoose from 'mongoose';

//  Schema = mongoose.Schema;

const entrySchema = mongoose.Schema({
    searchWord: { type: String, required: true, unique: true},
    numEntries:{type:Number,default:1},
  });
  
  const entry = module.exports = mongoose.model('entry', entrySchema);
