app.controller('CompaniesController', ['$location', '$http', 'MessageFactory', function($location, $http, MessageFactory) {
  console.log("Companies Controller running");

  var self = this;

  self.companies;

  $http({
    method: 'GET',
    url: '/companies'
  })
  .then(function(response) {
    self.companies = response.data;
  });

  self.selectCompany = function(company) {
    console.log("You selected: ", company);
  }

}]);//End controller
