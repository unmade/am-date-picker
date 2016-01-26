angular
    .module('datepickerApp', [
        'ngMaterial',
        'am.date-picker',
    ])
    .controller('MainCtrl', ['$scope',
        function ($scope) {
            $scope.to = (new Date()).setDate(new Date().getDate() + 1);
            $scope.from = new Date('2015-11-05');
            $scope.onChange = function(date) {
                console.log('date was changed to %s', date);
            };
            $scope.change = function() {
                $scope.date = new Date('2015-10-05');
            };
        }
    ]);
