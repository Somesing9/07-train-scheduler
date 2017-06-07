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
        // console.log(data[key]);

        // Calculate time till next train
        var currentTime = moment().format("HH:mm");
        currentTime = moment(currentTime, "HH:mm");
        var initialTrain = moment(thisObject.trainTime, "HH:mm");
        var minutesPassed = moment.duration(currentTime.diff(initialTrain)).as('m')
        var minsTillNextTrain = Math.round(thisObject.trainFrequency - (minutesPassed % thisObject.trainFrequency));

        var newRow = "<tr> \
         <td>" + thisObject.trainName.toString() + "</td> \
         <td>" + thisObject.trainDestination.toString() + "</td> \
         <td>" + thisObject.trainFrequency.toString() + "</td> \
         <td>" + moment().add(minsTillNextTrain, 'm').format('h:mm A') + "</td> \
         <td>" + minsTillNextTrain + "</td> \
         <td><button class='btn btn-default btn-sm' role='button' data-toggle='modal' data-target='#modal--employee-edit'>Edit</button></td> \
         <td><button class='btn btn-default btn-sm btn-delete' role='button' data-id='" + key + "'>Delete</button></td> \
         </tr>";
        $(".table--trainSchedule tbody").append(newRow);
        // console.log(newRow);
      }
    } else {
      $(".table--trainSchedule tbody").append("There are no trains on the schedule. Add one")
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code)
    $(".table--trainSchedule tbody").append("Error getting train schedule!");
  }
);


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
});
