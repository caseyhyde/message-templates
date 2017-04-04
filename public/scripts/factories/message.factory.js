app.factory('MessageFactory', ['TimeService', function(TimeService) {
  var messageData = {};

  class Guest {
    constructor(guest) {
      this.id = guest.id;
      this.firstName = guest.firstName;
      this.lastName = guest.lastName;
      this.roomNumber = guest.reservation.roomNumber;
      this.startTimestamp = guest.reservation.startTimestamp;
      this.endTimestamp = guest.reservation.endTimestamp;
    }
  };
  class Company {
    constructor(company) {
      this.id = company.id;
      this.company = company.company;
      this.city = company.city;
      this.timezone = company.timezone;
    }
  };
  class Message {
    constructor(company, guest, time) {
      this.company = company;
      this.guest = guest;
      this.time = time;
    }
  };
  function setCompany(company) {
    messageData.company = new Company(company);
  }
  function setGuest(guest) {
    messageData.guest = new Guest(guest);
  }
  function setTime(date, timezone) {
    messageData.time = TimeService.createTimeObject(date, timezone);
  }
  const messageApi = {
    setCompany: setCompany,
    setGuest: setGuest,
    setTime: setTime,
    messageData: messageData
  };
  return messageApi;
}]);//End factory
