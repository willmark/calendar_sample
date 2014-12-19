/**
 * Light footprint JS calendar
 * No JQuery or any other dependencies
 * but AMD and requirejs are recommended
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('lfcalendar', [], factory); // AMD
  } else {
    global.lfcalendar = factory(); // <script>
  }
}(this, function () {

   var calendar = {
      defaultOptions: {
        targetClass: 'lfcalendar',
        events: {},
        callback: {}
      },
      currentOptions: {},
      init: function(options) {
        this.currentOptions = options || this.defaultOptions;
        return this
      },
      clicked: function(event) {
        event.currentTarget.classList.toggle('calendarDayDetails');
        return this
      },
      hover: function(event) {
        event.currentTarget.classList.toggle('calendarDayZoom');
        return this
      },
      render: function(date) {
        date = new Date(date);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        var nextDate = new Date(year, month + 1, 1)
        var prevDate = new Date(year, month - 1, 1)

        var strNext = nextDate.getFullYear() + '-' + (1 + nextDate.getMonth()) + '-' + nextDate.getDate()
        var strPrev = prevDate.getFullYear() + '-' + (1 + prevDate.getMonth()) + '-' + prevDate.getDate()
        //TODO: get i18n dates
        var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

        var currMonth = new Date(year, month, 1);
        var nextMonth = new Date(year, month + 1, 1);

        var firstDayOfWeek = currMonth.getDay();
        var availableDaysInMonth = Math.round((nextMonth.getTime() - currMonth.getTime()) / (1000 * 60 * 60 * 24));

        var html = '<div class="calendar">'
        html += '<div class="table-caption"><div class="calendarHeaderButton" onclick="require([\'xgcalendar\'], function (calendar) {calendar.render(\'' + strPrev + '\')})">back</div><div class="calendarHeader">' + months[month] + ' ' + year + '</div><div class="calendarHeaderButton" onclick="require([\'xgcalendar\'], function (calendar) {calendar.render(\'' + strNext + '\')})">next</div></div>';
        html += '<div class="calendarWeek">';

        // Fill the first week of the month with the appropriate number of blanks.
        for (weekDay = 0; weekDay < firstDayOfWeek; weekDay++) {
            html += '<div class="calendarDay"> </div>';
        }

        var events = this.currentOptions.events;
        
        var weekDay = firstDayOfWeek;
        for (dayidx = 1; dayidx <= availableDaysInMonth; dayidx++) {
            weekDay %= 7;
            if (weekDay == 0)
                html += '</div><div class="calendarWeek">';

            // Do something different for the current day.
            if (day == dayidx) {
                html += '<div class="calendarDay calendarDayActive" onclick="this.clicked(this, true)"><div class="calendarDayIndex"><b>' + dayidx + '</b></div>';
            } else {
                html += '<div class="calendarDay"><div class="calendarDayIndex"> ' + dayidx + ' </div>';
            }
            var m = "000000000" + (month + 1);

            var d = "000000000" + dayidx;
            var key = year + '-' + m.substr(m.length-2) + '-' + d.substr(d.length-2);
            var val = '';
            var evts = events();
            if (typeof evts[key] !== 'undefined') {
               for (idx in evts[key]["dayEvents"]) {
                   val += '<p class="event">' + evts[key]["dayEvents"][idx]["name"] + '</p>';
               }
            }
            html += '<div class="calendarDaySummary">' + val + '</div></div>';

            weekDay++;
        }

        html += '</div>';
        html += '</div>';

        var tgts = document.getElementsByClassName(this.currentOptions.targetClass);
        for (idx=0;idx < tgts.length;idx++) {
            tgts[idx].innerHTML = html;
            var dayelems = document.getElementsByClassName('calendarDay');
            for (idx2=0;idx2 < dayelems.length;idx2++) {
                dayelems[idx2].onclick = this.clicked;
            }
        }
        return this
      }
   }
   return calendar;
}))
