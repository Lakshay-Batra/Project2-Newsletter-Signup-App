require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public")); // To make public folder static and able to deliver css and images to our html pages

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html"); //remember the argument to pass in sendFile method
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const dataToSend = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }]
    };

    const jsonData = JSON.stringify(dataToSend);

    const url = process.env.URL;
    const options = {
        method: "POST",
        auth: process.env.AUTH
    };
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });
    // sending jsonData to mailchimp through (request) received
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req,res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Server started at 3000");
});