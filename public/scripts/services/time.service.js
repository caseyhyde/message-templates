app.service('TimeService', function() {
  /****************
     TIME STUFF
  *****************/
  const nonDstTimeZones = {
    Eastern: -5,
    Central: -6,
    Mountain: -7,
    Western: -8,
    Alaskan: -9,
    Hawaiian: -10,
  }
  /*******************
      CHECK FOR DST
  ********************/
  Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    //Timezone offsets returned from getTimezoneOffeset are inverse of UTC - values...
    //Ie: getTimezoneOffset() that returns 300 == UTC-5
    //Ie: getTimezoneOffset() that returns 360 == UTC-6
  }
  Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
    //If stdTimezoneOffset is greater, we're in DST!
  }
  class LocalTime {
    constructor(date) {
      this.localDate = date;
      this.localHour = date.getHours();
      this.localTimeMs = date.getTime();
      this.localOffsetHours = date.getTimezoneOffset() / -60;
      this.localOffsetMs = this.localOffsetHours * 3600000;
      this.localDst = date.dst();
    }
  }
  class TimezoneSpecicTime extends LocalTime{
    constructor(date, timezone) {
      super(date);
      this.timezoneRegion = timezone.split('/')[1];//Giving us everything after / Ie: region.
      this.timezoneOffsetHours = nonDstTimeZones[this.timezoneRegion];
      this.timezoneOffsetMs = this.timezoneOffsetHours * 3600000;
      this.timezoneOffsetFromLocalHours = this.timezoneOffsetHours - this.localOffsetHours;
      this.timezoneOffsetFromLocalMs = this.timezoneOffsetFromLocalHours * 3600000;
      this.timezoneTime = this.localTimeMs + this.timezoneOffsetFromLocalMs;
      this.timezoneDate = new Date(this.timezoneTime);
      //If we're in dst in this timezone, change these things:
      if(this.timezoneDate.dst()) {
        this.timezoneDst = true;
        this.timezoneOffsetHours += 1;
        this.timezoneOffsetFromLocalHours = this.timezoneOffsetHours - this.localOffsetHours;
        this.timezoneOffsetFromLocalMs = this.timezoneOffsetFromLocalHours * 3600000;
        this.timezoneTime += 3600000;
        this.timezoneDate = new Date(this.timezoneTime);
        this.timezoneHour = this.timezoneDate.getHours();
      } else {
        this.timezoneDst = false;
        this.timezoneHour = this.timezoneDate.getHours();
      }
    }
    getTimeOfDay() {
      switch (true) {
        case (this.timezoneHour < 12):
          return "morning";
          break;
        case (this.timezoneHour >= 12 && this.timezoneHour < 18):
          return "afternoon";
          break;
        case (this.timezoneHour >= 18 && this.timezoneHour <= 23):
          return "evening";
          break;
      }
    }
  }

  this.createTimeObject = (date, timezone) => {
    return new TimezoneSpecicTime(date, timezone);
  }

});
