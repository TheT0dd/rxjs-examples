import $ from 'jquery';
import Rx from 'rxjs/Rx';

// a custom observable
const observable = new Rx.Observable((observer) => {
	var id = setTimeout(() => {
		observer.next('hi');
	}, 1000);
});

// an observable created from a static array
const observable2 = Rx.Observable.from([1,2,3]);

// another custom observable
const observable3 = Rx.Observable.create((observer) => {
	observer.next(11);
	observer.next(22);
	observer.next(33);
	observer.complete();
});

// Function that returns promise
const doAsycStuff = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('async stuff done!');
	}, 1000);
});

// Custom fromEvent implementation
const fromEvent = (target, event) => Rx.Observable.create(observer => {
	target.addEventListener(event, e => {
		observer.next(e);
	});
});

// Custom fromPromise implementation
const fromPromise = (promise) => Rx.Observable.create(observer => {
	promise.then(
		value => {
			observer.next(value);
			observer.complete();
		},
		cause => {
			observer.error(cause);
		}
	);
});

// const observable4 = Rx.Observable.fromPromise(doAsycStuff());
const observable4 = fromPromise(doAsycStuff());

// const observable5 = Rx.Observable.fromEvent(doAsycStuff());
const observable5 = fromEvent(document, 'click');

// Subscribe to observables:
// passing only a next handler
observable.subscribe(x => console.log(x));
// passing next, error & complete handlers
observable2.subscribe(
	x => console.log(x),
	null,
	() => console.log('done!')
);
// passing observer object
observable3.subscribe({
	next: x => console.log(x),
	error: null,
	complete: () => console.log('done!')
});
observable4.subscribe(
	x => console.log(x),
	err => console.log(err),
	() => console.log('done!')
);
observable5.subscribe(
	x => console.log(x),
	err => console.log(err),
	() => console.log('done!')
);
