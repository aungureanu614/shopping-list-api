var express = require('express');

var Storage = {
    add: function(username, names) {

        this.username = username;


        var item = { username: username, name: names, id: this.setId };

        this.items.push(item);
        this.setId += 1;

        return item;

    },

    remove: function(targetId) {
        var targetIndex = this.items.findIndex(function(item) {
            return item.id === targetId;
        });

        if (targetIndex === -1) return false;

        this.items.splice(targetIndex, 1);
        return true;
    },
    edit: function(targetId, newName) {
        var targetIndex = this.items.findIndex(function(item) {
            return item.id === targetId;
        });


        var item;

        if (targetIndex === -1) {
            item = { name: newName, id: targetId };
            this.items.push(item);
            return item;
        } else {
            this.items[targetIndex].name = newName;
            return this.items[targetIndex];
        }

    },
    findUser: function(name) {
        var addedItems = [];
        var targetUser = this.items.filter(function(item) {
            return item.username === name;
        });

        for (var i = 0; i < targetUser.length; i++) {
            addedItems.push({ name: targetUser[i].name, id: targetUser[i].id });
            var userItems = { username: targetUser[i].username, items: addedItems };

        }

        return userItems;

    }

}

var createStorage = function() {
    var storage = Object.create(Storage);
    storage.items = [];
    storage.setId = 1;
    return storage;
};

var storage = createStorage();


storage.add('Tim', 'Broad beans');
storage.add('Jenny', 'Tomatoes');
storage.add('Dora', 'Peppers');
storage.add('Tim', 'cookies');
storage.add('Jenny', 'avocados');
storage.add('Jenny', 'ham');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.listen(process.env.PORT || 8080, process.env.IP);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.post('/items', jsonParser, function(request, response) {

    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
    var deleteID = parseInt(request.params.id);

    var remove = storage.remove(deleteID);

    if (remove === false) {
        return response.sendStatus(404).json('item');
    }
    response.status(200).json(remove);

});

app.put('/items/:id', jsonParser, function(request, response) {
    var editId = parseInt(request.params.id);
    var editedName = request.body.name;

    if (request.body.id !== editId) {
        return response.sendStatus(400);
    }
    var edit = storage.edit(editId, editedName)

    if (!edit) {
        return response.sendStatus(400);
    }

    response.status(200).json(edit);

});

app.get('/items/:username', jsonParser, function(request, response) {
    var user = request.params.username;

    var getUser = storage.findUser(user);

    response.status(200).json(getUser);


})
