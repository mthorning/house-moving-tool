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
    'click .itemName': 'onListClick'
  },

  initialize: function() {
    this.model.on('add', this.onItemAdd, this);
    this.model.on('remove', this.onItemRemove, this);
  },

  render: function(box) {
    this.$el.html('');
    var self = this;
    this.model.each(function(item) {
      if(item.get('box') === box) {
        var itemView = new ItemView({ model: item});
        self.$el.append(itemView.render().$el);
      }
    });
  },

  onItemAdd: function(item) {
    var itemView = new ItemView({ model: item });
    this.$el.append(itemView.render().$el);
  },

  onItemRemove: function(item) {
    this.$('#' + item.get('id')).remove();
  },

  onListClick: function(e) {
    document.querySelectorAll('.itemName').forEach(function(li) {
      li.classList.remove('selected');
    });
    e.target.classList.add('selected');
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
    'click .boxName': 'onListClick'
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
    document.querySelectorAll('.boxName').forEach(function(li) {
      li.classList.remove('selected');
    });
    e.target.classList.add('selected');
    var id = parseInt(e.target.id);
    itemsView.render(id);
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



document.querySelector('.row').addEventListener('click', function(e) {
  if(e.target.classList.contains('delete')) {
    var id = parseInt(e.target.getAttribute('data-target'));

    if(e.target.getAttribute('data-which') === 'box') {
      boxes.remove(boxes.where({ id: id }));
      items.remove(items.where({ box: id }));
    } else {
      items.remove(items.where({ id: id }));
    }
  }
});

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
    var selection;

    if(selection = document.querySelector('.selected')) {
      var box = parseInt(selection.getAttribute('id'));
      var newItem = new Item({ id: id, name: name, box: box });
      items.add(newItem);
      itemInput.value='';
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

boxes.each(function(box) {
  var id = newId();
  box.set('id', id);
});

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

items.each(function(item) {
  var id = newId();
  item.set('id', id);
});

//Init
var boxesView = new BoxesView({ el: '#boxList', model: boxes });
var itemsView = new ItemsView({ el: '#itemList', model: items });

boxesView.render();