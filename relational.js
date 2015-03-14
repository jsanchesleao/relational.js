var R = require('ramda');
var K = R.always;

var m = require('./module');

var state = {
  selectedBoard: 2,
  boards: [{
    id: 1,
    name: 'first',
    message: 1
  }, {
    id: 2,
    name: 'second',
    message: 3
  }],
  messages: [{
    id: 1,
    text: 'Hello'
  }, {
    id: 2,
    text: 'Hola'
  }, {
    id: 3,
    text: 'Ola'
  }]
};

function joinMessagesImperative(state) {
  var boards = [];
  for(var i = 0; i < state.boards.length; i++) {
    for( var j = 0; j < state.messages.length; j++) {
      if (state.boards[i].message === state.messages[j].id) {
        var board = R.clone(state.boards[i]);
        board.message = state.messages[j];
        boards.push(board);
      }
    }
  }
  return boards;
}

var joinMessages = m.join({
  from: ['boards', 'messages'],
  into: 'message',
  where: m.wrap(R.eq, R.prop('message'), R.prop('id'))
});

var getSelectedBoard = m.find({
  from: 'boards',
  where: m.wrap(R.eq, R.prop('selectedBoard'), R.prop('id'))
});

var show = R.compose(
  getSelectedBoard,
  m.derive('boards', joinMessages));
