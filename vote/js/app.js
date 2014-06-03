//Parse JavaScript Key : fVd6fGuWnpkrGY2voBbS3jp8vDCmlplAKaPONWvX

(function() {

  var app = angular.module('LocationVote', []);

  app.factory('ParseService', function(){
    Parse.initialize("wvKilDh5ZK8ODgHaslQf7xBoiGnX2RWhMmC1GJfq", "fVd6fGuWnpkrGY2voBbS3jp8vDCmlplAKaPONWvX");

    var RoomObject = Parse.Object.extend("RoomObject");
    var gQuery = new Parse.Query(RoomObject);
    var gRoom = new RoomObject();

    var ParseService = {
      name: "Parse",

      getRoomList : function getRoomList(callback){
        gRoom.fetch({
          success : function(data){
            var json = data.toJSON()
            // console.log(json.results);
            callback(json.results);
          },
          error : function(error){
            alert("Error: "+error.description);
          }
        });
      },

      saveToParse : function saveToParse(newRoom, callback){
        var room = new RoomObject();
        room.set("link", newRoom.link);
        room.set("cost", newRoom.cost);
        room.set("traffic", newRoom.traffic);
        room.set("bed", newRoom.bed);
        room.set("register", newRoom.register);
        room.set("points", newRoom.points);
        room.save(null, {
          success : function(room){
            //allRooms.push(newRoom);
            //alert("save success! need to refresh table, room id = "+room.id);
            callback(room.toJSON());
          },
          error : function(room, error){
            alert("Error: "+error.message);
          }
        });
      },

      countPoints: function countPoints(newPoint, room){
        gQuery.equalTo("traffic", room.traffic);
        gQuery.find({
          success:function(room) {
            // list contains post liked by the current user which have the title "I'm Hungry".
            // console.log(room[0]);
            room[0].set("points", newPoint);
            room[0].save();
          },
          error : function(error) {
            alert("Error: "+error.message);
          }
        });
      },

      updateOffice: function updateOffice(objectId, newTraffic){
        gQuery.equalTo("objectId", objectId);
        gQuery.find({
          success: function(room){
            room[0].set("traffic", newTraffic);
            room[0].save();
          },
          error : function(error) {
            alert("Error: "+error.message);
          }
        });
      },

      deleteOffice: function deleteOffice(link, callback) {
        gQuery.equalTo("link", link);
        gQuery.find({
          success:function(room) {
            // list contains post liked by the current user which have the title "I'm Hungry".
            // console.log(room[0]);
            room[0].destroy({
              success: function(myObject) {
                gRoom.fetch({
                  success : function(data){ callback(data.toJSON().results); }
                });
                //callback(myObject.toJSON());
                alert("Delete Success!!");
              },
              error: function(error) {
                alert("Error: "+error.message);
              }
            });
          },
          error : function(error) {
            alert("Error: "+error.message);
          }
        });
      }
    }

    return ParseService;
  });

  app.controller("AddRoomController", function($scope, ParseService){
    this.newRoom = {};

    this.addNewRoom = function(rooms){
      this.newRoom.points = 0;
      
      ParseService.saveToParse(this.newRoom, function(results){
        $scope.$apply(function() {
          rooms.push(results);
          // console.log(results);
        });
      });

      this.newRoom = {};
    };
  });


  app.controller('VoteController', function($scope, ParseService){
    var voteCtrl = this;
    voteCtrl.rooms = [];

    // console.log($scope);
    ParseService.getRoomList(function(results){
      $scope.$apply(function() {
        voteCtrl.rooms = results;
        // console.log(voteCtrl.rooms[0]);
      });
    });

    voteCtrl.canRegister = function(reg){
      if (reg === 'true') {  return "可以"; } 
      else if (reg === 'false') {  return "不行"; }
      else {  return "未知"; }
    };

    voteCtrl.countPoints = function(vote, room){
      var newPoint = vote;
      if(room.points !== 0)
        newPoint = (vote + room.points)/2;

      ParseService.countPoints(newPoint, room);
      room.points = newPoint;
    };

    voteCtrl.delOffice = function(link) {
      ParseService.deleteOffice(link, function(results){
        $scope.$apply(function() {
          voteCtrl.rooms = results;
        });
      });
    };

    voteCtrl.showEditTraffic = function(room) {
      $('#showTraffic_'+room.objectId).hide();
      $('#editTraffic_'+room.objectId).show();
    };

    voteCtrl.editTraffic = function(room, traffic){
      // update room
      console.log("new traffic = "+traffic);
      ParseService.updateOffice(room.objectId, traffic);
      room.traffic = traffic;

      $('#editTraffic_'+room.objectId).hide();
      $('#showTraffic_'+room.objectId).show();
    }

    $scope.orderProp = 'points';
    $scope.changeOrder = function(order) {
      if ($scope.orderProp === order){
        $scope.orderProp = '-'+order;
      } else {
        $scope.orderProp = order;
      }
    };

    //$('#AddNewRoom').hide();
  });


function p(obj){
  var output = '';
  if (typeof(obj) === 'object'){
    for (var property in object) {
      output += property + ': ' + object[property]+'; ';
    }
  } else {
    output = obj;
  }

  console.log(output);
}

})();
