const Weighting = require("./weighting");
class TestWeighting {
   constructor() {}

   start(documents = []) {
      //    Instantiate Weighting class
      const weighting = new Weighting();

      //   Set the Weighting class' documents using setText() method
      //   Documents containing stem result from class preprocessing
      weighting.setText(documents);

      //   Invoke getFeatures() method from Weighting class
      let features = weighting.getFeature();

      //   Invoke getTF() method from Weighting class
      let tf = weighting.getTF();

      // Invoke getTFIDF() method from Weighting class
      let tfidf = weighting.getTFIDF();

      console.log(tf);
      console.log(features);
      console.log(tfidf);
   }
}

module.exports = TestWeighting;
