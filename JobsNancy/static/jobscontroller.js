var jobssample = angular.module('jobssample', ['ui.bootstrap.dialog'] , function($dialogProvider){
    $dialogProvider.options({backdropClick: true, modalFade: true});
});

function JobInfoDialogController($scope, dialog, item) {
    $scope.job = item;

    $scope.close = function (result) {
        dialog.close(result);
    };
}

function JobsCtrl($scope, $http, $dialog) {
    $scope.jobs = [];

    $scope.fetch = function () {
        $http.get('jobs').success(function (data) {
            $scope.jobs = data;
        });
    };

    $scope.delete = function (id) {
        $http.delete('jobs/' + id).then($scope.fetch);
    };

    $scope.infoAt = function (index) {
        var item = $scope.jobs[index];
        var d = $dialog.dialog({resolve: { item: item } });
        d.open('static/detail.html', 'JobInfoDialogController');
    };

    $scope.fetch();
};
//JobsCtrl.$inject = ['$scope', '$http'];