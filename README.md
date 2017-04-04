# Welcome to the Message Generator!
-----------------------------------

##### View the project live [here](https://immense-cove-15914.herokuapp.com/#/companies)

## To install and run locally:
-------------------------------
1. `git clone https://github.com/caseyhyde/message-templates.git`
2. `npm install`
3. `npm start`
4. Point your browser to [localhost:3000](http://localhost:3000)

## What it does
-----------------
The concept of this application was simple: generate a custom message based on data pulled from a customer.json and company.json file.

#### The message generated should be:
1. Unique to that customer and the company they are staying at.
2. Include a greeting based on the time of day where they are located.

#### The two JSON files contain objects structured as so:

#### companies.json
```json
[
  {
    "id": 1,
    "company": "Hotel California",
    "city": "Santa Barbara",
    "timezone": "US/Western"
  },
  {
    "id": 2,
    "company": "The Grand Budapest Hotel",
    "city": "Republic of Zubrowka",
    "timezone": "US/Central"
  }
]
```

#### guest.json
```json
[
  {
    "id": 1,
    "firstName": "Candy",
    "lastName": "Pace",
    "reservation": {
      "roomNumber": 529,
      "startTimestamp": 1486654792,
      "endTimestamp": 1486852373
    }
  },
  {
    "id": 2,
    "firstName": "Morgan",
    "lastName": "Porter",
    "reservation": {
      "roomNumber": 385,
      "startTimestamp": 1486612719,
      "endTimestamp": 1486694720
    }
  }
]
```
## The message generated should be something to the effect of:
--------------------------------------------------------------
> Good morning Candy! Welcome to the Hotel California! The room you reserved, 529, is currently ready for you. If you have any questions or comments regarding your stay, please reach out to us! You're awesome!

# How it works
----------------
The application runs on a Node.js server, currently hosted on Heroku. It is a single-page AngularJS application. The server pulls in the two required JSON files, and sends them to the client. Here are the steps:
1. On the home view (or Companies view), the `CompaniesController` makes a request to the `/companies` route on the server, which responds with the array of companies objects in `companies.json`.
    * Angular then `ngRepeat`s over the companies returned, creating a button for each.
2. When the user clicks on a company, the ` CompaniesController` updates the `MessageFactory`'s `messageData` object with the selected company object, via the `setCompany` method exposed on the `messageApi` returned from that factory.
    * *`setCompany()` creates a new Company Object from the Company class. More on classes [here](#classes-and-time)*
    * The client route is then changed to `/guests`, loading the `GuestsController` and `guests.html` template.
3. On load, the `GuestsController` makes a request to the `/guests` route on the server, which responds with the array of guest objects in `guests.json`
    * Angular then displays all of these guest's first and last names in a `select` element using `ngOptions`.
    * There is a service: `TimeService`, that contains classes for creating Time Objects. After loading all of the guests, `startTime()` is called in the `GuestController`, which:
      1. Creates a new Time Object.
      2. Starts the `tick()` interval, which updates the current time every second.  
        * *More on classes and the `TimeService` [here](#classes-and-time)*
4. The user then selects a guest from the drop down list. There is a card, hidden below with an `ngIf` which displays once a guest has been selected.
    * This card shows all of the information that will be used to generate the message:
    > Candy Pace is staying in room 529, at Hotel California in Santa Barbara, where it is currently Apr 4, 2017 1:16:33 PM (Daylight Savings Time is in effect).  

5. The user then clicks the "Generate Message", which runs the `generateMessage()` function in the `GuestController`, doing a few things:
  1. Updates the `MessageFactory`'s messageData object with the selected guest via the `setGuest()` method.
    * `setGuest()` creates a new Guest Object via the Guest class.
  2. Runs the `setTime()` method in the `MessageFactory`, generating a new `TimezoneSpecicTime` object, which has all of the time information we need to accurately determine the appropriate time of day for the guest ("morning", "afternoon", "evening"). We store this in the `messageData` object as well.
  3. Opens an `mdDialog`, which contains the formatted message to send to the guest.
  > Good afternoon Candy, and welcome to Hotel California! Your room, 529 is ready for you now! Please enjoy your stay, and let us know if you need anything!

  4. There's a send button. It doesn't actually send anything, but you get the idea.

# Classes and Time
---------
### Classes
I wanted to explore some of the new Object Oriented Programming constructs of ES6, and used the new Class features to build a lot of the functionality of this application. Some of this is a bit unnecessary, but I think it helps keep the code neat and organized. It also allows for further expansion, and should make writing tests much simpler. (I've already spent too much time on this application, unit tests just aren't happening, sorry folks).

#### Examples:
##### Guest and Company Class
These were the most unnecessary, as the data was already coming from a JSON file, and already structured as Javascript Objects... The only way they modify the original objects is to pull the `timestampStart`, `timestampEnd`, and `roomNumber` properties out of the `guest.reservation` sub-object and add them as direct properties on the new objects created...

### Time
Time was the fun part of building this application. We are given a timezone with the company, but in a string format: `"US/Western"`. We do not know anything beyond this. I built two classes to address generating accurate local time, as well as accurate timezone Specific time. I also modified the Date prototype to include a method for determining if we were in Daylight Savings Time.

#### It works like this:
The `TimeService` houses all of these classes. Here, I modified the Date Prototype and added a `LocalTime` class and a `TimezoneSpecicTime` class.

**Date.prototype.stdTimezoneOffset:**
Checks the local timezone offset of January 1st and of July 1st (both of this year), and returns the greater of the two (ie: the greater value
is the non DST timezone offset). These offsets are measured in minutes off UTC. A value of 300 would represent a UTC offset of -5 hours.

**Date.prototype.dst:**
A method that compares the current timezone offset to the value in Date.prototype.stdTimezoneOffset. If the current offset is less than the stdTimezoneOffset, it returns true, as we are in DST and false when not. (US/Central is UTC-6 not in DST and UTC-5 when in DST).

**LocalTime:** This class creates an object with the current date, time and offset from UTC. It also adds some potentially helpful properties such as the local hour (0 - 23), timestamp in ms from Jan, 1 1970, offset in ms, and whether or not we are currently in dst (using the new properties added to the Date prototype).

**TimezoneSpecicTime:**

This is where the real magic happens. We send this class today's current date/time, and the timezone we want the time in. The class first extends on the LocalTime class, so creating a TimezoneSpecicTime object will include all of the properties of a LocalTime object.

I created a nonDstTimeZones object that holds the UTC offsets for all US timezones (in hours). The TimezoneSpecicTime class references this object to get the offset in hours from a string passed in (ie: send the class "US/Central" and TimezoneSpecificTime.offsetHours becomes -6).

We then determine the time in this timezone by adding the offset in ms to the localtime timestamp, and generate a new date based on this adjusted timestamp. We can then check to see if this time is in dst, and using the `getTimeOfDay()` method, can determine if it is morning, afternoon, or evening.

I spent a fair amount of time attempting to correct for the edge cases where, daylight savings time just started in your local timezone, but hasn't yet in the timezone you are referencing (or vice versa). The logic says: "change your local time to that timezone's time and check if you're in dst and if it's morning, afternoon, or evening." Listening to Pink Floyd's Time makes all of this work much better I've discovered.

## Decisions Made:
------------------
* I used the MEAN stack, because I like it :). I think the OOP concepts made it easier to structure this code, and it was a breeze to spin up a server in Node.js to handle this application. Importing JSON files was also as simple as
```Javascript
var guest = require('<path-to-guest.json>');
```
* I used Angular Material for layout and styling, because it creates a consistent look across all views, and provides UX concepts familiar to almost all users.
* I think I've pretty well covered my decision to use the new class features in ES6 over a the old constructor functions (it was also fun). This whole application is about building objects. I couldn't have done it without you OOP...
* With regards to verifying correctness: Jasmine WOULD have been the way to go here... The extent of the testing I did involved creating test Time Objects and logging them out, using different dates and timezones. If you send in March 12th, 2017 2:01 am (when DST started in US/Central) and the timezone US/Western, you will receive a time object that is CORRECTLY not in DST yet...

## What if I had MORE time?
---------------------------
1. It would be fairly simply to add to the `nonDstTimeZones` object the rest of the timezones in the world... This would be my first step.
2. The whole thing breaks in Arizona... Or rather, any place that never observes DST... This would be second. The issue isn't in checking Arizona time zones, it's in running this code in Arizona... It compares the timezoneTime to the local time, and if the local time is never adjusted for DST, it would never adjust the timezone specific time either, so when DST was in effect in the rest of the world, you can't run this application accurately in Arizona. But, I digress... I'm told it's really hot there any way. 
