/**
 * New node file
 */

app.controller('RouteCtrl', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
})

app
    .config(function($routeProvider, $locationProvider) {
	    $routeProvider
	        .when('/Book/:bookId', {
	          templateUrl : 'book.html',
	          controller : 'BookCtrl',
	          resolve : {
		          delay : function($q, $timeout) {
			          var delay = $q.defer();
			          $timeout(delay.resolve, 1000);
			          return delay.promise;
		          }
	          }
	        })
	        .when('/Book/:bookId/ch/:chapterId', {
	          templateUrl : 'chapter.html',
	          controller : 'ChapterCtrl'
	        })
	        
	        .when('/indicator', {
	          templateUrl : './pages/indicator/indicator.html',
	          controller : 'IndicatorCtrl'
	        })
	        
	        .when('/main', {
	          templateUrl : './pages/main.html',
	          controller : 'MainCtrl'
	        })
	        .when('/Highlights', {
	          templateUrl : './pages/highlights.html',
	          controller : 'HighlightsCtrl'
	        })
	        .when('/Freshmen', {
	          templateUrl : './pages/freshmen.html',
	          controller : 'FreshmenCtrl'
	        })
	        .when(
	            '/description/:root/category/:category/subcategory/:subcategory/subsubcategory/:subsubcategory/subsubsubcategory/:subsubsubcategory',
	            {
	              templateUrl : './pages/description.html',
	              controller : 'DescriptionCtrl'
	            })
	        .when(
	            '/description/:root/category/:category/subcategory/:subcategory/subsubcategory/:subsubcategory/subsubsubcategory/:subsubsubcategory/subsubsubsubcategory/:subsubsubsubcategory',
	            {
	              templateUrl : './pages/description.html',
	              controller : 'DescriptionCtrl'
	            })
	        .when('/aboutUnit', {
	          templateUrl : './pages/about-unit.html',
	          controller : 'AboutUnitCtrl'
	        })
	        .when('/goalOfUnit', {
	          templateUrl : './pages/goal-of-the-unit.html',
	          controller : 'GoalOfTheUnitCtrl'
	        })
	        .when('/data', {
	          templateUrl : './pages/category.html',
	          controller : 'CategoryCtrl'
	        })
	        .when('/data/category/:category', {
	          templateUrl : './pages/category.html',
	          controller : 'CategoryCtrl'
	        })
	        .when('/data/category/:category/subcategory/:subcategory', {
	          templateUrl : './pages/subcategory.html',
	          controller : 'SubcategoryCtrl'
	        })
	        .when(
	            '/data/category/:category/subcategory/:subcategory/subsubcategory/:subsubcategory',
	            {
	              templateUrl : './pages/subsubcategory.html',
	              controller : 'SubsubcategoryCtrl'

	            })
	        .when(
	            '/data/category/:category/subcategory/:subcategory/subsubcategory/:subsubcategory/subsubsubcategory/:subsubsubcategory',
	            {
	              templateUrl : './pages/subsubsubcategory.html',
	              controller : 'SubsubsubcategoryCtrl'
	            })

	        // QSR
	        .when(
	            '/data/category/:category/subcategory/:subcategory/subsubcategory2/:subsubcategory',
	            {
	              templateUrl : './pages/qsr-wok-publications/qsr-wok-publications.html',
	              controller : 'QSRWoKPublicationsCtrl'

	            })
	        .when(
	            '/data/category/:category/subcategory/:subcategory/subsubcategory3/:subsubcategory',
	            {
	              templateUrl : './pages/qsr-wok-document-type/qsr-wok-document-type.html',
	              controller : 'QSRWoKDocumentTypesCtrl'

	            })
	        .when(
	            '/data/category/:category/subcategory/:subcategory/subsubcategory4/:subsubcategory',
	            {
	              templateUrl : './pages/qsr-wok-research-area/qsr-wok-research-area.html',
	              controller : 'QSRWoKResearchAreasCtrl'
	            })

	        .when(
	            '/data/category/:category/subcategory/:subcategory/subsubcategory5/:subsubcategory',
	            {
	              templateUrl : './pages/qsr-wok-countries/qsr-wok-countries.html',
	              controller : 'QSRWoKCountriesCtrl'
	            })
	        .when(
	            '/data/category/:category/subcategory/:subcategory/subsubcategory6/:subsubcategory',
	            {
	              templateUrl : './pages/qsr-wok-institutions/qsr-wok-institutions.html',
	              controller : 'QSRWoKInstitutionsCtrl'
	            })
	        .when(
	            '/informationNotAvailable',
	            {
	              templateUrl : './pages/information-not-available/information-not-available.html',
	              controller : 'InformationNotAvailableCtrl'
	            })

	        .otherwise({
		        redirectTo : '/index.html'
	        });
	    // configure html5 to get links working on jsfiddle
	    // $locationProvider.html5Mode(true);
    });