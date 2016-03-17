angular
    .module('datepickerApp', [
        'ngMaterial',
        'am.date-picker',
    ])
    .controller('MainCtrl', ['$scope',
        function ($scope) {
            var today = new Date();
            $scope.to = new Date(today.setDate(today.getDate() + 1));
            $scope.from = new Date('2015-11-05');
            $scope.onChange = function(date) {
                console.log('date was changed to %s', date);
            };
            $scope.change = function() {
                $scope.date = new Date('2015-10-05');
            };
        }
    ]);
