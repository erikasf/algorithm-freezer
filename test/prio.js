var _    = require('../vendor/underscore.js')
  , jsc  = require('../vendor/jscheck.js')
  , load = require('./helper/load.js');

function fuzz() {
  return jsc.array(jsc.integer(0, 20), jsc.integer(-10, 10));
}

jsc.on_report(console.log);

_.each(load.submissions('prio'), function (impl, author) {
  jsc.clear();
  jsc.detail(1);

  console.log("**************************************");
  console.log("Testing priority queue implementation:", author);

  jsc.claim('Finds minimum from creation',
    function (verdict, vals) {
      var q = impl.fromArray(vals)
        , min = _.min(vals);
      return verdict( _.isEqual(impl.min(q), min) );
    },
    fuzz()
  );

  jsc.claim('Removing all but one leaves the max behind',
    function (verdict, vals) {
      var q = impl.fromArray(vals)
        , max = _.max(vals);
      for(var i = 0; i < vals.length - 1; i++) {
        q = impl.remove_min(q);
      }
      return verdict( _.isEqual(
        impl.min(q),
        vals.length > 0 ? max : Infinity
      ));
    },
    fuzz()
  );

  jsc.claim('It is possible to completely empty the queue',
    function (verdict, vals) {
      var q = impl.fromArray(vals)
      for(var i = 0; i < vals.length; i++) {
        q = impl.remove_min(q);
      }
      return verdict( impl.isEmpty(q) );
    },
    fuzz()
  );

  jsc.claim('Finds minimum inserted after creation',
    function (verdict, vals) {
      var q = impl.fromArray(vals);
      q = impl.insert(q, -100);
      return verdict( _.isEqual(impl.min(q), -100) );
    },
    fuzz()
  );

  jsc.check();
});

