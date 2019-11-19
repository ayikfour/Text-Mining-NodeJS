const { Stemmer } = require("sastrawijs");
const fs = require("fs");

function tokenize(source = "") {
   let documents = [];

   /**
    * 1. clean document from ".", "," and other special character
    * 2. transform document to lower case
    * 3. split document by " " (space)
    * */
   documents = source
      .replace(/[,.'":*?<>{}&\/\\$()\n\r]/g, "")
      .toLowerCase()
      .split(" ");

   return documents;
}

function filter(documents = []) {
   /**
    * 1. read file stopwords.txt using fs module
    * 2. chaining with split() function. for splitting new line (CRLF based).
    */
   let stopwords = fs.readFileSync("./stopwords.txt", "utf8").split("\r\n");

   /**
    * Filter documents from stopwords list.
    * any word matched with list from stopwords will be removed from documents.
    */
   let filtered = documents.filter(word => !stopwords.includes(word));

   return filtered;
}

function stem(documents = []) {
   let stemmer = new Stemmer();
   let stemmed = documents.map(word => stemmer.stem(word));

   return stemmed;
}

function terms(documents = []) {
   return Array.from(new Set(documents));
}

module.exports = { terms, tokenize, filter, stem };
