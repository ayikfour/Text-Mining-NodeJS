const IO = require("../IO");
class Retrieval {
   constructor() {}

   normalized(documents = []) {
      let square = documents.map(document => {
         return document.map(TFIDF => {
            return TFIDF ** 2;
         });
      });

      let length = square.map(document => {
         return (
            document.reduce((prev, current) => {
               return prev + current;
            }) ** 0.5
         );
      });

      let normalize = documents.map((document, index) => {
         return document.map(TFIDF => {
            return TFIDF / length[index];
         });
      });

      return normalize;
   }

   cossim(TFIDF = [], queries = []) {
      queries = queries.reduce((prev, current) => {
         return prev.concat(current);
      });

      let documentSimilarity = TFIDF.map(document => {
         let dotProduct = document.map((token, index) => {
            return token * queries[index];
         });

         let sum = dotProduct.reduce((prev, current) => {
            return prev + current;
         });

         return sum;
      });

      return document;
   }

   rankedRetrieval(cossim = []) {
      cossim = cossim.map((similarity, index) => {
         return { name: `document ${index + 1}`, similarity };
      });

      return cossim
         .sort((a, b) => {
            return a.similarity - b.similarity;
         })
         .reverse()
         .filter(document => document.similarity > 0);
   }
}

module.exports = Retrieval;
