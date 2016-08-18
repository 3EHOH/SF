import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const BlogData = new Mongo.Collection('blogdata');

export const Trucks = new Mongo.Collection('trucks');

export const Tasks = new Mongo.Collection('tasks');

AvailServiceAreas = new Mongo.Collection('AvailServiceAreas');


AvailServiceAreasIndex = new EasySearch.Index({
    collection: Trucks,
    fields: ['address', 'fooditems', 'applicant'],
    engine: new EasySearch.MongoTextIndex(
        {
            sort: function() {
                return { 'address': 1, 'fooditems':1, 'applicant': 1};
            },
        }),
});

if (Meteor.isClient) {
    Meteor.startup(function() {
        GoogleMaps.load();
    });
}

if (Meteor.isServer) {
    // This code only runs on the server


    Meteor.publish('trucks', function trucksPublication() {
        return Trucks.find();
    });

    // Only publish tasks that are public or belong to the current user
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });

}


Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        // Make sure only the task owner can make a task private
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { private: setToPrivate } });
    },


    'trucks.insert'(text) {
        //check(text, String);
        //
        //// Make sure the user is logged in before inserting a task
        //if (! this.userId) {
        //    throw new Meteor.Error('not-authorized');
        //}

        Trucks.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },
    'trucks.remove'(taskId) {
        check(taskId, String);

        const task = Trucks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Trucks.remove(taskId);
    },
    'trucks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Trucks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'trucks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Trucks.findOne(taskId);

        // Make sure only the task owner can make a task private
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Trucks.update(taskId, { $set: { private: setToPrivate } });
    },

    'getTruckInfo'(id){

        //var idWrapped = new Meteor.ObjectID(id); // have to cast this due to the way IDs are stored
        //console.log(idWrapped);

        var currentTruck = Trucks.find({_id: id}).fetch();

        var applicant = currentTruck[0].applicant;
        console.log("applicant: " + applicant);

        var fooditems = currentTruck[0].fooditems;

        var address = currentTruck[0].address;

        var dayshours = currentTruck[0].dayshours;

        bootbox.dialog({
                title: "The Scoop on the Truck.",
                message:
                '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                        '<form class="form-horizontal"> ' +
                            '<div class="form-group"> ' +
                                '<label class="col-md-2 control-label" for="name">Name</label> ' +
                                '<div class="col-md-9"> ' +
                                    '<input readonly="readonly" type="text" value=" ' + applicant + '"  class="form-control input-md"> ' +
                                '</div> ' +
                            '</div>' +
                        '</form> ' +
                        '<form class="form-horizontal"> ' +
                            '<div class="form-group"> ' +
                                '<label class="col-md-2 control-label" for="name">Food</label> ' +
                                '<div class="col-md-9"> ' +
                                    '<input  readonly="readonly" type="text" value=" ' + fooditems + '" class="form-control input-md"> ' +
                                '</div> ' +
                            '</div>' +
                        '</form> ' +
                        '<form class="form-horizontal"> ' +
                            ' <div class="form-group"> ' +
                                '<label class="col-md-2 control-label" for="name">Loc.</label> ' +
                                '<div class="col-md-9"> ' +
                                    '<input  readonly="readonly" type="text" value=" ' + address + '" class="form-control input-md"> ' +
                                '</div> ' +
                            '</div>' +
                        '</form> ' +
                        '<form class="form-horizontal"> ' +
                            ' <div class="form-group"> ' +
                                '<label class="col-md-2 control-label" for="name">Sched.</label> ' +
                                '<div class="col-md-9"> ' +
                                    '<input  readonly="readonly" type="text" value=" ' + dayshours + '" class="form-control input-md"> ' +
                                '</div> ' +
                            '</div>' +
                        '</form> ' +
                    '</div>  ' +
                '</div>',
                buttons: {
                    success: {
                        label: "Yum!",
                        className: "btn-success",
                        callback: function () {
                            return true;
                        }
                    }
                }
            }
        );
    },

    aggregateGeoNear(lat, lng){
        var nearTrucks = Trucks.find({location: {$near: {$geometry:{ type: "Point", coordinates: [lat, lng]}, $maxDistance:5000}}}).fetch();
        console.log(nearTrucks);
        return nearTrucks;

    }
});