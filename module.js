var R = require('ramda');

var joinItem = function(left, right, leftName, rightName) {
  var item = {};
  item[leftName] = left;
  item[rightName] = right;
  return item;
}

var doJoin = function(left, right, compare) {
  var result = [];
  for(var i = 0; i < left.length; i++) {
    for(var j = 0; j < right.length; j++) {
      if (compare(left[i], right[j])) {
        result.push({
          left: left[i],
          right: right[j]
        });
      }
    }
  }
  return result;
}

var join = R.curry(function(q, data) {
  var set = doJoin(data[q.from[0]], data[q.from[1]], q.where);
  var result = [];
  for( var i = 0; i < set.length; i++) {
    var item = R.clone(set[i].right);
    item[q.into] = set[i].left;
    result.push(item);
  }
  return result;
});

var find = R.curry(function(q, data) {
  return R.find(function(item) {
    return q.where(data, item);
  }, data[q.from]);
});

var wrap = function() {
  var args = Array.prototype.slice.call(arguments);
  var fn = args[0];
  var decorations = args.slice(1);
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    for (var i = 0; i < decorations.length; i++) {
      innerArgs[i] = decorations[i](innerArgs[i]);
    }
    return fn.apply(this, innerArgs);
  }
}

var derive = R.curry(function(field, transform, data) {
  return R.assoc(field, transform(data), data);
});

module.exports = {
  join: join,
  find: find,
  wrap: wrap,
  derive: derive
}
