import $ from 'jquery';
import Rx from 'rxjs/Rx';

export const searchRepos = (keyword) =>
	$.get(`https://api.github.com/search/repositories?q=${keyword}`).promise();

export const searchWikipedia = (term) => {
	return $.ajax({
		url: 'http://en.wikipedia.org/w/api.php',
		dataType: 'jsonp',
		data: {
			action: 'opensearch',
			format: 'json',
			search: term
		}
	}).promise();
};
