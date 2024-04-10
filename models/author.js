const mongoose = require("mongoose");
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Virtual for formatted date
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : 'unknown'
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : 'alive'
});

AuthorSchema.virtual("lifespan").get(function () {
  // const dob = this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : 'unknown'
  // const dod = this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : 'alive'
  if(typeof(this.date_of_birth) === 'object'){
    if(typeof(this.date_of_death) === 'object'){
      return findDifferenceInDates(this.date_of_birth, this.date_of_death)
    }
    return findDifferenceInDates(this.date_of_birth, new Date())
  }
  return '???'
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);

function findDifferenceInDates(earlierDate, laterDate){
   
  // Calculating the time difference
  // of two dates
  let Difference_In_Time =
      laterDate.getTime() - earlierDate.getTime();
   
  // Calculating the no. of years between
  // two dates
  let Difference_In_Years = Difference_In_Time / (1000 * 3600 * 24 * 365);
  let rounded_difference_in_years = Math.round(Difference_In_Years * 10) /10 //rounded to the first decimal

  return rounded_difference_in_years
}