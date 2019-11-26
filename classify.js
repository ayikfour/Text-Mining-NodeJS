const IO = require("./IO");
const Classification = require("./controller/classification");

async function classify() {
   const classification = new Classification();

   let train_documents = IO.readBulkV2("./Data/Data Latih/");
   train_documents = getRandomDocument(train_documents, 100);

   let text = [];
   let classes = [];
   let names = [];

   train_documents.map(document => {
      text.push(document.text);
      classes.push(document.classification);
      names.push(document.name);
   });

   classification.train(text, classes, names);

   let test_documents = IO.readBulkV2("./Data/Data Uji/");
   test_documents = getRandomDocument(test_documents, 20);

   let test_text = [];
   let actual_class = [];

   test_documents.map(document => {
      test_text.push(document.text);
      actual_class.push(document.classification);
   });

   let prediction = classification.test(test_text);
   let accuracy = classification.accuracy(prediction, actual_class);

   console.log("Accuracy: " + accuracy);
}

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

// let doc1 = IO.readFrom(
//    "./Data/Data Uji/finance/pembangunan-ibu-kota-baru-di-kaltim-dibayangi-material-impor.txt"
// );
// let doc2 = IO.readFrom(
//    "./Data/Data uji/finance/prabowo-naik-mrt-menhub-saya-bangga-sekali.txt"
// );
// let doc3 = IO.readFrom(
//    "./Data/Data uji/health/70-juta-anak-di-dunia-diprediksi-alami-obesitas-pada-2025.txt"
// );
// let doc4 = IO.readFrom(
//    "./Data/Data uji/food/so-sweet-ada-sosis-bentuk-hati-untuk-rayakan-valentine.txt"
// );
// let doc5 = IO.readFrom(
//    "./Data/Data uji/sport/gagal-pindah-eriksen-andai-transfer-semudah-football-manager.txt"
// );

// let testDoc = [doc1, doc2, doc3, doc4, doc5];
// let prediction = classification.test(testDoc);
// let accuracy = classification.accuracy(prediction, [
//    "finance",
//    "finance",
//    "health",
//    "food",
//    "sport"
// ]);
