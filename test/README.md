# Testing

amDatePicker uses Karma for unit testing and Protractor for end-to-end testing. Note that you will need to have Chrome browser.

Install the dependencies with

```
npm install
```

**Unit test**

Run the test:
```
npm test
```


**End to end test**

Start selenium server with:
```
webdriver-manager start
```

Run the test with:
```
protractor test/protractor-conf.js
```
