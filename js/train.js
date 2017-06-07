var config = {
  apiKey: "AIzaSyAvYe3ro1TsDYbElF0DW4yk_BCj_Yzn1cU",
  authDomain: "train-scheduler-9113f.firebaseapp.com",
  databaseURL: "https://train-scheduler-9113f.firebaseio.com",
  projectId: "train-scheduler-9113f",
  storageBucket: "train-scheduler-9113f.appspot.com",
  messagingSenderId: "246516435657"
};
firebase.initializeApp(config);
var database = firebase.database();

database.ref().on("value", function(snapshot) {
    var data = snapshot.val();
    $(".table--trainSchedule tbody").empty();
    if (data) {
      for (var key in data) {
        var thisObject = data[key];
        console.log(data[key]);
        var newRow = "<tr> \
         <td>" + data[key].trainName.toString() + "</td> \
         <td>" + data[key].trainDestination.toString() + "</td> \
         <td>" + data[key].trainFrequency.toString() + "</td> \
         <td>" + data[key].trainTime.toString() + "</td> \
         </tr>";
        $(".table--trainSchedule tbody").append(newRow);
        console.log(newRow);
      }
    }
    else {
      $(".table--trainSchedule tbody").append("<tr><td>There are no trains on the schedule. Add one using the form below</td></tr>");
    }
    // for (var key in data) {
    //   var thisObject = data[key];
    //   console.log(data[key]);
    //   var newRow = "<tr> \
    //     <td>" + data[key].trainName.toString() + "</td> \
    //     <td>" + data[key].trainDestination.toString() + "</td> \
    //     <td>" + data[key].trainFrequency.toString() + "</td> \
    //     <td>" + data[key].trainTime.toString() + "</td> \
    //     </tr>";
    //   $(".table--trainSchedule tbody").append(newRow);
    //   console.log(newRow);
    // }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code)
    $(".table--trainSchedule tbody").append("There are currently no trains scheduled. Add one below.");
  });


$("#btnSubmit").on("click", function() {
  // event.preventDefault();
  var _trainName = $("#trainName").val().trim();
  var _trainDestination = $("#trainDestination").val().trim();
  var _trainTime = $("#trainTime").val().trim();
  var _trainFrequency = $("#trainFrequency").val().trim();
  database.ref().push({
    trainName: _trainName,
    trainDestination: _trainDestination,
    trainTime: _trainTime,
    trainFrequency: _trainFrequency
  });

  console.log(trainName + " " + trainDestination + " " + trainTime + " " + trainFrequency);

});
