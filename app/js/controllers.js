'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
controllers.controller('ProjectCtrl', function() {});

var WallCtrl = function($scope, $sce, $route, $http, $cookieStore, $timeout, $location, Post) {
	$scope.password = $cookieStore.get('password');
	$scope.posts = Post;
	var lastSaveIndex = 0;

	$scope.cancel = function() {
		$location.path('/wall');
	}

	$scope.html = function(html) {
		return $sce.trustAsHtml(html);
	}

	$scope.edit = function(post) {
		$location.path('/post/' + Post.get().indexOf(post));
	}
};
WallCtrl.$inject = ['$scope', '$sce', '$route', '$http', '$cookieStore', '$timeout', '$location', 'Post'];
controllers.controller('WallCtrl', WallCtrl);

var PostCtrl = function($scope, $sce, $route, $http, $cookieStore, $location, $routeParams, Post) {
	$scope.password = $cookieStore.get('password');

	var lastSaveIndex = 0;
	$scope.post = {
		content: '',
		backgroundColor: '#ffffff',
		color: '#000000',
		fontSize: '30',
		fontFamily: 'fantasy',
		timestamp: Date.now()
	};

	$scope.isNew = true;
	var editIndex;

	if ($routeParams.index) {
		editIndex = parseInt($routeParams.index);
		$scope.post = angular.copy(Post.get()[editIndex]);
		$scope.isNew = false;
	}

	$scope.add = function() {
		if ($scope.isNew) {
			Post.add($scope.post);
		} else {
			Post.edit($scope.post, editIndex);
		}
		$location.path('/wall');
	};

	$scope.cancel = function() {
		$location.path('/wall');
	}

	$scope.html = $sce.trustAsHtml;

	$scope.delete = function() {
		Post.delete(editIndex);
		$location.path('/wall');
	}

	$scope.save = function() {
		$http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($scope.password);
		Post.save(function() {
			$cookieStore.put('password', $scope.password);
			$location.path('/wall');
		}, function() {
			$scope.errorMessage = 'Wrong password';
			$scope.password = '';
		});
	}
};
PostCtrl.$inject = ['$scope', '$sce', '$route', '$http', '$cookieStore', '$location', '$routeParams', 'Post'];
controllers.controller('PostCtrl', PostCtrl);