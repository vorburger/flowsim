'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgMatch
 * @description
 * # fgMatch
 */
angular.module('flowsimUiApp')
  .directive('fgMatch', function (Protocols) {
    return {
      templateUrl: 'views/fgmatch.html',
      restrict: 'E',
      scope: {
        profiles: '=',
        config: '='
      },
      controller: function($scope) {

        // Get the underlying match set
        $scope.matches = $scope.config.get();
       
        // Initialize our control variables
        $scope.active = {
          protocols: [],
          protocol: '',
          fields: [],
          field: '',
          value: '',
          mask: '',
          type: null
        };

        // Grab the toplevel profiles
        $scope.enabledProfiles = _($scope.profiles.profiles).filter(
          function(profile) {
            return profile.enabled;
          });

        // Initialize based on root
        $scope.availableProfiles = _(_($scope.enabledProfiles).map(
          function(profile) {
            return profile.clone();
          })).filter(function(profile) {
            return _(Protocols.Root).indexOf(profile.protocol) != -1;
          });

        // Provide a unique array of strings for display
        $scope.updateProtocolsDisplay = function() {
          $scope.active.protocols = _(_($scope.availableProfiles).map(
            function(profile) { 
              return profile.protocol; 
            })).unique();
        };

        // Go through each active match and 
        _($scope.matches).each(function(match) {
        });

        // Update the protocol display list
        $scope.updateProtocolsDisplay();
          
        $scope.updateProtocol = function() {

          $scope.active.fields = _(_($scope.availableProfiles).filter(
            function(profile) {
              return profile.protocol === $scope.active.protocol;
            })).map(function(profile) {
              return profile.field;
            });

          // Clear the dependent properties
          $scope.active.field = '';
          $scope.active.value = '';
          $scope.active.mask  = '';
          $scope.active.type = null;
        };

        $scope.updateField = function() {

          $scope.active.type = _($scope.availableProfiles).find(
            function(profile) {
              return profile.protocol === $scope.active.protocol &&
                     profile.field === $scope.active.field;
            });

          // Clear the dependent properties
          $scope.active.value = '';
          $scope.active.mask  = '';
        }

        $scope.addMatch = function() {
          var match;

          // Value must be valid
          // If mask is present, then mask must be valid
          if($scope.active.value.length > 0 && 
             $scope.active.type.valueTest($scope.active.value) && 
             ($scope.active.mask.length === 0 || 
             (($scope.active.type.wildcardable && $scope.active.value === '0') ||
              ($scope.active.type.maskable && 
               $scope.active.type.maskTest($scope.active.mask))))) {

            // Construct the match
            match = $scope.active.type.mkType($scope.active.value, 
                                              $scope.active.mask);

            // Use the callback
            $scope.config.push(match);
          
            // Clear the dependent properties
            $scope.active.protocol = '';
            $scope.active.field    = '';
            $scope.active.value    = '';
            $scope.active.mask     = '';
            $scope.active.type     = null;
          }
        };

        $scope.popMatch = function() {
          $scope.config.pop();
        };
      }
    };
  });