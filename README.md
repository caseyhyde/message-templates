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

## How it works
----------------
