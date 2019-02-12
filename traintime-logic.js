
var config = {
    apiKey: "AIzaSyCcPFcbAjIsgXGQwE-A3AcOXkeD40qypE8",
    authDomain: "train-times-93583.firebaseapp.com",
    databaseURL: "https://train-times-93583.firebaseio.com",
    storageBucket: "train-times-93583.appspot.com"
};

firebase.initializeApp(config);

var trainData = firebase.database();


$("#add-train-btn").on("click", function () {

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();


    var newTrain = {

        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    trainData.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);


    alert("Train successfully added");


    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");


    return false;
});


trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());


    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;

    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    // If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {

        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the current time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
        tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});

  // Assume the following situations.

  // (TEST 1)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 3 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? ( Let's use our brains first)
  // It would be 3:18 -- 2 minutes away

  // (TEST 2)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 7 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? (Let's use our brains first)
  // It would be 3:21 -- 5 minutes away


  // ==========================================================

  // Solved Mathematically
  // Test case 1:
  // 16 - 00 = 16
  // 16 % 3 = 1 (Modulus is the remainder)
  // 3 - 1 = 2 minutes away
  // 2 + 3:16 = 3:18

  // Solved Mathematically
  // Test case 2:
  // 16 - 00 = 16
  // 16 % 7 = 2 (Modulus is the remainder)
  // 7 - 2 = 5 minutes away
  // 5 + 3:16 = 3:21
