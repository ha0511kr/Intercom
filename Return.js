/*
********************IMPORTANT README************************

This file contains functions to handle reading, writing to a Google Sheet, and also facilitates the loading of the API

Make sure to include the following html code BEFORE any code for a webpage
Replace the callback function placeholder value with the name of the function to call when the signIn state of the user changes
This function should take in one argument, a boolean indicating whether the user is logged in or not.

<script async defer src="https://apis.google.com/js/api.js"
	onload="handleClientLoad(<callback function>)"
	onreadystatechange="if (this.readyState === 'complete') this.onload()">
</script>

Also, make sure to bind the signIn/signOut functions to an event, such as a sign in button or when the page loads

GENERAL INFORMATION
sheetID: string, the id of the sheet, the value between the /d/ and /edit in the sheets URL
see https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values for more information about the following
range: a string, the value(s) of the cells to read/write in A1 notation
majorDimension: a string, either "ROWS" or "COLUMNS" indicating whether each subarray in an array of values represents a row or a column
callback: name of the function to call to handle the API response
body: see https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange
*/

function getCellValues(sheetID, range, majorDimension, callback) {
	var params = {
		spreadsheetId: sheetID,
		range: range,
		majorDimension: majorDimension,
		valueRenderOption: 'FORMATTED_VALUE',
		dateTimeRenderOption: 'FORMATTED_STRING',
	};
	var request = gapi.client.sheets.spreadsheets.values.get(params);
	request.then(function(response) {
		callback(response.result.values);
	}, function(reason) {
		console.error('error: ' + reason.result.error.message);
	});
}

function writeCellValues(sheetID, range, majorDimension, body, callback) {
	var params = {
		spreadsheetId: sheetID,
		range: range,
		includeValuesInResponse: true,
		valueInputOption: 'USER_ENTERED',
	};
	var request = gapi.client.sheets.spreadsheets.values.update(params, body);
	request.then(function(response) {
		callback(response.result.updatedData);
	}, function(reason) {
		console.error('error: ' + reason.result.error.message);
	});
}

function handleClientLoad(signInUpdateCallback) {
	gapi.load('client:auth2', function(){
		var API_KEY = '';
		var CLIENT_ID = '666423085846-phon0564jgucru5fnif0qpgr6s0hslj6.apps.googleusercontent.com';
		var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
	
		gapi.client.init({
			'apiKey': API_KEY,
			'clientId': CLIENT_ID,
			'scope': SCOPE,
			'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
		}).then(function() {
			if (signInUpdateCallback === undefined){
				signInUpdateCallback = function(loggedIn){console.log(loggedIn);}
			}
			gapi.auth2.getAuthInstance().isSignedIn.listen(signInUpdateCallback);
			signInUpdateCallback(gapi.auth2.getAuthInstance().isSignedIn.get());
		});
	});
}

function signIn() {
	gapi.auth2.getAuthInstance().signIn();
	console.log("logged in");
}

function signOut() {
	gapi.auth2.getAuthInstance().signOut();
	console.log("logged out");
}
