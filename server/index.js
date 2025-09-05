import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import sql from 'mssql'; // mssql 모듈 import
// 라우트 모듈
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import boardRoutes from './routes/board.js';
import teaRoutes from './routes/tea.js';

// .env 파일에서 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // 포트 정의, 기본값은 5000

// --- 미들웨어 설정 ---
app.use(express.json()); // 들어오는 JSON 요청 파싱
app.use(cookieParser()); // 클라이언트 요청 객체에 첨부된 쿠키 파싱

// CORS 설정
app.use(cors({
    origin: 'https://teaworld-baekseunguk-baekseunguks-projects.vercel.app', // 프론트엔드 요청 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드 지정
    credentials: true, // 요청과 함께 쿠키 전송 허용
}));

// MSSQL 연결 풀 설정
const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        // 운영 환경에서는 일반적으로 trustServerCertificate를 false로 설정하고
        // 신뢰할 수 있는 CA(인증기관)가 서명한 인증서를 사용해야 합니다.
        // encrypt: process.env.DB_ENCRYPT === 'true', // 암호화 여부를 환경 변수로 설정
        // trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', // 서버 인증서 신뢰 여부를 환경 변수로 설정
        encrypt: true,
        trustServerCertificate: false,
    }
};

// MSSQL 연결 풀 생성
export const pool = new sql.ConnectionPool(dbConfig);

// 데이터베이스 연결
pool.connect()
    .then(() => {
        console.log('MSSQL 데이터베이스에 성공적으로 연결되었습니다!');
    })
    .catch((err) => {
        console.error('MSSQL 연결 오류:', err);
        // 데이터베이스 연결 실패 시 프로세스를 종료하는 것이 좋습니다.
        process.exit(1);
    });

// 라우트
// 루트 URL에 대한 기본 라우트
app.get('/', (req, res) => {
    res.send('서버에 오신 것을 환영합니다!');
});

// '/api/auth' 경로로 authRoutes 연결
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/board', boardRoutes);
app.use('/tea', teaRoutes);

// 서버 초기화
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

// 서버 종료
process.on('SIGINT', () => {
    console.log('서버 종료 중...');
    pool.close()
        .then(() => {
            console.log('MSSQL 연결 풀이 닫혔습니다.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('MSSQL 연결 풀 닫기 오류:', err);
            process.exit(1);
        });
});