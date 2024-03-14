/*eslint-env node, mocha */
/*eslint no-unused-expressions:0 */

import * as ObjectUtils from './object-utils';

describe('objects helper', function() {

	const o = {
		a: 'Aye',
		b: 'Bee',
		c: {
			c1: 'Cee',
		},
		d: new Date('2015-02-01T05:00:00.000Z'),
		e: 123,
		f: true,
	};
	const arr = [
		'foo',
		{ bar: 'baz' },
	];

	describe('createKeyedObjectCache', function() {
		it('should create a cache', function() {
			const cache = ObjectUtils.createKeyedObjectCache();
			cache.should.be.ok;
			cache.should.be.an('object');
		});
		it('should return an empty object for new keys', function() {
			const cache = ObjectUtils.createKeyedObjectCache();
			const v = cache.get('new-value');
			v.should.be.ok;
			v.should.be.an('object');
			v.should.eql({});
		});
		it('should return the same object on subsequent calls', function() {
			const cache = ObjectUtils.createKeyedObjectCache();
			const v = cache.get('new-value');
			v.test = 'hello';
			v.test.should.equal('hello');
			const v2 = cache.get('new-value');
			v2.should.equal(v);
			v2.test.should.equal('hello');
		});
	});

	describe('createQueryFilter', function() {

		it('should allow functions that return string', function() {
			let test = 'invalid';
			const fn = function() { return test; };
			const filter = ObjectUtils.createQueryFilter({ $: fn });

			filter(o).should.be.false;
			filter(arr).should.be.false;
			arr.filter(filter).length.should.eql(0);

			test = 'Aye';
			filter(o).should.be.true;
			filter(arr).should.be.false;
			arr.filter(filter).length.should.eql(0);

			test = 'baz';
			filter(o).should.be.false;
			filter(arr).should.be.true;
			arr.filter(filter).length.should.eql(1);
		});

		describe('Circular references', function() {
			const arrWithCircRef = [
				{
					a: {
						text: 'foo',
						b: {
							text: 'bar',
						},
					},
				},
				{
					c: {
						text: 'baz',
					},
				},
				{
					d: {
						text: 'bop',
					},
				},
			];
			arrWithCircRef[0].a.b.a = arrWithCircRef.a;
			arrWithCircRef[1].c.d = arrWithCircRef[2];
			arrWithCircRef[2].d.c = arrWithCircRef[1];

			it('should handle circular refs (match)', function() {
				let filter = ObjectUtils.createQueryFilter({ $: 'foo' });
				arrWithCircRef.filter(filter).length.should.eql(1);
				filter = ObjectUtils.createQueryFilter({ $: 'baz' });
				arrWithCircRef.filter(filter).length.should.eql(2);
			});

			it('should handle circular refs (fail)', function() {
				const filter = ObjectUtils.createQueryFilter({ $: 'invalid' });
				arrWithCircRef.filter(filter).length.should.eql(0);
			});
		})

	});

	describe('query', function() {

		describe('error checking', function() {

			it('should return true for empty queries', function() {
				ObjectUtils.query(null, o).should.be.true;
				ObjectUtils.query(undefined, o).should.be.true;
				ObjectUtils.query('', o).should.be.true;
			});

			it('should return false for empty objects', function() {
				ObjectUtils.query('foo').should.be.false;
				ObjectUtils.query('foo', null).should.be.false;
			});
		});

		describe('simple string queries', function() {
			it('should find objects that match', function() {
				ObjectUtils.query('Aye', o).should.be.true;
				ObjectUtils.query('Cee', o).should.be.true;
				ObjectUtils.query('foo', arr).should.be.true;
				ObjectUtils.query('baz', arr).should.be.true;
			});
			it('should be case insensitive', function() {
				ObjectUtils.query('AYE', o).should.be.true;
				ObjectUtils.query('CEE', o).should.be.true;
			});
			it('should match partials', function() {
				ObjectUtils.query('ay', o).should.be.true;
				ObjectUtils.query('EE', o).should.be.true;
			});
			it('should coerce primitives and dates to strings', function() {
				ObjectUtils.query('2015', o).should.be.true;
				ObjectUtils.query('123', o).should.be.true;
				ObjectUtils.query(123, o).should.be.true;
				ObjectUtils.query(true, o).should.be.true;
			});
			it('should return false with no match', function() {
				ObjectUtils.query('Zee', o).should.be.false;
				ObjectUtils.query('No Match', o).should.be.false;
				ObjectUtils.query('Aye', arr).should.be.false;
			});
			it('should not match on keys', function() {
				ObjectUtils.query('bar', arr).should.be.false;
			});
		});

		describe('advanced queries', function() {
			it('should allow custom regexes', function() {
				ObjectUtils.query(/[bB]e+/, o).should.be.true;
				ObjectUtils.query(/[bB]e+/, arr).should.be.false;
				ObjectUtils.query({ $: /[bB]e+/ }, o).should.be.true;
				ObjectUtils.query({ $: /[bB]e+/ }, arr).should.be.false;
			});

			it('should allow custom functions', function() {
				const exactlyTrue = function(v) { return v === true; };
				ObjectUtils.query({ $: exactlyTrue }, o).should.be.true;
				ObjectUtils.query(exactlyTrue, arr).should.be.false;
			});

			it('should allow functions that return string', function() {
				let test = 'invalid';
				const fn = function() { return test; };
				ObjectUtils.query({ $: fn }, o).should.be.false;
				ObjectUtils.query({ $: fn }, arr).should.be.false;

				test = 'Aye';
				ObjectUtils.query({ $: fn }, o).should.be.true;
				ObjectUtils.query({ $: fn }, arr).should.be.false;

				test = 'foo';
				ObjectUtils.query({ $: fn }, o).should.be.false;
				ObjectUtils.query(fn, arr).should.be.true;
				test = 'baz';
				ObjectUtils.query({ $: fn }, arr).should.be.true;
			});

			describe('Array matches', function() {
				const oWithArray = {
					a: [1, 2, 3],
				};
				it('should allow empty queries', function() {
					ObjectUtils.query({ a: '' }, oWithArray).should.be.true;
				})
				it('should handle strict matches', function() {
					ObjectUtils.query({ a: [1, 2] }, oWithArray).should.be.true;
					ObjectUtils.query({ a: [1, 4] }, oWithArray).should.be.false;
				});
				it('should handle partial matches', function() {
					ObjectUtils.query({ '~a': [1, 4] }, oWithArray).should.be.true;
					ObjectUtils.query({ '~a': [4] }, oWithArray).should.be.false;
				});
			});

			describe('Deep array matches', function() {
				const oWithArray = {
					a: [{ id: 1 }, { id: 2 }, { id: 3 }],
				};
				it('should allow empty queries', function() {
					ObjectUtils.query({ a: '' }, oWithArray).should.be.true;
					ObjectUtils.query({ a: [''] }, oWithArray).should.be.true;
					ObjectUtils.query({ a: [{ id: '' }] }, oWithArray).should.be.true;
				});
				it('should handle strict matches', function() {
					ObjectUtils.query({ a: [{ id: 1 }, { id: 2 }] }, oWithArray).should.be.true;
					ObjectUtils.query({ a: [{ id: 1 }, { id: 4 }] }, oWithArray).should.be.false;
				});
				it('should handle partial matches', function() {
					ObjectUtils.query({ '~a': [{ id: 1 }, { id: 4 }] }, oWithArray).should.be.true;
					ObjectUtils.query({ '~a': [{ id: 4 }] }, oWithArray).should.be.false;
				});
			});

			describe('Empty array matches', function() {
				const oWithArray = {
					a: [],
				};
				it('should allow empty queries', function() {
					ObjectUtils.query({ a: '' }, oWithArray).should.be.true;
				});
				it('should allow empty array queries', function() {
					ObjectUtils.query({ a: [] }, oWithArray).should.be.true;
				});
				it('should not be included when expected array is not empty', function() {
					ObjectUtils.query({ a: [1] }, oWithArray).should.be.false;
				});
				it('should handle partial matches', function() {
					ObjectUtils.query({ '~a': [] }, oWithArray).should.be.true;
					ObjectUtils.query({ '~a': [4] }, oWithArray).should.be.false;
				});
			});

			describe('Circular references', function() {
				const oWithCircRef = {
					a: {
						text: 'foo',
						b: {
							text: 'bar',
						},
					},
				};
				oWithCircRef.a.b.a = oWithCircRef.a;

				it('should handle circular refs (match)', function() {
					ObjectUtils.query({ $: 'foo' }, oWithCircRef).should.be.true;
					ObjectUtils.query({ $: 'bar' }, oWithCircRef).should.be.true;
					ObjectUtils.query({ a: { b: { text: 'bar' } } }, oWithCircRef).should.be.true;
				});

				it('should handle circular refs (fail)', function() {
					ObjectUtils.query({ $: 'invalid' }, oWithCircRef).should.be.false;
					ObjectUtils.query({ a: { b: { text: 'invalid' } } }, oWithCircRef).should.be.false;
				});

				it('should handle circular refs (mixed)', function() {
					ObjectUtils.query({ $: 'foo', a: { b: { text: 'bar' } } }, oWithCircRef).should.be.false;
				});
			});

			describe('Getters via $relations', function() {
				const oWithGetter = {
					a: 'foo',
				};
				Object.defineProperty(oWithGetter, 'b', {
					get: function() {
						return {
							text: 'bar'
						}
					}
				});
				it('shouldn\'t match getters by default', function() {
					ObjectUtils.query({ $: 'bar' }, oWithGetter).should.be.false;
				});
				it('should match getters if in $relations', function() {
					ObjectUtils.query({ $relations: ['b'], $: 'bar' }, oWithGetter).should.be.true;
				});
			});
		});
	});

});
