let cheerio = require('cheerio');
let jsdom = require('jsdom').jsdom;
let jquery = require('jquery');

let test = require('./get-test')(module);
let spliceChars = require('../src/index');

test('spliceChars exports something', function(assert) {
  assert.equal(typeof spliceChars, `function`, `spliceChars function exists`);
  assert.end();
});

test('spliceChars splices chars with cheerio', function(assert) {
  let $ = cheerio.load('<html><body></body></html>');
  $('body').append(`<h1>123456789</h1>`);
  spliceChars($, $('h1'), 2, 0);
  assert.equal(
    $.html('h1'),
    `<h1>123456789</h1>`
  );
  spliceChars($, $('h1'), 1, 4, 'foo', 'bar');
  assert.equal(
    $.html('h1'),
    `<h1>1foobar6789</h1>`
  );

  $('body').append(`<h2><s>12</s><u><sub><i>3<sup>4</sup></i></sub>56</u>789</h2>`);
  spliceChars($, $('h2'), 0, 4, $(`<span>hi</span>`));
  assert.equal(
    $.html('h2'),
    `<h2><s><span>hi</span></s><u>56</u>789</h2>`
  );

  $('body').append(`<h3><a>1<b>2<c>3<d>4<e>5<f>6</f>7</e>8</d>9</c></b></a></h3>`);
  spliceChars($, $('h3'), 1, 4, $(`<span>hi</span>`));
  assert.equal(
    $.html('h3'),
    `<h3><a>1<b><span>hi</span><c><d><e><f>6</f>7</e>8</d>9</c></b></a></h3>`
  );

  $('body').append(`<h4>123456789</h4>`);
  spliceChars($, $('h4'), 2, 0, 'inserted at two');
  assert.equal(
    $.html('h4'),
    `<h4>12inserted at two3456789</h4>`
  );
  assert.end();
});

test('spliceChars splices chars with jquery', function(assert) {
  let dom = jsdom('<html><body></body></html>');
  let $ = jquery(dom.defaultView);

  let $el = $($.parseHTML(`<div>123456789</div>`));
  spliceChars($, $el, 0, 4, 'foo');
  assert.equal(
    $el.html(),
    `foo56789`
  );

  $el = $($.parseHTML(`<div><s>12</s><u>3456</u>789</div>`));
  spliceChars($, $el, 0, 4, $(`<span>hi</span>`), $(`<span>there</span>`));
  assert.equal(
    $el.html(),
    `<s><span>hi</span><span>there</span></s><u>56</u>789`
  );

  $el = $($.parseHTML(`<div><a>1<b>2<c>3<d>4<e>5<f>6</f>7</e>8</d>9</c></b></a></div>`));
  spliceChars($, $el, 2, 4, $(`<span>hi</span>`));
  assert.equal(
    $el.html(),
    `<a>1<b>2<c><span>hi</span><d><e>7</e>8</d>9</c></b></a>`
  );

  assert.end();
});
