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
    discussionProgress: 'discussionProgress'
}

Object.freeze(event);

export const socket = (io) => {
    io.on(event.connection, (socket) => {
        const user = {
            // socketId: {
            //     user: {userId, nickname}
            //     status: true,
            //     lastConnect: new Date(),
            // }
        };

        // 채팅 참여
        socket.on(event.join, (data) => {
            const {discussionId, jwt} = data;
            // jwt 검증
            // 없으면 error 이벤트 전송
            // 있는데 만료됐으면 새 토큰 발급 받아서 특정 이벤트로 전송
            // userId 추출
            const userId = '';
            const nickname = '';

            // 유저 룸 참여
            socket.join(discussionId);

            // 참여중인 유저 관리

            // 모든 유저에게 참여중인 유저 status 전송

            // 유저 참여했다고 모든 유저들에게 메세지 전송
            io.to(discussionId).emit(event.info, `[${nickname}] join`);

            // 헤당 유저에게 이전 채팅 내용 전송

            console.log(`User joined room: ${discussionId}`);
        });

        // 채팅 메세지
        socket.on(event.message, (data) => {
            const {discussionId, jwt, message} = data;

            // jwt 검증
            const nickname = '';

            // 채팅 저장
            const {messageId, createdAt} = '';

            // 채팅 모든 유저에게 전송
            const res = {
                discussionId,
                nickname,
                messageId,
                message,
                createdAt,
            }

            io.to(discussionId).emit(event.message, res);
        });

        // 연결 끊김
        socket.on(event.disconnect, () => {
            // 짧은 시간 동안 인터넷 연결이 끊길 수 있음 -> heartBeat 이벤트 사용
            console.log('User disconnected');
        });

        socket.on(event.discussionProgress, (data) => {
            const {discussionId, jwt, progress} = data;
            // jwt 검증 + 작성자 확인
            const nickname = '';

            // 진행현황 저장
            const {messageId, createdAt} = '';

            // 모든 유저에게 전송
            const res = {
                discussionId,
                nickname,
                messageId,
                message,
                createdAt,
            }

            io.to(discussionId).emit(event.message, res);
        });

        // 연결 끊김
        socket.on(event.disconnect, () => {
            // 짧은 시간 동안 인터넷 연결이 끊길 수 있음 -> heartBeat 이벤트 사용
            console.log('User disconnected');
        });
    });
};