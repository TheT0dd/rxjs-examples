import $ from 'jquery';
import Rx from 'rxjs/Rx';

// custom observable
const observable = new Rx.Observable((observer) => {
	var id = setTimeout(() => {
		observer.next('hi');
	}, 1000);
});

// another custom observable
const observable3 = Rx.Observable.create((observer) => {
	observer.next(11);
	observer.next(22);
	observer.next(33);
	observer.complete();
});

// from static array
const observable2 = Rx.Observable.from([1,2,3]);

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

// Subscribe to observables
observable.subscribe(x => console.log(x));
observable2.subscribe(
	x => console.log(x),
	null,
	completed => console.log('done!')
);
observable3.subscribe(
	x => console.log(x),
	null,
	completed => console.log('done!')
);
observable4.subscribe(
	x => console.log(x),
	err => console.log(err),
	completed => console.log('done!')
);
observable5.subscribe(
	x => console.log(x),
	err => console.log(err),
	completed => console.log('done!')
);
