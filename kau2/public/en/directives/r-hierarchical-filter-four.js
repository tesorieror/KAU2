app.directive('rHierarchicalFilterFour', function() {
	return {
		restrict : 'E',
		templateUrl : 'directives/r-hierarchical-filter-four.html',
		controller : 'RHierarchicalFilterFourCtrl',
		scope : {
			data : '=',
			multiplicity : '='
		// period : '=',
		// fromChange : '&',
		// toChange : '&'
		},
	};
});  

app
		.controller('RHierarchicalFilterFourCtrl', 
				function($scope, $log) {
					$scope.data = {
						"Enrolled" : {
							"Gender" : {
								"Male" : [],
								"Female" : [],
								"Total" : []
							},
							"Nationality" : {
								"Saudi" : [ "Male", "Female", "Total" ],
								"Non-Saudi" : [ "Male", "Female", "Total" ],
							},
							"Degree" : {
								"Bachlore" : [ "Male", "Female", "Total" ],
								"Diplima" : [ "Male", "Female", "Total" ],
								"Higher Diploma" : [ "Male", "Female", "Total" ],
								"Master" : [ "Male", "Female", "Total" ],
								"PhD" : [ "Male", "Female", "Total" ],
							},
							"Field" : {
								"Education" : [ "Male", "Female", "Total" ],
								"Humanities and Arts" : [ "Male", "Female", "Total" ],
								"Social Sciences, Business and Law" : [ "Male", "Female",
										"Total" ],
								"Science" : [ "Male", "Female", "Total" ],
								"Engineering, Manufacturing Industries and Construction" : [
										"Male", "Female", "Total" ],
								"Agriculture" : [ "Male", "Female", "Total" ],
								"Health and Social Services" : [ "Male", "Female", "Total" ],
								"Not known programmes" : [ "Male", "Female", "Total" ],
							},
							"Administrative Areas" : {
								"Riyad" : [],
								"Makkah" : [],
								"Jazan" : [],
								"Eastern Province" : [],
								"Asir" : [],
								"Al-Qassim" : [],
								"Ha'il" : [],
								"Al-Madinah" : [],
								"Al-Baha" : [],
								"Northern Border" : [],
								"Tabuk" : [],
								"Najran" : [],
								"Al-Jawf" : []
							}
						},
						"Freshmen" : {
							"Gender" : {
								"Male" : [],
								"Female" : [],
								"Total" : []
							},
							"Nationality" : {
								"Saudi" : [ "Male", "Female", "Total" ],
								"Non-Saudi" : [ "Male", "Female", "Total" ],
							},
							"Degree" : {
								"Bachlore" : [ "Male", "Female", "Total" ],
								"Diplima" : [ "Male", "Female", "Total" ],
								"Higher Diploma" : [ "Male", "Female", "Total" ],
								"Master" : [ "Male", "Female", "Total" ],
								"PhD" : [ "Male", "Female", "Total" ],
							},
							"Field" : {
								"Education" : [ "Male", "Female", "Total" ],
								"Humanities and Arts" : [ "Male", "Female", "Total" ],
								"Social Sciences, Business and Law" : [ "Male", "Female",
										"Total" ],
								"Science" : [ "Male", "Female", "Total" ],
								"Engineering, Manufacturing Industries and Construction" : [
										"Male", "Female", "Total" ],
								"Agriculture" : [ "Male", "Female", "Total" ],
								"Health and Social Services" : [ "Male", "Female", "Total" ],
								"Not known programmes" : [ "Male", "Female", "Total" ],
							},
							"Administrative Areas" : {
								"Riyad" : [],
								"Makkah" : [],
								"Jazan" : [],
								"Eastern Province" : [],
								"Asir" : [],
								"Al-Qassim" : [],
								"Ha'il" : [],
								"Al-Madinah" : [],
								"Al-Baha" : [],
								"Northern Border" : [],
								"Tabuk" : [],
								"Najran" : [],
								"Al-Jawf" : []
							}
						},
						"Graduated" : {
							"Gender" : {
								"Male" : [],
								"Female" : [],
								"Total" : []
							},
							"Nationality" : {
								"Saudi" : [ "Male", "Female", "Total" ],
								"Non-Saudi" : [ "Male", "Female", "Total" ],
							},
							"Degree" : {
								"Bachlore" : [ "Male", "Female", "Total" ],
								"Diplima" : [ "Male", "Female", "Total" ],
								"Higher Diploma" : [ "Male", "Female", "Total" ],
								"Master" : [ "Male", "Female", "Total" ],
								"PhD" : [ "Male", "Female", "Total" ],
							},
							"Field" : {
								"Education" : [ "Male", "Female", "Total" ],
								"Humanities and Arts" : [ "Male", "Female", "Total" ],
								"Social Sciences, Business and Law" : [ "Male", "Female",
										"Total" ],
								"Science" : [ "Male", "Female", "Total" ],
								"Engineering, Manufacturing Industries and Construction" : [
										"Male", "Female", "Total" ],
								"Agriculture" : [ "Male", "Female", "Total" ],
								"Health and Social Services" : [ "Male", "Female", "Total" ],
								"Not known programmes" : [ "Male", "Female", "Total" ],
							},
							"Administrative Areas" : {
								"Riyad" : [],
								"Makkah" : [],
								"Jazan" : [],
								"Eastern Province" : [],
								"Asir" : [],
								"Al-Qassim" : [],
								"Ha'il" : [],
								"Al-Madinah" : [],
								"Al-Baha" : [],
								"Northern Border" : [],
								"Tabuk" : [],
								"Najran" : [],
								"Al-Jawf" : []
							}
						},
						"Aboard" : {}
					};

					$scope.selection = [];
					$scope.levels = [];

					$scope.levels[0] = Object.keys($scope.data);
					$scope.selection[0] = $scope.levels[0][0];

					$scope.levels[1] = Object.keys($scope.data[$scope.selection[0]]);
					// $scope.selection[1] = $scope.levels[1][0];
					$scope.selection[1] = $scope.levels[1][1];

					$scope.levels[2] = Object
							.keys($scope.data[$scope.selection[0]][$scope.selection[1]]);
					$scope.selection[2] = $scope.levels[2][0];

					$scope.levels[3] = $scope.data[$scope.selection[0]][$scope.selection[1]][$scope.selection[2]];
					$scope.selection[3] = $scope.levels[3][0];

//					$log.log('Levels ', $scope.levels);
//					$log.log('Selection ', $scope.selection);
					// $scope.selection[2] = {
					// "Saudi" : true,
					// "Non-Saudi" : true
					// };
					// $scope.selection[3] = {
					// "Male" : true,
					// "Female" : true,
					// "Total" : true
					// };

					// [ "Enrolled", "Nationality", "Saudi", null ];

					$scope.subcatSelected = function(subcat) {
//						$log.log('Subcat ', subcat);
					}
					$scope.subsubcatSelected = function(subsubcat) {
//						$log.log('Subcat ', subcat);
					}
					
					$scope.selectionChanged(){
						
					}
					
					
				});
