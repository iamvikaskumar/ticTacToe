app.controller('homeController', function ($scope, socket) {
    var classSelect = { 'noughts': 'far fa-circle', 'crosses': 'fas fa-times' };

    $scope.name = '';
    $scope.turn = '';

    $scope.reset = function () {
        socket.emit('reset');
    };

    $scope.click = function (column) {
        if ($scope.name === $scope.turn && $scope.winner === "") {
            $scope.selected[column] = $scope.name;
            var turn = $scope.name == 'noughts' ? 'crosses' : 'noughts';
            socket.emit('click', { data: $scope.selected, turn: turn });
            $("#" + column + "> span").attr('class', classSelect[$scope.name] ? classSelect[$scope.name] : 'glyphicon glyphicon-remove');

            var result = checkStatus();
            if (result !== 'continue') {
                socket.emit('gameover', result);
            }
        }
    };

    socket.on('update', function (data) {
        $scope.selected = data.data;
        $scope.turn = data.turn;
        $scope.winner = data.winner;
        init();
    });

    var checkStatus = function () {
        if (
            $scope.selected['col-00'] !== "" &&
            (
                (($scope.selected['col-00'] === $scope.selected['col-01']) && ($scope.selected['col-00'] == $scope.selected['col-02'])) ||
                (($scope.selected['col-00'] === $scope.selected['col-10']) && ($scope.selected['col-00'] == $scope.selected['col-20'])) ||
                (($scope.selected['col-00'] === $scope.selected['col-11']) && ($scope.selected['col-00'] == $scope.selected['col-22']))
            )

        ) {
            console.log("WE have a winner !!!!!");
            return $scope.selected['col-00'];
        }

        else if (
            $scope.selected['col-22'] !== "" &&
            (
                (($scope.selected['col-22'] === $scope.selected['col-12']) && ($scope.selected['col-22'] == $scope.selected['col-02'])) ||
                (($scope.selected['col-22'] === $scope.selected['col-20']) && ($scope.selected['col-22'] == $scope.selected['col-21']))

            )

        ) {
            console.log("WE have a winner !!!!!");
            return $scope.selected['col-22'];
        }

        else if (
            $scope.selected['col-11'] !== "" &&
            (
                (($scope.selected['col-11'] === $scope.selected['col-01']) && ($scope.selected['col-11'] == $scope.selected['col-21'])) ||
                (($scope.selected['col-11'] === $scope.selected['col-20']) && ($scope.selected['col-11'] == $scope.selected['col-02'])) ||
                (($scope.selected['col-11'] === $scope.selected['col-10']) && ($scope.selected['col-11'] == $scope.selected['col-12']))

            )

        ) {
            console.log("WE have a winner !!!!!");
            return $scope.selected['col-11'];
        }

        else {
            var status = "draw";
            angular.forEach($scope.selected, function (value) {
                if (value === "") {
                    status = 'continue';
                }
            });

            return status;

        }
    };

    socket.on('assignPlayer', function (data) {
        $scope.name = data;
    });

    socket.on('init', function (data) {
        $scope.selected = data.data;
        $scope.turn = data.turn;
        $scope.winner = data.winner;
        init();
    });

    var init = function () {
        angular.forEach($scope.selected, function (value, key) {
            $("#" + key + "> span").attr('class', (value !== "") ? classSelect[value] : "");
        });
    };

});