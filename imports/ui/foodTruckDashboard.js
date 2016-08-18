import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { Trucks } from '../api/tasks.js';
//import { Tasks } from '../api/tasks.js';
//import { Random } from 'meteor/random';
//import { assert } from 'meteor/practicalmeteor:chai';


import './foodTruckDashboard.html';

Session.setDefault('searchQuerying', false);

if (Meteor.isClient) {

    describe("the home page", function(){
        it("shows the 'Search Text' button", function(){
            assert.equal($("#searchText").length, 1);
        })
    });

    Meteor.startup(function() {
        GoogleMaps.load();
    });
}


Template.ftDashboard.onCreated(function bodyOnCreated() {

    this.state = new ReactiveDict();

    Meteor.subscribe('trucks', function(){

        // We can use the `ready` callback to interact with the map API once the map is ready.
        GoogleMaps.ready('exampleMap', function(map) {

            var results = Trucks.find({}, {latitude:true, longitude: true, _id:true}).fetch();

            console.log(results.length);

            results.forEach(function (x) {

                var myLatLng = new google.maps.LatLng(x.latitude, x.longitude);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map.instance,
                    //title: "ZIP: " + x._id + ", # Leads: " + x.count,
                    icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });

                marker.addListener('click', function() {

                    Meteor.call('getTruckInfo', x._id);
                });

            });
        });

    });

});

//Template.ftDashboard.onRendered(function() {
//    GoogleMaps.load({ v: '3', key: 'AIzaSyCWwUO_Ife-Fyfpxuj-Y3KdD8HblmF4Wfk', libraries: 'geometry,places' });
//});


Template.ftDashboard.helpers({

    exampleMapOptions: function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(37.773972, -122.431297),
                zoom: 12
            };
        }

    },

    'searchQuerying':function(){
        return Session.get('searchQuerying');
    },

    'easySearchData':function(){
        if(Session.get('easySearchQuery').trim() == ""){
            Session.set('easySearchQuery', null);
            Session.set('searchQuerying', false);
        }
        Session.set('easySearchResults', AvailServiceAreasIndex.search(Session.get('easySearchQuery'), {limit:500}).fetch());
        //EasySearch default limits to 10. So, 500 will handle anything.

        return Session.get('easySearchResults');
    },
});


Template.ftDashboard.events({

    'click .searchLatLng':function() {

        bootbox.dialog({
                title: "Find That Truck!",
                message:
                '<div class="row">  ' +
                '<div class="col-md-12"> ' +
                '<form class="form-horizontal"> ' +
                '<div class="form-group"> ' +
                '<label class="col-md-2 control-label" for="name">Latitude</label> ' +
                '<div class="col-md-9"> ' +
                '<input id="lat" type="text" placeholder="37.773972"  class="form-control input-md"> ' +
                '</div> ' +
                '</div>' +
                '</form> ' +
                '<form class="form-horizontal"> ' +
                '<div class="form-group"> ' +
                '<label class="col-md-2 control-label" for="name">Longitude</label> ' +
                '<div class="col-md-9"> ' +
                '<input id="lng" placeholder="-122.431297" type="text" class="form-control input-md"> ' +
                '</div> ' +
                '</div>' +
                '</form> ' +
                '</div>  ' +
                '</div>',
                buttons: {
                    success: {
                        label: "Find It!",
                        className: "btn-success",
                        callback: function () {
                            var lat = $("#lat").val().trim();
                            var lng = $("#lng").val().trim();

                            var nearTrucks = Trucks.find({location: {$near: {$geometry:{ type: "Point", coordinates: [lat, lng]}, $maxDistance:70}}}).fetch();
                            console.log(nearTrucks);

                            GoogleMaps.ready('exampleMap', function(map) {

                                //map.setCenter(new google.maps.LatLng(lat, lng));
                                map.setZoom(15);

                                nearTrucks.forEach(function (x) {

                                    console.log(x._id);

                                    var myLatLng = new google.maps.LatLng(x.latitude, x.longitude);
                                    var marker = new google.maps.Marker({
                                        position: myLatLng,
                                        map: map.instance,
                                        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                    });

                                });
                            });
                        }
                    },

                    cancel: {
                        label: "Cancel",
                        className: "btn-warning",
                        callback: function () {
                            return true;
                        }
                    }
                }
            }
        );
    },

    'click .openNav'(){
        document.getElementById("mySidenav").style.width = "250px";
    },

    'click .closebtn'(){
        document.getElementById("mySidenav").style.width = "0";
    },

    'keyup .searchText':function(evt,tmpl) {
        var text = $('.searchText').val();
        //RSSDataIndex.remove();
        console.log(text);
        Session.set('easySearchQuery', String(text));
        if(Session.get('easySearchQuery') != ""){
            Session.set('searchQuerying', true);
        } else {
            Session.set('searchQuerying', true);
        }

    },
    'change .searchText':function(evt,tmpl) {
        var text = $('.searchText').val();
        //RSSDataIndex.remove();
        console.log(text);
        Session.set('easySearchQuery',  String(text));
        if(Session.get('easySearchQuery') != ""){
            Session.set('searchQuerying', true);
        } else {
            Session.set('searchQuerying', true);
        }
    },

    'click .searchTextBtn':function(evt){
        var truckID = evt.target.getAttribute("id");
        var truckIDObject = new Mongo.ObjectID(truckID);
        Meteor.call('getTruckInfo', truckIDObject);
    }
});


