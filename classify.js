const IO = require("./IO");
const Classification = require("./controller/classification");

async function classify() {
   const classification = new Classification();

   let train_documents = IO.readBulkV2("./Data/Data Latih/");
   train_documents = getRandomDocument(train_documents, 200);

   let text = [];
   let classes = [];
   let names = [];

   // destructure document to text, classes, names array.
   train_documents.map(document => {
      text.push(document.text);
      classes.push(document.classification);
      names.push(document.name);
   });

   // training data using training method from classification class
   // must have 3 parameters: text, classes, and names
   classification.train(text, classes, names);

   // reading test documents from ./Data/Data Uji/ dir
   let test_documents = IO.readBulkV2("./Data/Data Uji/");

   // get random document from test documents
   test_documents = getRandomDocument(test_documents, 5);

   // declare array to store test text and actual class
   let test_text = [];
   let actual_class = [];

   // destructure test document to text, and actual class
   test_documents.map(document => {
      test_text.push(document.text);
      actual_class.push(document.classification);
   });

   // testing the test document, returning class prediction
   let prediction = classification.test(test_text, 4);

   // get the acuracy of the prediction
   let accuracy = classification.accuracy(prediction, actual_class);
}

/**
 *
 * @param {*} documents
 * Documents is an array containing document(text)
 * @param {*} count
 * COunt is document count to retrieve.
 */
function getRandomDocument(documents = [], count = 1) {
   let indexes = [];
   let choosen = [];
   for (let index = 0; index < count; index++) {
      let random_index = Math.floor(Math.random() * documents.length);
      while (indexes.includes(random_index)) {
         random_index = Math.floor(Math.random() * documents.length);
      }
      choosen.push(documents[random_index]);
   }
   return choosen;
}

classify();

//Loading SIngle Document
// let doc1 = IO.readFrom(
//    "./Data/Data Uji/finance/pembangunan-ibu-kota-baru-di-kaltim-dibayangi-material-impor.txt"
