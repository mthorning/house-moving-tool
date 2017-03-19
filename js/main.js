//MODELS
var Item = Backbone.Model.extend();

var Box = Backbone.Model.extend();

//COLLECTIONS
var Items = Backbone.Collection.extend({
  model: Item
});

var Boxes = Backbone.Collection.extend({
  model: Box
});

//VIEWS

var ItemView = Backbone.View.extend({
  
  render: function() {
    var template = _.template($('#itemListItem').html());
    var html = template(this.model.toJSON());
    this.$el.html(html);

    return this;
  }
});

var ItemsView = Backbone.View.extend({

  events: {
    'click .itemName': 'onListClick',
    'click .delete': 'onDeleteButtonClick',
    'click .move': 'onMoveButtonClick'
  },

  initialize: function() {
    this.model.on('add', this.onItemAdd, this);
    this.model.on('remove', this.onItemRemove, this);
    this.model.on('change', this.render, this);
  },

  render: function(box) {
    this.$el.html('');
    var self = this;
    this.model.each(function(item) {
      if(item.get('box') === parseInt(box) || box === 'allItemsBox' ) {
        var itemView = new ItemView({ model: item});
        self.$el.append(itemView.render().$el);
      }
    });
  },

  onItemAdd: function(item) {
    if(this.model.length === 1) {
      $('#allItemsBox').show();
    }
    var itemView = new ItemView({ model: item });
    this.$el.append(itemView.render().$el);
  },

  onItemRemove: function(item) {
    if(this.model.length === 0) {
      $('#allItemsBox').hide();
    }
    this.$('#' + item.get('id')).remove();
  },

  onListClick: function(e) {
    if(moveMode) {
      e.target.classList.toggle('move');
      this.moveListUpdate(e.target.id);
    } else {
      document.querySelectorAll('.itemName').forEach(function(li) {
        li.classList.remove('selected');
      });
      e.target.classList.add('selected');
    }
  },

  moveListUpdate: function(id) {
    if(id) {
      id = parseInt(id);
      var i = moveList.indexOf(id);
      if(i === -1) {
        moveList.push(id);
      } else {
        moveList.splice(i, 1);
      }
    }
  },

  onDeleteButtonClick: function(e) {
    var id = parseInt(e.target.getAttribute('data-target'));
    items.remove(items.where({ id: id }));
  },

  onMoveButtonClick: function(e) {
    e.stopPropagation();
    e.target.parentNode.classList.remove('selected');
    e.target.parentNode.classList.add('move');
    this.moveListUpdate(e.target.parentNode.id);
    $('#deleteBox').show();
    $('#allItemsBox').hide();
    moveMode = true;
  }

});

var BoxView = Backbone.View.extend({
  
  render: function() {
    var template = _.template($('#boxListItem').html());
    var html = template(this.model.toJSON());
    this.$el.html(html);

    return this;
  }
});

var BoxesView = Backbone.View.extend({
  
  events: {
    'click .boxName': 'onListClick',
    'click .delete': 'onDeleteButtonClick'
  },
  
  initialize: function() {
    this.model.on('add', this.onBoxAdd, this);
    this.model.on('remove', this.onBoxRemove, this);
  },
  
  render: function() {
    var self = this;
    this.model.each(function(box) {
      var boxView = new BoxView({ model: box });
      self.$el.append(boxView.render().$el);
    });
  },
  
  onBoxAdd: function(box) {
    var boxView = new BoxView({ model: box });
    this.$el.append(boxView.render().$el);
  },

  onBoxRemove: function(box) {
    this.$('#' + box.get('id')).remove();
  },
  
  onListClick: function(e) {
    if(moveMode) {

      if(e.target.id === 'deleteBox') {
        moveList.forEach(function(id) {
          items.remove(items.where({ id: id }));
        })
      } else {

        var selectedBox = parseInt(e.target.id);

        items.each(function(item) {

          if(moveList.indexOf(item.get('id')) >= 0) {
            item.set('box', selectedBox);
          }

        });
      }

      $('#deleteBox').hide();
      $('#allItemsBox').show();
      moveList = [];
      moveMode = false;
    } 
      document.querySelectorAll('.boxName').forEach(function(li) {
        li.classList.remove('selected');
      });
      e.target.classList.add('selected');
      var id = e.target.id;
      itemsView.render(id);
  },

  onDeleteButtonClick: function(e) {
    var id = parseInt(e.target.getAttribute('data-target'));
    boxes.remove(boxes.where({ id: id }));
    items.remove(items.where({ box: id }));
  }

});

//INPUTS
var boxInput = document.getElementById('boxInput');
var boxSubmit = document.getElementById('boxSubmit');
var itemInput = document.getElementById('itemInput');
var itemSubmit = document.getElementById('itemSubmit');

var newId = (function() {
  var count = 1;
  return function() {
    return count++;
  }
})()

boxSubmit.addEventListener('click', function() {
  var name = boxInput.value;
  if(name) {
    var id = newId();
    var newBox = new Box({ id: id, name: name });
    boxes.add(newBox);
  }
  boxInput.value = '';
  boxInput.focus();
});

itemSubmit.addEventListener('click', function() {
  var name = itemInput.value;
  if(name) {
    var id = newId();
    var selection = document.querySelector('.selected');
    var box = selection.getAttribute('id');

    if(selection) {
      if(box !== 'allItemsBox') {
        var newItem = new Item({ id: id, name: name, box: parseInt(box) });
        items.add(newItem);
        itemInput.value='';
      } else {
        alert('Items cannot be added to the \'all items\' box');
      }
    } else {
      alert('Please select a box to put item in');
    }
  } 
  
});

//Test
var boxes = new Boxes([
  new Box({ name: 'Bathroom' }),
  new Box({ name: 'Bedroom 1' }),
  new Box({ name: 'Bedroom 2' }),
  new Box({ name: 'Living Room' }),
  new Box({ name: 'Kitchen' })
]);

var items = new Items([
  new Item({ name: 'toothbrush', box: 1}),
  new Item({ name: 'toothpaste', box: 1}),
  new Item({ name: 'shampoo', box: 1}),
  new Item({ name: 'pillow', box: 2 }),
  new Item({ name: 'duvet', box: 2 }),
  new Item({ name: 'socks', box: 3 }),
  new Item({ name: 'more socks', box: 3 }),
  new Item({ name: 'remote control', box: 4 }),
  new Item({ name: 'coasters', box: 4 }),
  new Item({ name: 'laptop', box: 4 }),
  new Item({ name: 'plates', box: 5 }),
  new Item({ name: 'cups', box: 5 }),
  new Item({ name: 'kitchen roll', box: 5 })
]);

createIds(boxes);
createIds(items);


function createIds(arr) {
  arr.each(function(el) {
    var id = newId();
    el.set('id', id);
  });
}

//Init
var boxesView = new BoxesView({ el: '#boxList', model: boxes });
var itemsView = new ItemsView({ el: '#itemList', model: items });
var moveMode = false;
var moveList = [];
if(items.length > 0) {
  $('#allItemsBox').show();
}

boxesView.render();