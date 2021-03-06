angular.module('manageConferenceAttendeesCtrl', [])
.controller('manageConferenceAttendeesController', function($scope, ngTableParams, $stateParams, $filter, Conferences, popup, $uibModal, Guests) {

    // Conference ID
    $scope.conferenceId = $stateParams.conferenceId;

    $scope.statusRadio = '';
    $scope.flightRadio = false;

    console.log($scope.statusRadio);
    console.log($scope.flightRadio);

    $scope.csvData = [];

    //////// Load Data //////// 

    $scope.load = function() {
        console.log($scope.flightRadio);
        $scope.tableParams = new ngTableParams({
            filter: {
                'pivot.status': $scope.statusRadio
            },
            page: 1,
            count: 10
        }, {
            counts: [10, 20, 50],
            total: 0,
            getData: function($defer, params) {

                // organize filter as $filter understand it (graph object)
                var filters = {};
                angular.forEach(params.filter(), function(val, key) {
                    var filter = filters;
                    var parts = key.split('.');
                    for (var i = 0; i < parts.length; i++) {
                        if (i != parts.length - 1) {
                            filter[parts[i]] = {};
                            filter = filter[parts[i]];
                        } else {
                            filter[parts[i]] = val;
                        }
                    }
                })

                Conferences.attendees().query({ cid: $scope.conferenceId })
                    .$promise.then(function(response) {
                        if (response) {
                            $scope.data = response;

                            // filter with $filter (don't forget to inject it)
                            var filteredDatas =
                                params.filter() ?
                                $filter('filter')($scope.data, filters) :
                                $scope.data;

                            // ordering
                            var sorting = params.sorting();
                            var key = sorting ? Object.keys(sorting)[0] : null;
                            var orderedDatas = sorting ? $filter('orderBy')(filteredDatas, key, sorting[key] == 'desc') : filteredDatas;
                            var datas = orderedDatas.slice((params.page()-1)*params.count(), params.page()*params.count());

                            //console.log(JSON.stringify(orderedDatas));
                            params.total(orderedDatas.length);
                            $defer.resolve(datas);
                            $scope.setCSVData(orderedDatas);
                        } else {}
                    })

            }
        });
    }

    $scope.loadConferenceData = function() {
        Conferences.fetch().get({ cid: $stateParams.conferenceId })
            .$promise.then(function(response) {
                if (response) {
                    $scope.conference = response;
                    //console.log(response);
                } else {
                    popup.error('Error', response.message);
                }
            })
    };

    $scope.load();
    $scope.loadConferenceData();

    //////// Button Functions ////////

    var attend = function(id) {
        Conferences.attendees().update({ cid: $scope.conferenceId, pid: id }, { status: 'approved' })
            .$promise.then(function(response) {
                if (response.status == 200) {
                    console.log('Changes saved to profile_attends_conferences (approve)');
                    popup.alert('success', 'User has been approved!');
                    $scope.tableParams.reload();
                } else {
                    popup.error('Error', response.message);
                }
            })
    }

    $scope.approve = function(attendee) {
        if (attendee.pivot.arrv_ride_req || attendee.pivot.dept_ride_req || attendee.pivot.accommodation_req) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'components/manageAttendees/conferenceAttendeeModal.html',
                controller: 'conferenceAttendeeModalController',
                size: 'lg',
                resolve: {
                    conferenceId: function() {
                        return $stateParams.conferenceId;
                    },
                    preferences: function() {
                        return {
                            arrv_ride_req: attendee.pivot.arrv_ride_req,
                            dept_ride_req: attendee.pivot.dept_ride_req,
                            accommodation_req: attendee.pivot.accommodation_req,
                            accommodation_pref: attendee.pivot.accommodation_pref
                        }
                    }
                }
            })

            modalInstance.result.then(function(result) {
                if (result) {
                    if (result.arrivalVehicle) {
                        Conferences.passengers().save({ cid: $scope.conferenceId, vid: result.arrivalVehicle }, { profile_id: attendee.id })
                            .$promise.then(function(response) {
                                if (response.status != 200) {
                                    popup.error('Error', response.message);
                                    return false;
                                }
                            })
                    }
                    if (result.departureVehicle) {
                        Conferences.passengers().save({ cid: $scope.conferenceId, vid: result.departureVehicle }, { profile_id: attendee.id })
                            .$promise.then(function(response) {
                                if (response.status != 200) {
                                    popup.error('Error', response.message);
                                    return false;
                                }
                            })
                    }
                    if (result.room) {
                        Guests.save({ rid: result.room }, { profile_id: attendee.id })
                            .$promise.then(function(response) {
                                if (response.status != 200) {
                                    popup.error('Error', response.message);
                                    return false;
                                }
                            })
                    }
                    attend(attendee.id);
                }
            })
        } else {
            attend(attendee.id);
        }
        $scope.tableParams.reload();
    }

    $scope.deny = function(id) {

        Conferences.attendees().update({ cid: $scope.conferenceId, pid: id }, { status: 'denied' })
            .$promise.then(function(response) {
                if (response.status == 200) {
                    console.log('Changes saved to profile_attends_conferences (deny)');
                    popup.alert('success', 'User has been denied.');
                } else {
                    popup.error('Error', response.message);
                }
            })

        $scope.tableParams.reload();
    }

    $scope.setCSVData = function(data) {
        //console.log(JSON.stringify(data));
        $scope.csvData = [];
        var temp = {};
        angular.forEach(data, function(item) {
            angular.forEach(item, function(value, key) {
                if (key == "pivot") {
                    temp['status'] = value.status;
                } else if (key == "first_name" || key == "middle_name" || key == "last_name" ||
                    key == "birthdate" || key == "gender" || key == "email" || key == "phone" ||
                    key == "phone2") {
                    temp[key] = value;
                }
            });
            // console.log(JSON.stringify(temp));
            $scope.csvData.push(temp);
            temp = {}
        });
    }
});
