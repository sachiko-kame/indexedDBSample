"use strict";

const deName = 'sampleDB'
const objectName = 'humans'

const customerData = [{
        name: "Bill",
        sex: '男'
    },
    {
        name: "Alec",
        sex: '男'
    },
    {
        name: "Eliana",
        sex: '女'
    },
];

function allAddData() {
    addData(1)
    addData(2)
    addData(3)
}

function addData(value) {
    var request = window.indexedDB.open(deName, 3);
    request.onerror = function(event) {
        alert('DBのアクセスに失敗');
    };
    request.onsuccess = function(event) {
        var db = event.target.result;
        var customerObjectStore = db.transaction(objectName, "readwrite").objectStore(objectName);
        customerObjectStore.add(customerData[value - 1]);
        allGetData();

    };
    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore(objectName, {
            keyPath: "name"
        });
    };
}

function allGetData() {
    var request = window.indexedDB.open(deName, 3);
    request.onerror = function(event) {
        alert('DBのアクセスに失敗');
    };
    request.onsuccess = function(event) {
        var db = event.target.result;
        var customerObjectStoreRequest = db.transaction(objectName, "readonly").objectStore(objectName).getAll();
        customerObjectStoreRequest.onerror = function(event) {
            db.close();
            alert('オブジェクト取得失敗');
        };
        customerObjectStoreRequest.onsuccess = function(event) {
            var datas = event.target.result;
            dataShow(datas);
            db.close();
        }
    }
    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore(objectName, {
            keyPath: "name"
        });
    };
}

function deleateData(value){
  var request = window.indexedDB.open(deName, 3);
  request.onerror = function(event) {
      alert('DBのアクセスに失敗');
  };
  request.onsuccess = function(event) {
      var db = event.target.result;
      var customerObjectStoreRequest = db.transaction(objectName, "readwrite").objectStore(objectName).delete(customerData[value - 1].name);
      customerObjectStoreRequest.onerror = function(event) {
          db.close();
          alert('オブジェクト削除失敗');
      };
      customerObjectStoreRequest.onsuccess = function(event) {
        db.close();
        allGetData();
      }
  };
  request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore(objectName, {
          keyPath: "name"
      });
  };
}

function dataShow(values) {
    const num = values.length;
    const target = document.getElementById('output');

    if(num === 0){
      target.innerHTML = '<p>データがありません</p>';
    }else{
      const map1 = values.map(item => JSON.stringify(item));
      let li = '<ul><li>' + map1.join('</li><li>') + '</li></ul>'
      target.innerHTML = li;
    }
}