// src/routes/users.ts
import { Router } from 'express';
// import { pool } from '../index'; // 필요한 경우

const router = Router();

// 모든 사용자 목록 가져오기 (관리자 전용 등)
router.get('/', (req, res) => {
    console.log('모든 사용자 목록 요청');
    res.status(200).json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

// 특정 사용자 정보 가져오기
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    console.log(`${userId}번 사용자 정보 요청`);
    res.status(200).json({ id: userId, name: `User ${userId}`, email: `user${userId}@example.com` });
});

// 사용자 정보 업데이트
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    console.log(`${userId}번 사용자 정보 업데이트 요청:`, req.body);
    res.status(200).json({ message: `${userId}번 사용자 정보가 업데이트되었습니다.` });
});

// 사용자 삭제
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    console.log(`${userId}번 사용자 삭제 요청`);
    res.status(204).send(); // No Content
});

export default router;