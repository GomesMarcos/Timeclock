timeclock.controller('report', function report($scope, usersApi, clockApi, payperiodFactory, totaltimeFactory) {
    $scope.currentTimes = [];
    $scope.selectedDate = moment();
    $scope.startDate = "";
    $scope.endDate = "";

    var periodDates;

    //get the list of users
    usersApi.get(1).then(function(response) {
        $scope.users = response.data;
    });

    function getDates(date) {
        periodDates = payperiodFactory.periodDates(date);
        $scope.startDate = periodDates.firstWeekStart;
        $scope.endDate = periodDates.secondWeekEnd;
    }

    function getTimes(date) {
        var obj = {};
        obj.payperiodTotal = 0;
        clockApi.get($scope.currentUser, periodDates.firstWeekStart, periodDates.firstWeekEnd).then(function(response) {
            obj.firstWeekTotal = totaltimeFactory.getTotal(response.data);
            obj.payperiodTotal += obj.firstWeekTotal;
        });
        clockApi.get($scope.currentUser, periodDates.secondWeekStart, periodDates.secondWeekEnd).then(function(response) {
            obj.secondWeekTotal = totaltimeFactory.getTotal(response.data);
            obj.payperiodTotal += obj.secondWeekTotal;
        });
        return obj;
    }

    $scope.getTimes = function() {
        $scope.currentTimes = [];
        getDates($scope.selectedDate);
        angular.forEach($scope.users, function(value, key) {
            var obj = {};
            obj.payperiodTotal = 0;
            clockApi.get(value.id, periodDates.firstWeekStart, periodDates.firstWeekEnd).then(function(response) {
                obj.firstWeekTotal = totaltimeFactory.getTotal(response.data);
                obj.payperiodTotal += obj.firstWeekTotal;
                clockApi.get(value.id, periodDates.secondWeekStart, periodDates.secondWeekEnd).then(function(response) {

                    obj.secondWeekTotal = totaltimeFactory.getTotal(response.data);
                    obj.payperiodTotal += obj.secondWeekTotal;
                    $scope.currentTimes.push({"name":value.name, "times":obj});
                    console.log($scope.currentTimes);
                });
            });
        });
    };
});