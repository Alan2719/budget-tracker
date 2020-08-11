let db;
//db = event.target.result;
// create a new db request for a "budget" database.
const request = window.indexedDB.open("budget",1);

request.onupgradeneeded = function(event) {
  const budgetStore = db.createObjectStore("transactions",{autoIncrement:true});
};

request.onsuccess = function(event) {
  db = target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("GOT AN ERROR :(");
};

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  // access your pending object store
  // add record to your store with add method.
  const transaction = db.transaction(["transactions"],"readwrite");
  const budgetStore = transaction.objectStore("transactions");
  budgetStore.add(record);
}

function checkDatabase() {
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable
  const transaction = db.transaction(["transactions"],"readwrite");
  const store = transaction.objectStore("transactions");
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
          // if successful, open a transaction on your pending db
          const transaction = db.transaction(["transactions"],"readwrite");
          // access your pending object store
          const store = transaction.objectStore("transactions");
          // clear all items in your store
          store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);