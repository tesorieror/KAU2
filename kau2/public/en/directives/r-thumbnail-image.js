app.directive('rThumbnailImage', function() {
	return {
	  restrict : 'E',
	  templateUrl : 'directives/r-thumbnail-image.html',
	  controller : 'RThumbnailImageCtrl',
	  scope : {
	    image : '@',
	    href : '@',
	    title : '@',
	    description : '@'
	  },
	};
});

app.controller('RThumbnailImageCtrl', function($scope, $log) {
	$log.info('Loading Thumbnail Image Directive Controller');
});