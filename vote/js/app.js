(function() {
  var app = angular.module('LocationVote', []);
  app.controller('VoteController', function(){
    this.products = rooms;
    
    this.canRegister = function(reg){
      if (reg === true) {  return "可以"; } 
      else if (reg === false) {  return "不行"; }
      else {  return "未知"; }
    };
    
    this.countPoints = function(vote, room){
      if(room.points !== 0)
        room.points = (vote + room.points)/2;
      else
        room.points = vote;
    };
  });
  
  var rooms = [
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