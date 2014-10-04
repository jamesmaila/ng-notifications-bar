(function (window, angular) {
	var module = angular.module('ngNotificationsBar', []);

	module.provider('notificationsConfig', function () {
		var config = {};

		this.setHideTimeout = function (hide) {
			config['hideTimeout'] = hide;
		};

		this.$get = function () {
			return {
			};
		};
	});

	module.factory('notifications', ['$rootScope', function ($rootScope) {
		var showError = function (message) {
			$rootScope.$broadcast('notifications:error', message);
		};

		var showWarning = function (message) {
			$rootScope.$broadcast('notifications:warning', message);
		};

		var showSuccess = function (message) {
			$rootScope.$broadcast('notifications:success', message);
		};

		return {
			showError: showError,
			showWarning: showWarning,
			showSuccess: showSuccess
		};
	}]);

	module.directive('notificationsBar', function (notificationsConfig, $timeout) {
		return {
			restrict: 'EA',
			template: '\
				<div class="container">\
					<div class="{{note.type}}" ng-repeat="note in notifications">\
						<span class="message">{{note.message}}</span>\
						<span class="glyphicon glyphicon-remove close-click" ng-click="close($index)"></span>\
					</div>\
				</div>\
			',
			link: function (scope) {
				var notifications = scope.notifications = [];
				var timers = [];
				var defaultTimeout = 3000;

				var notificationHandler = function (event, data, type) {
					var message, hide;

					if (typeof data === 'object') {
						message = data.message;
						hide = data.hide;
					} else {
						message = data;
					}

					var index = notifications.push({type: type, message: message});

					if (hide) {
						var timer = $timeout(function () {
							// TODO: apply the animation
							// remove notification
							notifications.splice(index - 1, 1);
							// clear timeout
							$timeout.cancel(timer);
						}, defaultTimeout);
					}
				};

				scope.$on('notifications:error', function (event, data) {
					notificationHandler(event, data, 'error');
				});

				scope.$on('notifications:warning', function (event, data) {
					notificationHandler(event, data, 'warning');
				});

				scope.$on('notifications:success', function (event, data) {
					notificationHandler(event, data, 'success');
				});

				scope.close = function (index) {
					notifications.splice(index, 1);
				};
			}
		};
	});

})(window, angular);
