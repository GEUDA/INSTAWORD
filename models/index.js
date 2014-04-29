var mongoose = require('mongoose')
  , uuid = require('node-uuid')
  ;

exports.init = function(host, db) {
  mongoose.connect('mongodb://' + host + '/' + db);
};

var Schema = mongoose.Schema;



/* Count */
var CountSchema = new Schema({
  name: { type: String, require: true },
  count: { type: Number, default: 0 }
});

CountSchema.static('getNewId', function(name, callback) {
  return this.collection.findAndModify(
      { name: name },
      [],
      { $inc: { count: 1 } },
      { new: true, upsert: true },
      callback
  );
});

exports.CountModel = mongoose.model('Count', CountSchema);



/* Document */
var DocumentSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    user_id: { type: Number, required: true },
    language: { type: String, default: 'unknown' },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});

exports.DocumentModel = mongoose.model('Document', DocumentSchema);
exports.document = require('./document');



/* favorite */
var FavoriteSchema = new Schema({
    target_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

exports.FavoriteModel = mongoose.model('Favorite', FavoriteSchema);
exports.favorite = require('./favorite');



/* view */
var ViewSchema = new Schema({
    target_id: { type: Schema.Types.ObjectId, required: true },
    count: { type: Number, default: 0 },
    user_list: { type: Array, required: true },
    updated_at: { type: Date, default: Date.now }
});

exports.ViewModel = mongoose.model('View', ViewSchema);
exports.view = require('./view');



/* getAuthCookie */
exports.getAuthCookie = function() {
  return uuid.v1();
}

/* User */
var UserSchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    email_address: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    authcookie: { type: String, required: true, default: exports.getAuthCookie },
    evernote_id: { type: String, default: null },
    evernote_expires: { type: Date, default: null },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});

exports.UserModel = mongoose.model('User', UserSchema);
exports.user = require('./user');



/* group */
var GroupSchema = new Schema({
    group_name: { type: String, required: true },
    user_id: { type: Number, required: true },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});

/* GroupMember */
var GroupMemberSchema = new Schema({
    target_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

/* GroupDocument */
var GroupDocumentSchema = new Schema({
    group_id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    user_id: { type: Number, required: true },
    language: { type: String, default: 'unknown' },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});

/* GroupFavorite */
var GroupFavoriteSchema = new Schema({
    group_id: { type: Schema.Types.ObjectId, required: true },
    target_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

exports.GroupModel = mongoose.model('Group', GroupSchema);
exports.GroupMemberModel = mongoose.model('GroupMember', GroupMemberSchema);
exports.GroupDocumentModel = mongoose.model('GroupDocument', GroupDocumentSchema);
exports.GroupFavoriteModel = mongoose.model('GroupFavorite', GroupFavoriteSchema);
exports.group = require('./group');
