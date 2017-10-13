import Ember from 'ember';
import Errors from '../../constants/errors';
import ENV from 'albatross-web-app/config/environment';
const { inject: { service } } = Ember;


export default Ember.Controller.extend({

  currentUser: Ember.inject.service('current-user'),
  isEmpty: Ember.computed('model.actual', 'model.estimated', function () {
    return this.get('model.actual') === 0 && this.get('model.estimated') === 0;
  }),
  isShowingTogglModal: false,
  hasCategories: Ember.computed('model.categories', function () {
    return this.get('model.categories').content.length > 0;
  }),
  notifications: Ember.inject.service('notification-messages'),
  session: Ember.inject.service(),
  setupNotifications: function () {
    this.get('notifications').setDefaultClearDuration(1200);
  }.observes('notifications').on('init'),
  sortedCategories: Ember.computed.sort('model.categories', 'sortDefinition'),
  sortDefinition: ['createdAt'],

  segment: Ember.inject.service(),

  saveItem(item) {
    if (item.get('validations.isValid')) {
      item.save().then(() => {
        this.get('model').reload();
        this.get('store').findRecord('category', item.get('category.id'));
        this.get('notifications').success(item.get('description') + " saved successfully!", {
          cssClasses: 'notification',
          autoClear: true,
        });
        //this.get('segment').trackEvent('Updated an item', { projectId: this.get('model.id'), categoryID: item.get('category.id'), itemDescription: item.get('description'), itemEstimated: item.get('estimated'), itemActual: item.get('actual')});
      }).catch(() => {
        this.get('notifications').error("Failed to update item!", {
          cssClasses: 'notification error',
          autoClear: true,
        });
      });
    }
  },
  actions: {
    addNewCategory(categoryName, result) {
      const category = this.get('store').createRecord('category', {
        name: categoryName,
        project: this.get('model')
      });
      category.save()
        .then(() => {
          this.get('segment').trackEvent('Added a new category', { projectId: this.get('model.id'), categoryName: categoryName, categoryID: category.id });
          result.resolve()
        }).catch((response) => {
        category.rollbackAttributes();
        result.reject(Errors.mapResponseErrors(response))
      })
    },

    addNewItem(categoryId) {
      const category = this.get('store').peekRecord('category', categoryId);
      this.get('store').createRecord('item', {
        createdAt: new Date(),
        category: category
      });
      this.get('segment').trackEvent('Added a new item', { projectId: this.get('model.id'), categoryID: categoryId });
    },

    importTogglHours(result) {
      this.get('session')
        .authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
          const headers = {'Accept': 'application/vnd.api+json'};
          headers[headerName] = headerValue;
          Ember.$.ajax({
            url: `${ENV.host}/api/v1/projects/${this.get('model.id')}/update-actual-time/`,
            type: 'POST',
            headers: headers,
            contentType: 'application/vnd.api+json',
          }).then(() => {
            this.get('segment').trackEvent('Imported Toggl hours', { projectId: this.get('model.id'), projectName: this.get('model.name') });
            const model = this.get('model');
            model.reload();
            model.hasMany('categories').reload();
            this.get('notifications').success("Toggl hours imported successfully!", {
              cssClasses: 'notification',
              autoClear: true,
            });
            result.resolve();
          }).catch(() => {
            this.get('notifications').error("Toggl hours failed to import!", {
              cssClasses: 'notification error',
              autoClear: true,
            });
            result.reject();
          });
        });
    },
    onBufferChanged(value) {
      const model = this.get('model');
      if (!value) {
        value = 0;
      }
      model.set('buffer', parseInt(value));
      model.save()
        .then(() => {
          this.get('notifications').success("Buffer updated successfully!", {
            cssClasses: 'notification',
            autoClear: true,
          });
          this.get('segment').trackEvent('Updated buffer', { projectId: this.get('model.id'), projectName: this.get('model.name'), buffer: parseInt(value) });
        })
        .catch(() => {
          this.get('notifications').error("Buffer failed to update!", {
            cssClasses: 'notification error',
            autoClear: true,
          });
        });
    },
    saveActual(item, value) {
      if (!value) {
        value = 0;
      }
      item.set('actual', value);
      this.saveItem(item);
      this.get('segment').trackEvent('Updated an item actual', { projectId: this.get('model.id'), categoryID: item.get('category.id'), itemID: item.get('id'), itemDescription: item.get('description'), itemEstimated: item.get('estimated'), itemActual: item.get('actual')});
    },
    cancelSaveName(model) {
      model.rollbackAttributes()
    },
    saveCategoryName(model, result) {
      model.save().then(() => {
        result.resolve();
        this.get('segment').trackEvent('Updated category name', { projectId: this.get('model.id'), projectName: this.get('model.name') });
      }).catch((response) => {
        result.reject(response);
      });
    },
    saveProjectName(model, result) {
      model.save().then(() => {
        result.resolve();
        this.get('segment').trackEvent('Updated project name', { projectId: this.get('model.id'), projectName: this.get('model.name') });
      }).catch((response) => {
        result.reject(response);
      });
    },
    saveDescription(item, value) {
      item.set('description', value);
      this.saveItem(item);
      this.get('segment').trackEvent('Updated an item description', { projectId: this.get('model.id'), categoryID: item.get('category.id'), itemID: item.get('id'), itemDescription: item.get('description'), itemEstimated: item.get('estimated'), itemActual: item.get('actual')});
    },
    saveEstimated(item, value) {
      if (!value) {
        value = 0;
      }
      item.set('estimated', value);
      this.saveItem(item);
      this.get('segment').trackEvent('Updated an item estimated', { projectId: this.get('model.id'), categoryID: item.get('category.id'), itemID: item.get('id'), itemDescription: item.get('description'), itemEstimated: item.get('estimated'), itemActual: item.get('actual')});
    },
    deleteItem(item) {
      item.destroyRecord().then((response) => {
        this.get('notifications').success("Item deleted!", {
          cssClasses: 'notification',
          autoClear: true,
        });
        this.get('segment').trackEvent('Deleted an item', { itemId: this.get('model.id'), itemName: this.get('model.name') });
      }).catch((response) => {
        this.get('notifications').error("Error deleting item. Try again in a second.", {
          cssClasses: 'notification',
          autoClear: true,
        });
      });
    },
    toggleIsShowingTogglModal() {
      if (this.get('isShowingTogglModal')) {
        this.set('isShowingTogglModal', false);
      } else {
        const result = Ember.RSVP.defer();
        this.get('currentUser.user.profile').then((profile) => {
          const togglApiKey = profile.get('togglApiKey');
          if (togglApiKey || this.get('hasUpdatedToken')) {
            this.send('importTogglHours', result);
          } else {
            this.set('isShowingTogglModal', true);
            this.get('segment').trackEvent('Opened Toggl modal', { projectId: this.get('model.id'), projectName: this.get('model.name') });
            result.resolve('no key');
          }
        });
        return result.promise;
      }
    },

    updateTogglToken(token, result) {
      this.get('currentUser.user.profile').then((profile) => {
        let profileJson = profile.serialize();
        profileJson.data.id = profile.get('id');
        profileJson.data.attributes.toggl_api_key = token;
        this.get('session')
          .authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
            const headers = {'Accept': 'application/vnd.api+json'};
            headers[headerName] = headerValue;
            Ember.$.ajax({
              url: `${ENV.host}/api/v1/users/${this.get('currentUser.user.id')}/profile/`,
              type: 'PATCH',
              data: JSON.stringify(profileJson),
              headers: headers,
              contentType: 'application/vnd.api+json',
              dataType: 'json',
            }).then(() => {
              this.set('hasUpdatedToken', true);
              this.send('importTogglHours', result);
              this.get('segment').trackEvent('Updated Toggl API key', { projectId: this.get('model.id'), projectName: this.get('model.name'), togglAPIKey: token });
            }).catch(() => {
              this.get('notifications').error("Toggl hours failed to import!", {
                cssClasses: 'notification error',
                autoClear: true,
              });
              result.reject();
            })
          })
          }).catch(() => {
            this.get('notifications').error("Toggl hours failed to import!", {
              cssClasses: 'notification error',
              autoClear: true,
            });
            result.reject();
          }
        );
    }
  }
});

