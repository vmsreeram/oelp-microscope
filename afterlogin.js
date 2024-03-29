// interprocess communication is done using ipcRenderer. 
const { ipcRenderer } = require('electron');
const wifi = require('node-wifi');

const { MongoClient } = require("mongodb");
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);


////
let globalFlag = false;
let GlobalSessUsr;
ipcRenderer.send('getuser');
ipcRenderer.on('user-details',async (event,sessionuser)=>{
  if(globalFlag == false){
    console.log('sessionuser_glb=');
    console.log(sessionuser);
    alert('sessionuser_glb='+sessionuser)
    GlobalSessUsr = sessionuser;
    ///
    const cur_user = await db1.collection("userinfo").findOne({ "name": sessionuser });
    if(cur_user.privilege > test1_priv){
        document.getElementById("testSetBtn1").disabled=true;
        // alert('hide testSetBtn1')
      }
      if(cur_user.privilege > test2_priv){
        document.getElementById("testSetBtn2").disabled=true;
        // alert('hide testSetBtn2')
    }
    globalFlag = true;
  }
});
////

// closing the window ~ used only in dev phase
function closeFn1() {
    ipcRenderer.send('close')
}

var db1 = client.db("tempdemo")
async function get_cur_amount(){
const amount_left =  await db1.collection("credits").findOne({ "name":"credits" });
    return amount_left.amount;
}
const showcreds = document.getElementById("show-credits")
async function updateCreditsDisplay() {
    const currentAmount = await get_cur_amount();
    showcreds.innerHTML = `Credits left - ${currentAmount}`;
  }
  updateCreditsDisplay();
  
let test1_amount = 100;
let test1_priv = 0;
let test2_amount = 150;
let test2_priv = 1;

async function checkSimServer() {
  const http = require('http');
  const options = {
    host: '127.0.0.1',
    port: 9876,
    path: '/'
  };

  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      console.log(`checkSimServer: HTTP Server up and running.`);
      console.log(`checkSimServer: HTTP Server status code: ${response.statusCode}`);
      request.end();
      resolve(true); // Resolve the promise with a value of true if the request completes successfully
    });

    request.on('error', (error) => {
      console.log(`checkSimServer: HTTP Server error: ${error.message}`);
      request.end();
      resolve(false); // Resolve the promise with a value of false if the request fails
    });

    request.end();
  });
}

function getCurrentTimestamp() {
  const timestamp = Date.now();
  const dateObj = new Date(timestamp);

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString().slice(-2);
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');

  const formattedTimestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return formattedTimestamp;
}

async function testSetFn1() {
  var db1 = client.db("tempdemo");
  const amount_left = await db1.collection("credits").findOne({ "name": "credits" });
  if (test1_amount <= amount_left.amount) {
    const isServerUp = await checkSimServer();
    if (isServerUp) {
      const result = await db1.collection('credits').updateOne(
          { name: 'credits' },
          { $set: { amount: amount_left.amount - test1_amount } }
        );
        updateCreditsDisplay();
      

        const fs = require('fs');

        function convertToCSV(arr) {
          const header = Object.keys(arr[0]).join(',');
          const rows = arr.map(obj => Object.values(obj).join(','));
          return [rows].join('\n') + '\n';;
        }

        function saveFile(data, filename) {
          return new Promise((resolve, reject) => {
            fs.appendFile(filename, data, (err) => {
              if (err) {
                reject(err);
              } else {
                console.log(`File saved as ${filename}`);
                resolve();
              }
            });
          });
        }

        async function onCloseWindow() {
          const userLogs = [
            { user: `${GlobalSessUsr}`,test: 'test 1',  used_credit: test1_amount, timeStamp: getCurrentTimestamp() },
          ];
          const csv = convertToCSV(userLogs);
          const filename = 'userLogs.csv';
          try {
            await saveFile(csv, filename);
            // Destroy the window here
            ipcRenderer.send('user_test1');
            //
          } catch (error) {
            console.error(error);
          }
        }
       onCloseWindow();
        ///


    } else {
      alert("HTTP server is not running.");
    }
  } else {
    alert("Insufficient credits");
  }
}
  
function testSetFn2() {
    wifi.init();
    wifi.getCurrentConnections(async (err, currentConnections) => {
        try {
            console.log("inside");
          if (currentConnections.length === 0) {
           alert("Wifi needed for this test");
          } else {
            const amount_left = await db1.collection("credits").findOne({ "name":"credits" });
            if(test2_amount <= amount_left.amount){

                const result = await db1.collection('credits').updateOne(
                    { name: 'credits' },
                    { $set: { amount: amount_left.amount-test2_amount } }
                  );
                              

                    const fs = require('fs');

                    function convertToCSV(arr) {
                      const header = Object.keys(arr[0]).join(',');
                      const rows = arr.map(obj => Object.values(obj).join(','));
                      return [rows].join('\n') + '\n';;
                    }

                    function saveFile(data, filename) {
                      return new Promise((resolve, reject) => {
                        fs.appendFile(filename, data, (err) => {
                          if (err) {
                            reject(err);
                          } else {
                            console.log(`File saved as ${filename}`);
                            resolve();
                          }
                        });
                      });
                    }

                    async function onCloseWindow() {
                      const userLogs = [
                        { user: `${GlobalSessUsr}`,test: 'test 2', used_credit: test2_amount, timeStamp: getCurrentTimestamp() },
                      ];
                      const csv = convertToCSV(userLogs);
                      const filename = 'userLogs.csv';
                      try {
                        await saveFile(csv, filename);
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  onCloseWindow();
                    ///
                    alert("test completed");
                  ////
                }
                else{
                    alert("Insufficient credits")
                }
                  updateCreditsDisplay();

          }
        } catch (e) {
          console.log(e)
        }
      });
      console.log("here")
}
function testSetFn3() {
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}


document.getElementById("userlogout").onclick = function () {
    // location.href = "index.html";
    ipcRenderer.send('user_logout');
};

document.getElementById('save_view_report').onclick = function() {
    ipcRenderer.send('load_csv');
}