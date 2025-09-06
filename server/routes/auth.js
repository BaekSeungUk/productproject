// src/routes/auth.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // 비밀번호 해싱 및 비교용
import { pool } from '../index.js';

const router = Router();

// --- DB에서 사용자 정보를 가져오는 헬퍼 함수 ---
async function getUserByEmail(email) {
    try {
        const request = pool.request();
        // SQL Injection 방지를 위해 입력 매개변수를 사용합니다.
        request.input('email', email);
        const result = await request.query`
        SELECT user_id, username, email, passwordhash 
        FROM Users 
        WHERE email = @email`;
        console.log("두번째 결과:", result.recordset[0]);
        if (result.recordset.length > 0) {
            return result.recordset[0];
        }
        return null;
    } catch (error) {
        console.error('getUserByEmail 데이터베이스 쿼리 오류:', error);
        throw new Error('데이터베이스에서 사용자를 가져오지 못했습니다.');
    }
}

// 회원가입 라우트
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body; // 사용자가 입력한 평문 비밀번호 (password)를 받습니다.

    // 필수 필드 유효성 검사
    if (!username || !email || !password) {
        return res.status(400).json({ message: '회원가입에 필요한 모든 필드를 입력해주세요.' });
    }

    try {
        // 1. 이미 존재하는 사용자인지 이메일로 확인합니다.
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: '해당 이메일로 이미 가입된 사용자가 있습니다.' });
        }

        // 2. 사용자가 입력한 평문 비밀번호를 해싱합니다.
        // bcrypt.hash(평문 비밀번호, 솔트 라운드 수)
        const hashedPassword = await bcrypt.hash(password, 10); // 여기서 비밀번호를 해싱합니다!
        // '10'은 솔트 라운드 수로, 높을수록 보안에 강하지만 해싱 시간이 길어집니다. 10~12가 일반적입니다.

        // 3. MSSQL 데이터베이스에 사용자 정보를 삽입합니다.
        const request = pool.request();
        request.input('username', username);
        request.input('email', email);
        request.input('hashedPassword', hashedPassword); // 해싱된 비밀번호를 입력 파라미터로 설정합니다.

        await request.query`
            INSERT INTO Users (
            username, 
            email, 
            passwordhash) 
            VALUES (
            @username, 
            @email, 
            @hashedPassword) 
        `;

        res.status(201).json({ message: '사용자 회원가입 성공!' });

    } catch (error) {
        console.error('사용자 회원가입 중 오류 발생:', error);
        // 데이터베이스 오류일 수 있으므로 구체적인 메시지는 피합니다.
        res.status(500).json({ message: '회원가입 중 서버 내부 오류가 발생했습니다.' });
    }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userInfo = await getUserByEmail(email);

        if (!userInfo) {
            return res.status(403).json("유효하지 않은 자격 증명");
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, userInfo.passwordhash);

        if (!isPasswordValid) {
            return res.status(403).json("유효하지 않은 자격 증명");
        }

        // Access Token 발급
        const accessToken = jwt.sign({
            id: userInfo.user_id,
            username: userInfo.username,
            email: userInfo.email,
        }, process.env.ACCESS_SECRET, {
            expiresIn: '1h',
            issuer: 'About Tech',
        });

        // Refresh Token 발급
        const refreshToken = jwt.sign({
            id: userInfo.user_id,
            username: userInfo.username,
            email: userInfo.email,
        }, process.env.REFRESH_SECRET, {
            expiresIn: '24h',
            issuer: 'About Tech',
        });

        // 배포 환경에서 쿠키 문제 해결을 위해 옵션을 명확히 지정
        // 특히 sameSite: 'None', secure: true가 필요 (https 환경)
        // 개발 환경에서는 Lax/false로 설정
        const isProd = process.env.NODE_ENV === 'production';

        // 도메인 명시적으로 지정 (Vercel 등에서 cross-device 문제 방지)
        // 실제 배포 도메인에 맞게 수정 필요
        const cookieDomain = isProd ? '.teaworld.vercel.app' : undefined;

        res.cookie('accessToken', accessToken, {
            path: '/',
            secure: isProd, // 배포 환경에서는 true
            httpOnly: true,
            sameSite: isProd ? 'None' : 'Lax', // 배포 환경에서는 None
            domain: cookieDomain,
        });

        res.cookie('refreshToken', refreshToken, {
            path: '/',
            secure: isProd,
            httpOnly: true,
            sameSite: isProd ? 'None' : 'Lax',
            domain: cookieDomain,
        });

        // CORS preflight 및 쿠키 전달 문제 방지용 헤더 추가
        // 실제로는 서버 index.js에서 credentials: true, origin 명확히 지정 필요
        // res.setHeader('Access-Control-Allow-Credentials', 'true');

        res.status(200).json({
            message: "로그인 성공",
            user: {
                id: userInfo.user_id,
                username: userInfo.username,
                email: userInfo.email,
            }
        });

    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        res.status(500).json('서버 내부 오류');
    }
});

// 로그인 성공
router.get('/success', async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json("Access 토큰이 제공되지 않았습니다.");
        }

        const data = jwt.verify(token, process.env.ACCESS_SECRET);

        const userData = await getUserByEmail(data.email);

        if (!userData) {
            return res.status(404).json("사용자를 찾을 수 없습니다.");
        }

        // password 필드가 passwordhash로 저장되어 있을 수 있으니, passwordhash를 제외
        const { password, passwordhash, ...others } = userData;
        res.status(200).json(others);
    } catch (error) {
        console.error('loginSuccess 중 오류 발생:', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json("Access 토큰이 만료되었습니다. 새로고침하거나 다시 로그인해주세요.");
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json("유효하지 않은 Access 토큰입니다.");
        }
        res.status(500).json('서버 내부 오류');
    }
});
// 로그 아웃
router.post('/logout', (req, res) => {
    try {
        // Access 및 Refresh 토큰 모두 삭제
        res.clearCookie('accessToken', {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });
        res.clearCookie('refreshToken', {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });
        res.status(200).json('로그아웃 성공');
    } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        res.status(500).json('서버 내부 오류');
    }
});

// 비밀번호 재설정 요청 라우트
router.post('/forgot-password', (req, res) => {
    // 비밀번호 재설정 이메일 발송 로직
    console.log('비밀번호 재설정 요청:', req.body.email);
    res.status(200).json({ message: '비밀번호 재설정 이메일이 발송되었습니다.' });
});

// 비밀번호 재설정 요청 라우트 (기존 코드, 재설정 토큰을 저장하지 않는 한 DB 변경 불필요)
// router.post('/forgot-password', (req, res) => {
//     console.log('비밀번호 재설정 요청:', req.body.email);
//     res.status(200).json({ message: '비밀번호 재설정 이메일이 발송되었습니다.' });
// });


export default router; // 생성된 라우터를 내보냅니다.