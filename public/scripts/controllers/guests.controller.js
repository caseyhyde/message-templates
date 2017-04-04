app.controller('GuestsController', ['$location', '$http', '$mdDialog', 'MessageFactory', 'TimeService', '$interval', function($location, $http, $mdDialog, MessageFactory, TimeService, $interval) {
  console.log("Guests Controller running");

  var self = this;
  self.guests;
  self.company;
  self.time;

  $http({
    method: 'GET',
    url: '/guests'
  })
  .then((response) => {
    self.guests = response.data;
    self.company = MessageFactory.messageData.company;
    startTime();
    console.log(self.time);
  });

  self.generateMessage = (guest) => {
    console.log("Selected guest: ", guest);
    if(guest && self.company) {
      MessageFactory.setGuest(guest);
      MessageFactory.setTime(new Date, self.company.timezone);
      $mdDialog.show(
        $mdDialog.alert()
        .clickOutsideToClose(true)
        .title(
          'Message to send to ' + MessageFactory.messageData.guest.firstName +
          ' ' + MessageFactory.messageData.guest.lastName + ":"
        )
        .textContent(
          'Good ' + MessageFactory.messageData.time.getTimeOfDay() +
          ' ' + MessageFactory.messageData.guest.firstName + ', and welcome to ' +
          MessageFactory.messageData.company.company + '! Your room, ' +
          MessageFactory.messageData.guest.roomNumber + ' is ready for you now! ' +
          'Please enjoy your stay, and let us know if you need anything!'
        )
        .ok('Send!')
      );
    } else {
      alert("Please make sure you have a guest and company selected!");
    }
    console.log(self.company);
  };
  function startTime() {
    self.time = TimeService.createTimeObject(new Date, self.company.timezone);
    $interval(tick, 1000);
  }
  function tick() {
    self.time.timezoneTime += 1000;
  }
  self.backToCompany = () =>  $location.path('/companies');
}]);//End controller
