//Parse JavaScript Key : fVd6fGuWnpkrGY2voBbS3jp8vDCmlplAKaPONWvX

(function() {
/*
  Parse.initialize("wvKilDh5ZK8ODgHaslQf7xBoiGnX2RWhMmC1GJfq", "fVd6fGuWnpkrGY2voBbS3jp8vDCmlplAKaPONWvX");

  var RoomObject = Parse.Object.extend("RoomObject");
  var p_room = new RoomObject();
  var p_query = new Parse.Query(RoomObject);
  var p_data = {};

  // $.fn.getRoomList = function(){
  function getRoomList(){
    p_room.fetch({
      success : function(data){
        p_data = data.toJSON();
      },
      error : function(roomObject, error){
        alert("Error: "+error.description);
      }
    });
  }

  //getRoomList();
  //console.log(p_data);

  function saveToParse(newRoom){
    p_room.set("link", newRoom.link);
    p_room.set("cost", newRoom.cost);
    p_room.set("bed", newRoom.bed);
    p_room.set("register", newRoom.register);
    p_room.set("points", newRoom.points);
    p_room.save(null, {
      success : function(room){
        alert("save success! need to refresh table, room id = "+room.id);
      },
      error : function(room, error){
        alert("Error: "+error.description);
      }
    });
  };

  var parse = angular.module('LocationVoteService', []);
  parse.factory('ParseService', function(){
    Parse.initialize("wvKilDh5ZK8ODgHaslQf7xBoiGnX2RWhMmC1GJfq", "fVd6fGuWnpkrGY2voBbS3jp8vDCmlplAKaPONWvX");

    var RoomObject = Parse.Object.extend("RoomObject");
    var p_room = new RoomObject();

    var ParseService = {
      name: "Parse",

      getRoomList : function getRoomList(callback){
        p_room.fetch({
          success : function(data){
            callback(data.toJSON());
          },
          error : function(error){
            alert("Error: "+error.description);
          }
        });
      },

      saveToParse : function saveToParse(newRoom, callback){
        p_room.set("link", newRoom.link);
        p_room.set("cost", newRoom.cost);
        p_room.set("bed", newRoom.bed);
        p_room.set("register", newRoom.register);
        p_room.set("points", newRoom.points);
        p_room.save(null, {
          success : function(room){
            alert("save success! need to refresh table, room id = "+room.id);
            //callback(room);
          },
          error : function(room, error){
            alert("Error: "+error.description);
          }
        });
      }
    }

    return ParseService;
  });
*/

  var app = angular.module('LocationVote', []);

  app.factory('ParseService', function(){
    Parse.initialize("wvKilDh5ZK8ODgHaslQf7xBoiGnX2RWhMmC1GJfq", "fVd6fGuWnpkrGY2voBbS3jp8vDCmlplAKaPONWvX");

    var RoomObject = Parse.Object.extend("RoomObject");
    var p_query = new Parse.Query(RoomObject);
    var p_room = new RoomObject();

    var ParseService = {
      name: "Parse",

      getRoomList : function getRoomList(callback){
        p_room.fetch({
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
        p_room.set("link", newRoom.link);
        p_room.set("cost", newRoom.cost);
        p_room.set("traffic", newRoom.traffic);
        p_room.set("bed", newRoom.bed);
        p_room.set("register", newRoom.register);
        p_room.set("points", newRoom.points);
        p_room.save(null, {
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
        console.log("I am ParseService, newPoint = "+newPoint);
        p_query.equalTo("traffic", room.traffic);
        p_query.find({
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
      });
    });

    this.canRegister = function(reg){
      if (reg === 'true') {  return "可以"; } 
      else if (reg === 'false') {  return "不行"; }
      else {  return "未知"; }
    };
    
    this.countPoints = function(vote, room){
      var newPoint = vote;
      if(room.points !== 0)
        newPoint = (vote + room.points)/2;

      ParseService.countPoints(newPoint, room);
      room.points = newPoint;
    };

  });

  var OfficeRooms = [
    {
      link: "http://www.google.com",
      cost: 23000,
      traffic: "信義安和站附近",
      bed: false,
      register: undefined,
      points: 0
    },
    {
      link: "http://www.591.com",
      cost: 21000,
      traffic: "中山國小站附近",
      bed: true,
      register: true,
      points: 0
    }
  ];
})();