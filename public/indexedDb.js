let db;
// create a new db request for a "budget" database.
const request = window.indexedDB.open("budget",1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;
};

request.onerror = function(event) {
  console.log("GOT AN ERROR :(");
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"],"readwrite");
  const budgetStore = transaction.objectStore("pending");
  budgetStore.add(record);
}

function checkDatabase() {
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable
  const transaction = db.transaction(["pending"],"readwrite");
  const budgetStore = transaction.objectStore("pending");
  const getAll = budgetStore.getAll();

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
          const transaction = db.transaction(["pending"],"readwrite");
          // access your pending object store
          const budgetStore = transaction.objectStore("pending");
          // clear all items in your store
          budgetStore.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);