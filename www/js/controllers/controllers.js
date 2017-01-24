'use strict';

angular.module('hotbookApp')

.controller('HeaderController', ['$scope', '$state', '$rootScope','ngDialog', 'AuthService', function ($scope, $state, $rootScope, ngDialog, AuthService) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
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
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])


.controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            // feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])


.controller('CategoryController', ['$scope', '$rootScope', 'Book', 'Category','$state', '$stateParams', function ($scope, $rootScope, Book, Category, $state, $stateParams) {
    var books = {};
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
   
    $scope.showMenu = false;
    $scope.message = "Loading ...";
    var category = Category.findById({id: $stateParams.id})
    .$promise.then(
        function (response) {
            $scope.categoryname = response.name;
         
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });



  //Querying all books from the category 
    Category.books({id: $stateParams.id})
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



.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthService.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {
    
    $scope.register={};
    $scope.loginData={};
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
    $scope.doRegister = function() {

        AuthService.register($scope.registration);
        
        ngDialog.close();

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

.controller('SidebarController', ['$scope', '$rootScope', 'Category', function ($scope, $rootScope, Category) {
     
    Category.find()
        .$promise.then(
        function (response) {
            $scope.categories = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    
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