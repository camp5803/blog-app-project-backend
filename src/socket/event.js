const event = {
    connection: 'connection',
    disconnect: 'disconnect',
    info: 'info',
    error: 'error',
    join: 'join',
    message: 'message',
    status: 'status',
    ban: 'ban',
    unban: 'unban',
    discussionProgress: 'discussionProgress',
    history: 'history'
}

Object.freeze(event);

module.exports = event;
