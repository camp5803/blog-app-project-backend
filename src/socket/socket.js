import {socketService} from "@/service/socket.service";

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

export const socket = (io) => {
    io.on(event.connection, async (socket) => {
        try {
            const user = {};

            const verifyResult = await socketService.verifyUser(socket);

            if (!verifyResult.error) {
                user[socket.id] = verifyResult;
                socket.user = user[socket.id];
            }

            // 채팅 참여
            socket.on(event.join, async (data) => {
                // console.log(socket.user);
                const {discussionId} = data;

                // discussionid 검증
                const discussion = await socketService.validateDiscussionId(discussionId);
                if (!discussion) {
                    io.to(socket.id).emit(event.error, {message: '존재하지 않는 토의입니다.'});
                    return;
                }

                // 모든 유저에게 참여중인 유저 status 전송
                if (socket.user) {
                    const checkUser = await socketService.checkDiscussionUser(discussionId, socket.user.userId);
                    if (checkUser.error) {
                        // 강퇴 유저 에러처리
                        io.to(socket.id).emit(event.error, {message: '강퇴당한 유저입니다.'});
                    } else {
                        // 토의 참여 완료
                        socket.join(discussionId);
                    }
                }


                // 토의 참여자 리스트 반환
                const discussionUsers = await socketService.getDiscussionUsers(discussionId);
                // console.log(JSON.stringify(discussionUsers, null, 2));
                discussionUsers.discussionId = discussionId;
                io.to(discussionId).emit(event.status, discussionUsers);

                // 헤당 유저에게 이전 채팅 내용 전송
                // todo 조회 로직 추가
                io.to(socket.id).emit(event.history, {messages: ['이전 채팅 내역']});


                // 유저 참여했다고 모든 유저들에게 메세지 전송
                if (socket.user) {
                    io.to(discussionId).emit(event.info, `${socket.user.nickname} 님이 채팅에 참여하셨습니다.`);
                }
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
        }catch (error) {
            console.error(error);
        }
    });
};