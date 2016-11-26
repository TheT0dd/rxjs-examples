import $ from 'jquery';
import Rx from 'rxjs/Rx';
import { searchRepos, searchWikipedia } from '../api';

const input =  $('#search');
const output = $('#results');

// Get all distinct key up events from the input and only fire if long enough and distinct
var keyup = Rx.Observable.fromEvent(input, 'keyup').
	// Project the text from the input
	map((e) => e.target.value).
	// Only if the text is longer than 2 characters
	filter((text) => text.length > 2).
	// Pause for 750ms
	debounceTime(750).
	// Only if the value has changed
	distinctUntilChanged();


var searcher = keyup.switchMap(searchRepos);

searcher.subscribe(
	(data) => {
		const html = data.items
			.map(item => ({
				name: item.name,
				stars: item.stargazers_count
			})).reduce((acc, cur) =>
				acc + `<li>name: ${cur.name}, stars: ${cur.stars}</li>`
			, '');
		output.html(html);
	},
	(error) => {
		output.html($('<li>')).text('Error:' + error);
	}
);
