import jsonpPromise from '../dist/index'

const params = {
	name: 'dashixiong',
	age: '22'
}

it('use with no params',()=>{
	expect.assertions(1);
	return jsonpPromise({
		url: `http://jsfiddle.net/echo/jsonp/?name=${encodeURIComponent('dashixiong')}&age=${encodeURIComponent('22')}`
	}).then((data)=>{
		expect(data).toEqual(params)
	})
})

it('use with params',()=>{
	
	expect.assertions(1);
	return jsonpPromise({
		params,
		url: 'http://jsfiddle.net/echo/jsonp/'
	}).then((data)=>{
		expect(data).toEqual(params)
	})
})

it('use custom callback name',()=>{
	
	expect.assertions(1);
	return jsonpPromise({
		params,
		url: 'http://jsfiddle.net/echo/jsonp/',
		callback: 'jsopPromise'
	}).then((data)=>{
		expect(data).toEqual(params)
	})
})

it('use custom contain dot callback name',()=>{
	
	expect.assertions(1);
	return jsonpPromise({
		params,
		url: 'http://jsfiddle.net/echo/jsonp/',
		callback: 'jsop.promise'
	}).then((data)=>{
		expect(data).toEqual(params)
	})
})