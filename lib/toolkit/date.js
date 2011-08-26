Object.defineProperties(Date.prototype, {
  date: {
    get: function() {
      return this.getDate();
    }
  }
  time: {
    get: function() { }
    set: function() { }
  },
  year: {
    get: function() {
      return this.getYear();
    },
    set: function(year) {
      return this.setYear(year);
    }
  },
  month: {
    get: this.getMonth,
    set: this.setMonth
  },
  day: {
    get: this.getDay,
    set: this.setDay
  }
});