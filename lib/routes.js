
FlowRouter.route('/ftDashboard', {
    onBeforeAction: function () {
        Meteor.subscribe('trucks');
        Session.set('allTrucks', Trucks.find.fetch());
        this.next();
    },
    name:'ftDashboard',
    action: function() {

        BlazeLayout.render('ftDashboard');
    }
});

FlowRouter.route('/', {
    name:'tasks',
    action: function() {
        BlazeLayout.render('tasks');
    }
});//