function getMonthLength(month, year) {
	var testDate = new Date(year, month - 1, 0);
	return testDate.getDate();
}
function getStartingDayOfWeek(month, year) {
	var testDate = new Date(year, month - 1, 1);
	return testDate.getDay();
}
function weekCount(year, month_number) {
    var firstOfMonth = new Date(year, month_number-1, 1);
    var lastOfMonth = new Date(year, month_number, 0);

    var used = firstOfMonth.getDay() + lastOfMonth.getDate();

    return Math.ceil( used / 7);
}
function getCalendarHTML(month, year, events) {
	var html = "";

	var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	// var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	html += '<table class="calendar">';
		html += '<thead>';

			html += '<tr><th class="calendar-month" colspan="7">';
			html += months[month - 1];
			html += ' ';
			html += year;
			html += '</th></tr>';
			html += '<tr class="calendar-daysOfWeek">';
				for (var i = 0; i < daysOfWeek.length; i++) {
					html += '<th class="calendar-dayOfWeek">';
					html += daysOfWeek[i];
					html += '</th>';
				}
			html += '</tr>';

		html += '</thead>';
		html += '<tbody>';

		// For every week...
		// if start week, add blank cells
		// add cells until end of week
		// if end week, add blank cells
		// repeat until end of month
		var weeks = weekCount(year, month);
		var curDay = 1;
		for (var j = 0; j < weeks; j++) {
			var weekDayIndex = 0;
			var daysInWeek = 7;
			if (j == (weeks - 1)) {
				// Last week!						
				var lastDay = new Date(year, month, 0);
				daysInWeek = lastDay.getDay() + 1;
			}
			html += '<tr>';

				if (j == 0) {
					// Start week!
					// We have to worry about the starting days...
					var startDow = getStartingDayOfWeek(month,year);
					for (var k = 0; k < startDow; k++) {
						html += '<td class="calendar-notInMonth"></td>';
						weekDayIndex++;
					}
				}
				for (;weekDayIndex < daysInWeek; weekDayIndex++) {
					html += '<td class="calendar-day ';
					console.log(curDay);
					if (events[curDay].length != 0) {
						html += 'calendar-eventDay';
					}
					
					html += '">';
					html += curDay;
					html += '</td>';
					curDay++;
				}
				if (weekDayIndex != 6) {
					for (;weekDayIndex < 7; weekDayIndex++) {
						html += '<td class="calendar-notInMonth"></td>';
						curDay++;
					}
				}


			html += '</tr>';
		}

		html += '</tbody>';
	html += '</table>';
	
	return html;
}

$(document).ready(function() {
	if (window.location.href.replace("http://", "").replace("https://", "") == "blogs.dalton.org/mines/") {
		$.get("https://blogs.dalton.org/mines/feed/?cat=195058", function(data) {
			var $data = $(data);
			var events = {};
			console.log("MONTH LENGTH: ");
			console.log(getMonthLength(4, 2015));
			console.log("STARTING EVENT ARRAY ADD");
			for (var i = 1; i < getMonthLength(4, 2015); i++) {
				console.log(i);
				events[i] = [];
			}
			console.log("ENDING EVENT ARRAY ADD");
			$data.find("item").each(function() {
				var thisEntryDate = new Date($(this).children("pubDate").text());
				var i = 0;
				
				console.log(thisEntryDate.getDate());
				events[thisEntryDate.getDate()].push({
					title: $(this).children("title").text(),
					date: thisEntryDate.toDateString(),
					link: $(this).children("link").text()
				});

				console.log($(this).children("title").text());
				console.log(thisEntryDate.toDateString());
				console.log($(this).children("link").text());
			});
			$("body").append(getCalendarHTML(3, 2015, events));
		});
	}
});