const IO = require("./IO");
const path = require("path");
const Preprocessing = require("./controller/preprocessing");
const Weighting = require("./controller/weighting");
const Retrieval = require("./controller/informationRetrieval");
const chalk = require("chalk");
const log = console.log;
const time = console.time;
const timeEnd = console.timeEnd;

const TAG = {
   reading: "READING DOCUMENT",
   preprocessDoc: "PREPROCESSING DOCUMENT",
   weightingDoc: "WEIGHTING DOCUMENT",
   weightingQuery: "WEIGHTING QUERY",
   preprocessQuery: "PREPROCESSING QUERY",
   retrieval: "RETRIEVING INFORMATION",
   program: "PROGRAM",
   finish: "FINISHED"
};

async function app() {
   const weighting = new Weighting();
   const preprocessing = new Preprocessing();
   const IR = new Retrieval();

   //Set process start time
   time(chalk.bgGreen(TAG.program));

   // Reading every document from Data Latih directory
   log(chalk.yellow(TAG.reading));
   let rawdocuments = IO.readBulk("./Data/Data latih/");
   log(chalk.green(TAG.finish, TAG.reading));

   // Preprocessing raw document
   log(chalk.yellow(TAG.preprocessDoc));
   let documents = rawdocuments.map(document => {
      return preprocessing.start(document);
   });

   // Weighting the preprocessed document
   log(chalk.yellow(TAG.weightingDoc));
   weighting.setText(documents);
   let terms = weighting.getTerm(documents);
   let termLogWeight = weighting.getLogTermWeight(terms, documents);
   let documentFrequency = weighting.getDocumentFrequency(terms, documents);
   let IDF = weighting.getIDF(documentFrequency, documents);
   let TFIDF = weighting.getTFIDF(termLogWeight, IDF);

   // queries
   log(chalk.yellow(TAG.preprocessQuery));
   let queries = [
      "tsunami tsunami badai dan hujan bencana selama gempa bumi, bbm, informasi"
   ];
   queries = queries.map(query => preprocessing.start(query));
   queries = weighting.getQuery(queries);

   // queries weighting
   log(chalk.yellow(TAG.weightingQuery));
   let queries_weight = weighting.getLogTermWeight(terms, queries);
   queries_weight = weighting.getTFIDF(queries_weight, IDF);

   //Information retrieval
   log(chalk.yellow(TAG.retrieval));
   log(chalk.green("Query: " + queries));
   let TFIDF_normalized = IR.normalized(TFIDF);
   let queries_normalized = IR.normalized(queries_weight);
   let cossim = IR.cossim(TFIDF_normalized, queries_normalized);
   let retrieval = IR.rankedRetrieval(cossim);
   log(retrieval);

   //Set process end time
   timeEnd(chalk.bgGreen(TAG.program));
}

app();
