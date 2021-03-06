// Elasticsearch Query Builder Test

var elasticsearch_query = require('./elasticsearch_query.js');

notSupported = function(test, query) {
  test.ok(!elasticsearch_query.SupportedQueryString(query),
          "Shouldn't be supported: " + query);
};

// All the different query string queries types from
// http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/
// query-dsl-query-string-query.html#query-string-syntax
// that we don't want to support at this time for performance reasons.
exports.testSupportedQueryString_NotSupported = function(test) {
  // wildcard field
  notSupported(test, 'city.\*:something');
  notSupported(test, 'book.\*:(quick brown)');

  // wildcard
  notSupported(test, 'qu?ck bro*');

  // leading wildcard
  notSupported(test, '*ing');

  // regular expression
  notSupported(test, 'name:/joh?n(ath[oa]n)/');

  // fuzziness
  notSupported(test, 'quikc~ brwn~ foks~');

  // proximity
  notSupported(test, '"fox quick"~5');

  // -------------------------------------------------------------
  // We support most range queries except for those with wildcards.
  // These can be rewritten using a supported alternative syntax.

  // alternative: count:>=10
  notSupported(test, 'count:[10 TO *]');

  // alternative: date:<2012-01-01
  notSupported(test, 'date:{* TO 2012/01/01}');

  // alternative date:[2012-01-01 TO 2012-12-31]
  notSupported(test, 'date:[2012/01/01 TO 2012/12/31]');

  // -------------------------------------------------------------

  // boosting
  notSupported(test, 'quick^2 fox');

  notSupported(test, '"john smith"^2   (foo bar)^4');

  test.done();
};


supported = function(test, query) {
  test.ok(elasticsearch_query.SupportedQueryString(query),
          'Should be supported: ' + query);
};

// All the query string query types we want to support
exports.testSupportedQueryString_Supported = function(test) {
  supported(test, 'active');

  supported(test, 'status:active');

  supported(test, 'msg.status:active');

  supported(test, 'msg_status:active');

  supported(test, 'title:(quick brown)');

  supported(test, 'author:"John Smith"');

  // ranges
  supported(test, 'date:[2012-01-01 TO 2012-12-31]');
  supported(test, 'count:[1 TO 5]');
  supported(test, 'tag:{alpha TO omega}');
  supported(test, 'count:>=10');
  supported(test, 'date:<2012-01-01');

  // boolean operators
  supported(test, 'quick brown +fox -news');

  // missing check
  supported(test, '_missing_:title');

  // exist check
  supported(test, '_exists_:title');

  test.done();
};



