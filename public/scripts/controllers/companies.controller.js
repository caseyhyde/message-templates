app.controller('CompaniesController', ['$location', '$http', 'MessageFactory', function($location, $http, MessageFactory) {
  console.log("Companies Controller running");

  var self = this;
  self.companies;

  $http({
    method: 'GET',
    url: '/companies'
  })
  .then((response) => {
    self.companies = response.data;
  });

  self.selectCompany = (company) => {
    console.log("You selected: ", company);
    MessageFactory.setCompany(company);
    $location.path('/guests');
  }

}]);//End controller
