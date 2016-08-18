import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { chai } from 'meteor/practicalmeteor:chai';
import { $ } from 'meteor/jquery';

import { Tasks } from './tasks.js';
import { Trucks } from './tasks.js';

//import { resetDatabase } from 'meteor/xolvio:cleaner';
//
//import faker from 'faker';
//
//import StubCollections from 'meteor/hwillson:stub-collections';
//import { Todos } from './tasks.js';


if(Meteor.isClient){
    describe("the home page", function(){
        it("finds the 'html' DOM attribute", function(){
            assert.equal($("html").length, 1);
        });

        it("finds the 'body' DOM attribute", function(){
            assert.equal($("body").length, 1);
        });

        it("finds the 'div' DOM attribute", function(){
            assert.isAbove($("div").length, 1);
        });
    });
}

if (Meteor.isServer) {


    describe('Array', function() {
        describe('#indexOf()', function() {
            it('should return -1 when the value is not present', function() {
                assert.equal(-1, [1,2,3].indexOf(4));
            });
        });
    });

    //StubCollections.stub(Todos);
    //
    //// Now Todos is stubbed to a simple local collection mock,
    ////   so for instance on the client we can do:
    //Todos.insert({ a: 'document' });
    //
    //// Restore the `Todos` collection
    //StubCollections.restore();
    //
    //Factory.define('todo', Todos, {
    //    listId: () => Factory.get('list'),
    //    text: () => faker.lorem.sentence(),
    //    createdAt: () => new Date(),
    //});


    //describe('Tasks', function () {
    //    beforeEach(function () {
    //        resetDatabase();
    //    });
    //});

    describe('Tasks', () => {
        describe('methods', () => {

            const userId = Random.id();
            let taskId;

            beforeEach(() => {

                Tasks.remove({});
                taskId = Tasks.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'tmeasday',
                });
            });


            it('can delete owned task', () => {
                // Find the internal implementation of the task method so we can
                // test it in isolation
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];

                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };

                // Run the method with `this` set to the fake invocation
                deleteTask.apply(invocation, [taskId]);

                // Verify that the method does what we expected
                assert.equal(Tasks.find().count(), 0);
            });
        });
    });

    describe('Trucks', () => {
        describe('methods', () => {

            const userId = Random.id();
            let taskId;

            beforeEach(() => {

                Trucks.remove({});
                taskId = Trucks.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'tmeasday',
                });
            });


            it('can delete owned task', () => {
                // Find the internal implementation of the task method so we can
                // test it in isolation
                const deleteTask = Meteor.server.method_handlers['trucks.remove'];

                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };

                // Run the method with `this` set to the fake invocation
                deleteTask.apply(invocation, [taskId]);

                // Verify that the method does what we expected
                assert.equal(Trucks.find().count(), 0);
            });


        });
    });

    describe('Trucks', () => {
        describe('methods', () => {

            it('can find information about a truck', () => {
                // Find the internal implementation of the task method so we can
                // test it in isolation
                const getTruckInfo = Meteor.server.method_handlers['getTruckInfo'];

                //// Set up a fake method invocation that looks like what the method expects
                //const invocation = { userId };
                //
                //// Run the method with `this` set to the fake invocation
                //getTruckInfo.apply(invocation, [taskId]);

                // Verify that the method does what we expected
                assert.equal(Trucks.findOne().length, 0);
            });
        });
    });
}