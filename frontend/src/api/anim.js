import socket from './index.js';

export const startAnim = (target) => {
  socket.emit('message', {
    type: 'anim',
    user: 'host',
    content: {
      type: 'anim-start',
      target: target,
    },
  });
};

export const finishAnim = (target) => {
  socket.emit('message', {
    type: 'anim',
    user: 'host',
    content: {
      type: 'anim-stop',
      target: target,
    },
  });
};

export const successAnim = (damage, isLast) => {
  socket.emit('message', {
    type: 'anim',
    user: 'host',
    content: {
      type: 'anim-success',
      target: 'host',
      damage: damage,
      isLast: isLast,
    },
  });
};

export const failureAnim = (damage, isLast) => {
  socket.emit('message', {
    type: 'anim',
    user: 'host',
    content: {
      type: 'anim-fail',
      target: 'host',
      damage: damage,
      isLast: isLast,
    },
  });
};
