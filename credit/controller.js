function openCredit(success) {
    showDialog('/mfm-bank/credit/index.html', success, function ($scope) {

        $scope.pageIndex = 0
        function init(){
            get("/mfm-bank/quiz.json", function (text) {
                let levels = JSON.parse(text)
                $scope.questions = []
                for (const level of levels) {
                    $scope.questions.push(level.questions[Math.floor(Math.random() * level.questions.length)])
                    break
                }
                $scope.$apply()
            })
        }

        $scope.next = function () {
            setTimeout(function () {
                $scope.pageIndex++
                $scope.$apply()
            }, 500)
        }

        $scope.$watch('pageIndex', function (newValue, oldValue) {
            if (newValue == $scope.questions.length) {
                $scope.getRating()
            }
        })

        $scope.getRating = function () {
            postContract("mfm-bank", "rating.php", {
                address: wallet.address(),
                answers: JSON.stringify($scope.questions),
            }, function (response) {
                $scope.rating = response.rating
                $scope.percent = response.percent
                $scope.$apply()
            })
        }

        $scope.getCredit = function () {
            getPin(function (pin) {
                calcPass(wallet.address(), pin, function (pass) {
                    postContract("mfm-bank", "credit.php", {
                        address: wallet.address(),
                        pass: pass,
                        answers: JSON.stringify($scope.questions),
                    }, function (response) {
                        $scope.next()
                    })
                })

            })
        }

        init()
    })
}