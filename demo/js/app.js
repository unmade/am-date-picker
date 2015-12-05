angular
    .module('datepickerApp', [
        'ngMaterial',
        'am.date-picker',
    ])
    .controller('MainCtrl', ['$scope',
        function ($scope) {
            $scope.to = (new Date()).setDate(new Date().getDate() + 1);
            $scope.from = new Date('2015-11-05');
        }
    ]);
