//Open method to get access to the DB
const indexedDb = window.indexedDB;
let name = document.querySelector("#t-name");
let amount = document.querySelector("#t-amount");
let addBtn = document.querySelector("#add-btn");
let subBtn = document.querySelector("#sub-btn");

//updgraded method to know if the db needs to update

if (indexedDb) {
    let db;
    const request = indexedDb.open("budgetTracker",1);

    request.onsuccess = () => {
        db = request.result;
        console.log('OPEN',db);
    }

    request.onupgradeneeded = event => {
        const db = event.target.result;
        console.log("CREATE", db);
        const transactionStore = db.createObjectStore("transactions",{keyPath:"name"});
        //transactionStore.createIndex("transactionID","transaction");
    }

    request.onerror = (err) => {
        console.log("Error", err);
    }

    const addData = (data) => {
        db = request.result;
        const transaction = db.transaction(["transactions"], "readwrite");
        const transactionStore = transaction.objectStore("transactions");
        //const transactionID = transactionStore.index("transactionID");


        transactionStore.add(data);
    }

    addBtn.addEventListener('click',function(event){
        event.preventDefault();
        let data = {
            name: name.value,
            amount: amount.value
        }
        console.log(data);
        addData(data);
    });

    subBtn.addEventListener('click',function(event){
        event.preventDefault();
        let data = {
            name: name.value,
            amount: amount.value
        }
        console.log(data);
        addData(data);
    });
}