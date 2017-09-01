import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('forgot-password');
  this.route('signup');
  this.route('forgot-password-success');
  this.route('reset-password');
  this.route('reset-password-success');
  this.route('app', function() {
    this.route('projects');
    this.route('users');
    this.route('settings');
    this.route('project', {path: '/projects/:project_id'});
  });
  this.route('sandbox');
  this.route('register');
});

export default Router;
