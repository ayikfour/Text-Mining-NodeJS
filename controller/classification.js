const Preprocessing = require("./preprocessing");
const Weighting = require("./weighting");
const InformationRetrieval = require("./informationRetrieval");
const chalk = require("chalk");
const log = console.log;
const IO = require("../IO");
class Classification {
   constructor() {
      this.documents = {
         classes: [],
         texts: [],
         names: [],
         terms: [],
         weights: [],
         TFIDF: [],
         frequencies: []
      };
      this.tests = {
         classes: [],
         texts: [],
         names: [],
         TFIDF: [],
         weights: [],
         prediction: []
      };
      this.option = {
         documents: "documents",
         tests: "tests"
      };
      this.preprocessing = new Preprocessing();
      this.weighting = new Weighting();
      this.IR = new InformationRetrieval();
   }

   train(documents = [], classes = [], names = []) {
      log(chalk.green("Training this documents: "));
      names.forEach((name, index) => {
         log("name: " + chalk.green(name));
         log("class:" + chalk.yellow(classes[index]));
      });

      this.documents.texts = [...this.documents.texts, ...documents];
      this.documents.classes = [...this.documents.classes, ...classes];

      this.preprocess(this.option.documents);
      this.weight(this.option.documents);
   }

   weight(option = "") {
      switch (option) {
         case "documents":
            this.documents.weights = this.weighting.getLogTermWeight(
               this.documents.terms,
               this.documents.texts
            );

            this.documents.frequencies = this.weighting.getDocumentFrequency(
               this.documents.terms,
               this.documents.texts
            );

            this.documents.frequencies = this.weighting.getIDF(
               this.documents.frequencies,
               this.documents.texts
            );

            this.documents.TFIDF = this.weighting.getTFIDF(
               this.documents.weights,
               this.documents.frequencies
            );

            this.documents.TFIDF = this.IR.normalized(this.documents.TFIDF);
            break;

         case "tests":
            this.tests.weights = this.weighting.getLogTermWeight(
               this.documents.terms,
               this.tests.texts
            );
            this.tests.TFIDF = this.weighting.getTFIDF(
               this.tests.weights,
               this.documents.frequencies
            );
            this.tests.TFIDF = this.IR.normalized(this.tests.TFIDF);
            break;
      }
   }

   preprocess(option = "") {
      switch (option) {
         case "documents":
            this.documents.texts = this.documents.texts.map(text =>
               this.preprocessing.start(text)
            );
            this.documents.terms = this.weighting.getTerm(this.documents.texts);
            break;
         case "tests":
            this.tests.texts = this.tests.texts.map(text =>
               this.preprocessing.start(text)
            );
            this.tests.texts = this.tests.texts.map(text => {
               return this.weighting.getQuery(text);
            });

            break;
      }
   }

   test(documents = []) {
      this.tests.texts = documents;
      this.preprocess(this.option.tests);
      this.weight(this.option.tests);

      this.tests.TFIDF.map(query => {
         this.tests.prediction.push(this.knn(10, query));
      });
      return this.tests.prediction;
   }

   knn(k = 1, query = []) {
      let distance = this.distance(query);
      let neighbours = distance.slice(0, k);
      // let cossim = this.IR.cossim(this.documents.TFIDF, query);
      // let neighbours = this.IR.rankedRetrieval(cossim).slice(0, k);

      log(distance);
      let classes = neighbours.map(neighbour => {
         return this.documents.classes[neighbour.document];
      });

      return this.decission(classes);
   }

   distance(query = []) {
      return this.documents.TFIDF.map((document, doc_index) => {
         let square = document.map((weight, index) => {
            return (weight - query[index]) ** 2;
         });
         let distance = square.reduce((prev, current) => prev + current) ** 0.5;

         return { document: doc_index, distance: distance };
      }).sort((a, b) => {
         return a.distance - b.distance;
      });
   }

   decission(classes = []) {
      let unique = Array.from(new Set(classes));
      unique = unique.map(clas => {
         let count = classes.filter(neighbour => neighbour == clas).length;
         return { class: clas, count };
      });

      unique.sort((a, b) => {
         return b.count - a.count;
      });

      return unique.shift().class;
   }

   accuracy(predictions = [], actuals = []) {
      log("");
      log(chalk.white("Predictions class: \n"), predictions);
      log(chalk.white("Actual class: \n"), actuals);

      let truth = 0;
      predictions.map((clas, index) => {
         if (clas == actuals[index]) {
            truth++;
         }
      });
      return (truth / predictions.length) * 100;
   }
}

module.exports = Classification;
