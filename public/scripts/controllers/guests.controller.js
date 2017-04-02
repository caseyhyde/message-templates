app.controller('GuestsController', ['$location', function($location) {
  console.log("Guests Controller running");

  var self = this;

  self.company = function() {
    $location.path('/companies');
  }
}]);//End controller
