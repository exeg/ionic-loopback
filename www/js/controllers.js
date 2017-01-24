angular.module('hotbookApp.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, AuthService) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.reservation = {};
    $scope.registration = {};
    $scope.loggedIn = false;
    
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    }
    
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

        AuthService.login($scope.loginData);

        $scope.closeLogin();
    };
    
    $scope.logOut = function() {
       AuthService.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
      
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });
    
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.reserveform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeReserve = function () {
        $scope.reserveform.hide();
    };

    // Open the login modal
    $scope.reserve = function () {
        $scope.reserveform.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doReserve = function () {
        console.log('Doing reservation', $scope.reservation);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeReserve();
        }, 1000);
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the login modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;

        AuthService.register($scope.registration);
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
       
    $rootScope.$on('registration:Successful', function () {
        $localStorage.storeObject('userinfo',$scope.loginData);
    })

  })
    
  /*  $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });
            $scope.registerform.show();
        };
        
          var pickoptions = {
              maximumImagesCount: 1,
              width: 100,
              height: 100,
              quality: 50
          };
        
        $scope.pickImage = function() {
          $cordovaImagePicker.getPictures(pickoptions)
              .then(function (results) {
                  for (var i = 0; i < results.length; i++) {
                      console.log('Image URI: ' + results[i]);
                      $scope.registration.imgSrc = results[0];
                  }
              }, function (error) {
                  // error getting photos
              });
        };
 
    });*/



.controller('BooksMenuController', ['$scope', '$rootScope', 'Book', function ($scope, $rootScope, Book) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
   
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    Book.find()
        .$promise.then(
        function (response) {
            $scope.books = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

   


    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

   
}])


.controller('HomeController', ['$scope', 'Book', 'Author', function ($scope, Book, Author) {
    $scope.showbestseller = false;
    $scope.message = "Loading ...";
    var bestsellers = Book.find({"filter":{"where":{
            "featured": true
        }}})
        .$promise.then(
            function (response) {
                $scope.bestsellers = response;
                $scope.showbestseller = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    var author = Author.findOne({"filter":{"where":{
            "name": "Kat Ross"
        }}})
        .$promise.then(
            function (response) {
                $scope.author = response;
                $scope.showbestseller = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
   
}])



.controller('BooksDetailController', ['$scope', '$rootScope', '$state', '$stateParams', 'Book', 'Comment', function ($scope, $rootScope, $state, $stateParams, Book, Comment) {

    $scope.book = {};
    $scope.showbook = false;
    $scope.message = "Loading ...";

    $scope.book = Book.findById({id: $stateParams.id})
        .$promise.then(
            function (response) {
                $scope.book = response;
                $scope.showBook = true;
            },
                
                
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );


        $scope.ToSponsor = function () {
        window.open($scope.book.url , '_system')


        }

    $scope.comments = Comment.find({bookId: $stateParams.id})
        .$promise.then(
            function (response) {
                $scope.comments = response;
            },
               
                
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );


    $scope.mycomment = {
        rating: 5,
        comment: "",
        bookId: $stateParams.id,
    };

    $scope.submitComment = function () {
        
        if ($rootScope.currentUser)
            $scope.mycomment.postedBy = $rootScope.currentUser.username;

        Comment.create($scope.mycomment);

        $state.go($state.current, {}, {reload: true});
        
        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            rating: 5,
            comment: "",
            bookId: $stateParams.id,
        };
    }
}]);
