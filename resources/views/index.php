<html lang="en" ng-app="cms" class="no-js">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Huddle</title>
  <base href="/"> <!-- Gets rid of /#/ in URL -->
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- CSS -->
  <link rel="stylesheet" href="assets/libs/bootstrap-css-only/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/app.css">
  <link rel="stylesheet" href="components/home/home.css">
  <link rel="stylesheet" href="components/conference/conference.css">

  <!-- LIBRARIES -->
  <script src="assets/libs/angular/angular.min.js"></script>
  <script src="assets/libs/angular-route/angular-route.min.js"></script>
  <script src="assets/libs/angular-animate/angular-animate.min.js"></script>
  <script src="assets/libs/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
  <script src="assets/libs/angular-resource/angular-resource.min.js"></script>
  <script src="assets/libs/satellizer/satellizer.min.js"></script>

  <!-- CONTROLLERS -->
  <script src="components/home/homeController.js"></script>
  <script src="components/admin/adminController.js"></script>
  <script src="components/userReg/userRegController.js"></script>
  <script src="components/conference/conferenceController.js"></script>

  <!-- SERVICES -->
  <script src="assets/js/conferenceService.js"></script>
  <script src="assets/js/mapService.js"></script>

  <!-- APP.JS -->
  <script src="app.js"></script>
</head>

<body>
  <div ng-include="'shared/header.html'"></div>
  <div class="has-header" ng-view></div>
</body>

</html>