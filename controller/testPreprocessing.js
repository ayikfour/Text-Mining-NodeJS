const Preprocessing = require("./preprocessing");

class TestPreprocessing {
   constructor() {}

   start(source = "") {
      // Instansiate the class
      let preprocessing = new Preprocessing();

      // Manual invoke method for testing Preprocessing class
      let caseFold = preprocessing.caseFold(source);
      let clean = preprocessing.clean(caseFold);
      let token = preprocessing.tokenize(clean);
      let filter = preprocessing.filter(token);
      let stem = preprocessing.stem(filter);

      // Or invoke using start method from Preprocessing class
      let stem2 = preprocessing.start(source);

      // return the result

      return stem;
   }
}

module.exports = TestPreprocessing;
