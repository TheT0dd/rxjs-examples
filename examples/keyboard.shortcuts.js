import $ from 'jquery';
import Rx from 'rxjs/Rx';
import keyCodeMap from '../lib/keycode.map';


// shortcuts we care for
const enabledShortcuts = [
	'ctrl+x',
	'ctrl+v',
	'ctrl+c',
	'ctrl+alt+d'
];


// keypress emitting starts here
const keyDowns = Rx.Observable.fromEvent(document, 'keydown');
const keyUps = Rx.Observable.fromEvent(document, 'keyup');

// observable that multicasts all distinct keyups & keydowns
const keyEvents = Rx.Observable.
	// creates an output Observable that subscribes to every given input Observable and
	// concurrently emits all input values
	merge(keyDowns, keyUps).
	// determines when two successive values are considered equal (true) or different (false)
	distinctUntilChanged((prev, curr) => prev.keyCode === curr.keyCode && prev.type === curr.type).
	// will log once, no matter how many subscribers, due to share()/publish()
	// do(e => consolse.info('key event:', e)).
	// will multicast (share) the input observable to all subscribers (hot stream)
	// NOTE: share() will subscribe to input observable & start emitting as soon as
	// the first observer subscribes and will stop emitting (unsubscribing from input
	// observable) once all observers have unsubscribed
	// NOTE: whenever a form of multicasting is used (share/publish/multicast etc)
	// Subjects are used under the hood
	// (http://reactivex.io/rxjs/manual/overview.html#subject)
	share();


// Given a text description of a shortcut (i.e. 'ctrl+x'), returns an Observable that
// emits a value whenever the shortcut's combinination keys are simultaneously pressed
const mapShortcutTextToObservable = (text) =>
	// Observable from array (will surely complete, toArray() below depends on it)
	Rx.Observable.from(text.split('+')).
		// maps key string to key code (i.e. 'ctrl' to 17)
		map(c => {
			let code = keyCodeMap[c.toLowerCase()];
			if (code === undefined) {
				throw new Error('Invalid sequence ' + text);
			}
			return code;
		}).
		// maps each code to an observable instance
		// NOTE: unlike mergeMap(), map() simply emits the observable instance and
		// NOT its emitted values
		map(code => keyEvents.filter(e => e.keyCode === code).map(e =>e.type)).
		// waits for input observable to complete, then reduces emitted values into an array
		// NOTE: at this point, always a single value will be emitted
		toArray().
		// projects each source value (Observable instance) to an Observable (emitting shortcuts)
		// which is merged in the output Observable
		mergeMap(arr =>
			// creates new observable that combines the latest value of each Observable in array,
			// and emits this combination as an array of values (i.e. ['keydown', 'keyup'])
			Rx.Observable.combineLatest(arr)
		).
		// allows only ['keydown', 'keydown'] emitted values to pass through
		filter(arr => {
			let isDown = true;
			for (let i = 0; i < arr.length; i++) {
				isDown = isDown && (arr[i] === 'keydown');
			}
			return isDown;
		}).
		// count shortcut press emits
		scan((acc, x) => acc + 1, 0).
		// maps ['keydown', 'keydown'] to a more useful object
		map(count => ({
			id: text.replace(/\+/g, '-'),
			text,
			count
		}));


// Given an array of shortcut text descriptions, returns an Observable that
// emits a value whenever any of the shortcuts' combinination keys are simultaneously pressed
const shortCuts = Rx.Observable.from(enabledShortcuts).
	// side effects: display list of available shortcuts
	do(text => {
		$('ul#shortcut-list').append(`<li id="${text.replace(/\+/g, '-')}">${text}</li>`);
	}).
	// projects each source value (shortcut text) to an Observable (emitting shortcut keypress events)
	// which is merged in the output Observable
	mergeMap(text =>
		// observable that emits shortcut keypress events for given text
		mapShortcutTextToObservable(text)
	);

// Subscribe to shortcut events & update info on page (side effects)
shortCuts.subscribe(obj => {
	const ul = $('ul#shortcut-list');
	const li = $(`li#${obj.id}`, ul);
	const text = `${obj.text} - ${obj.count}`;
	if (li.length === 0) {
		ul.append(`<li id="${obj.id}">${text}</li>`);
	} else {
		li.text(text);
	}
});
