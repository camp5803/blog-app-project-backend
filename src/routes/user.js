import express from 'express';
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from '@/controller/index';

const router = express.Router();

router.route('user')
    .get(getAllUsers)
    .post(createUser);

router.route('/user/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

/** 아래와 같은 경우에만 router.route() 사용하기 !!
 * URI는 동일하나, Method가 여러가지인 경우엔 router.route()가 더 가독성이 좋을 수 있음
 * 반면에, 동일한 Method가 없는 경우엔 반드시 router.method("/uri", middlewares) 처럼 작성하기
 * 자세한건 의논 후 router.route()를 사용할 지, router.method()를 사용할지 정하기
 * 
 * + API 엔드포인트 결정 시 RESTful하게 작성하도록 노력하기
 * 
 * router.route('/user')
    .get(readAllUser)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser);
 */

export default router;
