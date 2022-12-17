// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
const day = require(__dirname + '/date.js');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/todoListDB');

const listItemSchema = {
    name: {
        type: String,
        required: [true, 'Name required']
    },
    time: {
        type: String,
        required: [true, 'Time required']
    }
};

const listItem = mongoose.model('listItem', listItemSchema);

const randomListSchema = {
    name: {
        type: String,
        required: [true, 'name not given']
    },
    items: [listItemSchema]
};

const randomLists = mongoose.model('randomList', randomListSchema);

app.get('/', (req, res) => {
    listItem.find((err, tList) => {
        if (err)
            console.log(err);
        else
            res.render('list', {
                kindOfDay: day.getDate(),
                type: "default",
                listItems: tList,
            });
    });
    // mongoose.connection.close();
});

app.post('/', (req, res) => {
    const newListItem = new listItem({
        name: req.body.newItem,
        time: day.getTime()
    });
    newListItem.save();
    // mongoose.connection.close();
    res.redirect('/');
});

app.post('/deleteItem', (req, res) => {
    let itemName = (req.body.itemName);
    listItem.deleteOne({
        name: itemName
    }, (err) => {
        if (err)
            res.send(err);
        else
            res.redirect('/');
    });
});

app.get('/:topic', (req, res) => {
    let listName = _.lowerCase(req.params.topic);
    randomLists.find({
        name: listName
    }, (err, result) => {
        if (result.length === 0) {
            let newList = new randomLists({
                name: listName,
                items: [],
            });
            newList.save();
            res.redirect('/' + listName);
        } else {
            res.render('list', {
                kindOfDay: listName,
                type: listName,
                listItems: result[0].items
            });
        }
    });
});

app.post('/:topic', (req, res) => {
    let listName = _.lowerCase(req.params.topic);
    randomLists.find({
        name: listName
    }, (err, result) => {
        // post here
        let prevItems = result[0].items;

        let newItem = new listItem({
            name: req.body.newItem,
            time: day.getTime()
        });

        prevItems.push(newItem);
        randomLists.updateOne({
            name: listName
        }, {
            items: prevItems
        }, (err) => {
            if (!err)
                res.redirect("/" + listName);
        });
    });
});

app.post('/deleteItem/:topic', (req, res) => {
    let listName = _.lowerCase(req.params.topic);
    randomLists.find({
        name: listName
    }, (err, result) => {
        // delete here
        let prevItems = result[0].items;
        prevItems = prevItems.filter((el) => {
            return (el.name !== req.body.itemName);
        });

        randomLists.updateOne({
            name: listName
        }, {
            items: prevItems
        }, (err) => {
            if (!err)
                res.redirect("/" + listName);
        });
    });
});

app.listen(3000, () => {
    console.log("Server listening on port 3000!")
});