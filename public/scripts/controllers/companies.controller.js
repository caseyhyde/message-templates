app.controller('CompaniesController', ['$location', '$http', function($location, $http) {
  console.log("Companies Controller running");

  var self = this;

  self.companies;

  $http({
    method: 'GET',
    url: '/companies'
  })
  .then(function(response) {
    console.log(response);
    self.companies = response.data;
  });

  self.selectCompany = function(company) {
    console.log("You selected: ", company);
  }

}]);//End controller
