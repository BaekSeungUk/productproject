import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TeaCategories.css'
import axios from "axios";

// .env 파일에서 API URL을 불러옴
const API_URL = import.meta.env.NEXT_PUBLIC_API_URL;

const teaBenefits = [
    "항산화 작용으로 노화 방지",
    "카페인 함유로 피로 회복 및 집중력 향상",
    "소화 촉진 및 체중 관리에 도움",
    "심신 안정 및 스트레스 해소"
];

const TeaCategories = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 차 데이터 상태
    const [teaData, setTeaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 쿼리스트링에서 type 파라미터 추출
    function getTypeFromQuery(teaList) {
        const params = new URLSearchParams(location.search);
        const type = params.get("type");
        // teaList가 비어있으면 기본값 "녹차" 반환
        if (!teaList || teaList.length === 0) return "녹차";
        // type이 teaList에 존재하는지 확인
        if (type && teaList.some(tea => tea.tea_key === type)) {
            return type;
        }
        return "녹차";
    }

    // 선택된 차 key 상태
    const [selected, setSelected] = useState("녹차");

    // 차 데이터 불러오기 (axios 사용, 함수명도 axios 스타일로 변경)
    useEffect(() => {
        const getTeas = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`https://productproject-b031.onrender.com/tea/list`, {
                    withCredentials: true
                });
                const data = res.data;
                // details가 JSON 문자열이므로 파싱 필요
                const teas = (data.teas || []).map(tea => ({
                    ...tea,
                    details: Array.isArray(tea.details)
                        ? tea.details
                        : (() => {
                            try {
                                return JSON.parse(tea.details);
                            } catch {
                                return [];
                            }
                        })()
                }));
                console.log(data);
                setTeaData(teas);
                // 쿼리스트링에 맞는 selected로 동기화
                setSelected(getTypeFromQuery(teas));
            } catch (err) {
                setError(
                    (err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    "알 수 없는 오류가 발생했습니다."
                );
            } finally {
                setLoading(false);
            }
        };
        getTeas();
        // eslint-disable-next-line
    }, []);

    // location.search가 바뀔 때마다 selected를 동기화
    useEffect(() => {
        setSelected(getTypeFromQuery(teaData));
        // eslint-disable-next-line
    }, [location.search, teaData]);

    // 현재 선택된 차 정보
    const currentTea = teaData.find(tea => tea.tea_key === selected);

    // 버튼 클릭 시 쿼리스트링 변경 및 상태 변경
    const handleNavClick = (key) => {
        navigate(`/teacategories?type=${encodeURIComponent(key)}`);
        // setSelected는 useEffect에서 location.search가 바뀌면 자동으로 동기화됨
    };

    if (loading) {
        return (
            <div className="tea-categories-container">
                <h1 className="tea-categories-title">차의 종류</h1>
                <div style={{ textAlign: "center", margin: "40px 0" }}>차 정보를 불러오는 중입니다...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tea-categories-container">
                <h1 className="tea-categories-title">차의 종류</h1>
                <div style={{ textAlign: "center", color: "red", margin: "40px 0" }}>{error}</div>
            </div>
        );
    }

    return (
        <div className="tea-categories-container">
            <h1 className="tea-categories-title">차의 종류</h1>
            {/* 네비게이션 바 */}
            <nav className="tea-categories-nav">
                {teaData.map(tea => (
                    <button
                        key={tea.tea_key}
                        onClick={() => handleNavClick(tea.tea_key)}
                        className={`tea-categories-nav-btn${selected === tea.tea_key ? " selected" : ""}`}
                    >
                        {tea.name}
                    </button>
                ))}
            </nav>
            {/* 선택된 차 정보 */}
            {currentTea ? (
                <section className="tea-categories-info-section">
                    <h2 className="tea-categories-tea-title">{currentTea.name}</h2>
                    <p className="tea-categories-tea-desc">{currentTea.description}</p>
                    <ul className="tea-categories-tea-details">
                        {Array.isArray(currentTea.details) && currentTea.details.map((d, idx) => (
                            <li key={idx} className="tea-categories-tea-detail-item">{d}</li>
                        ))}
                    </ul>
                </section>
            ) : (
                <section className="tea-categories-info-section">
                    <p>차 정보를 찾을 수 없습니다.</p>
                </section>
            )}
            {/* 차의 효능 */}
            <section className="tea-categories-benefit-section">
                <h3 className="tea-categories-benefit-title">차의 효능</h3>
                <ul className="tea-categories-benefit-list">
                    {teaBenefits.map((b, idx) => (
                        <li key={idx} className="tea-categories-benefit-item">{b}</li>
                    ))}
                </ul>
            </section>
            <p className="tea-categories-bottom-desc">
                차는 단순한 음료를 넘어, 사람과 사람을 이어주는 소통의 매개체이자, 일상 속에서 여유와 휴식을 선사하는 특별한 존재입니다.
            </p>
        </div>
    );
};

export default TeaCategories;