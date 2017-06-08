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
var provider = new firebase.auth.GoogleAuthProvider();
$(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
    } else {
      firebase.auth().signInWithRedirect(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  });
});

function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
    console.log(error);
  })
};




// Populate the table with the list of trains
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

        var newRow = "<tr data-id=" + key + "> \
         <td>" + thisObject.trainName.toString() + "</td> \
         <td>" + thisObject.trainDestination.toString() + "</td> \
         <td>" + thisObject.trainFrequency.toString() + "</td> \
         <td>" + moment().add(minsTillNextTrain, 'm').format('h:mm A') + "</td> \
         <td>" + minsTillNextTrain + "</td> \
         <td><button class='btn btn-default btn-sm btn-edit' role='button' data-toggle='modal' data-target='#modal--train-edit'>Edit</button></td> \
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

function AddTrain() {
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
}

function EditTrain() {
  var trainID = $("#trainNameEdit").attr("data-id");
  var _trainName = $("#trainNameEdit").val().trim();
  var _trainDestination = $("#trainDestinationEdit").val().trim();
  var _trainTime = $("#trainTimeEdit").val().trim();
  var _trainFrequency = $("#trainFrequencyEdit").val().trim();
  database.ref().child(trainID).update({
    trainName: _trainName,
    trainDestination: _trainDestination,
    trainTime: _trainTime,
    trainFrequency: _trainFrequency
  });
  $("#modal--train-edit").modal("hide");
}

// Delete Functionality
$(".table--trainSchedule").on("click", ".btn-delete", function() {
  event.preventDefault();
  var trainID = $(this).attr("data-id");
  console.log(trainID);
  database.ref().child(trainID).remove();
  $(this).closest("tr").remove();
});

// Populate modal fields
$(".table--trainSchedule").on("click", ".btn-edit", function() {
  event.preventDefault();
  var trainID = $(this).closest("tr").attr("data-id");
  var trainRef = database.ref().child(trainID);
  trainRef.on('value', function(snapshot) {
    var trainEdit = snapshot.val();
    if (trainEdit) {
      $("#trainNameEdit").val(trainEdit.trainName).attr("data-id", trainID);
      $("#trainDestinationEdit").val(trainEdit.trainDestination);
      $("#trainTimeEdit").val(trainEdit.trainTime);
      $("#trainFrequencyEdit").val(trainEdit.trainFrequency);
    }
  });
});


$("#btnSaveChanges").on("click", function() {
  if ($("#form--train-edit").valid()) {
    EditTrain();
  }
});


/******************************************
 jQuery Validation
******************************************/
// override jquery validate plugin defaults
$.validator.setDefaults({
  highlight: function(element) {
    $(element).closest('.form-group').addClass('has-error');
  },
  unhighlight: function(element) {
    $(element).closest('.form-group').removeClass('has-error');
  },
  errorElement: 'span',
  errorClass: 'help-block',
  errorPlacement: function(error, element) {
    if (element.parent('.input-group').length) {
      error.insertAfter(element.parent());
    } else {
      error.insertAfter(element);
    }
  }
});

$.validator.addMethod("time", function(value, element) {
  return this.optional(element) || /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(value);
}, "Please enter a valid time, between 00:00 and 23:59");

$("#form--train").validate({
  rules: {
    trainName: "required",
    trainDestination: "required",
    trainTime: {
      required: true,
      time: true
    },
    trainFrequency: {
      required: true,
      digits: true,
      min: 1
    }
  },
  submitHandler: function(form, event) {
    event.preventDefault();
    AddTrain();
  }
});

$("#form--train-edit").validate({
  rules: {
    trainNameEdit: "required",
    trainDestinationEdit: "required",
    trainTimeEdit: {
      required: true,
      time: true
    },
    trainFrequencyEdit: {
      required: true,
      digits: true,
      min: 1
    }
  },
  submitHandler: function(form, event) {
    event.preventDefault();
    EditTrain();
  }
});
