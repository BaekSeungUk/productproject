import './About.css'

const About = () => {
    return (
        <div className="about-container">
            <h1 className="about-title">차에 대하여</h1>
            <p className="about-desc">
                차(茶)는 인류의 오랜 역사와 함께해온 음료로, 동양과 서양을 막론하고 다양한 문화와 전통 속에서 사랑받아왔습니다. 차는 단순히 목을 축이는 음료를 넘어, 사람과 사람을 이어주는 소통의 매개체이자, 일상 속에서 여유와 휴식을 선사하는 특별한 존재입니다.
            </p>
            <h2 className="about-section-title">차의 역사</h2>
            <p className="about-desc">
                차의 기원은 기원전 중국으로 거슬러 올라가며, 이후 실크로드를 통해 세계 각지로 전파되었습니다. 각 나라와 지역에서는 고유의 차 문화가 발전하였고, 다양한 종류의 차와 다도(茶道)가 생겨났습니다.
            </p>
            <h2 className="about-section-title">차의 종류와 특징</h2>
            <ul className="about-list">
                <li className="about-list-item"><strong>녹차</strong> : 산화 과정을 거치지 않아 맑고 산뜻한 맛이 특징입니다.</li>
                <li className="about-list-item"><strong>홍차</strong> : 완전히 산화시켜 진한 색과 풍부한 향을 지닙니다.</li>
                <li className="about-list-item"><strong>청차(우롱차)</strong> : 부분적으로 산화되어 녹차와 홍차의 중간 맛을 느낄 수 있습니다.</li>
                <li className="about-list-item"><strong>황차</strong> : 약간의 발효를 거쳐 부드럽고 은은한 맛이 납니다.</li>
                <li className="about-list-item"><strong>흑차(보이차 등)</strong> : 발효 과정을 거쳐 깊고 진한 맛과 독특한 향을 가집니다.</li>
            </ul>
            <h2 className="about-section-title">차의 효능</h2>
            <ul className="about-list">
                <li className="about-list-item">항산화 작용으로 노화 방지</li>
                <li className="about-list-item">카페인 함유로 피로 회복 및 집중력 향상</li>
                <li className="about-list-item">소화 촉진 및 체중 관리에 도움</li>
                <li className="about-list-item">심신 안정 및 스트레스 해소</li>
            </ul>
            <h2 className="about-section-title">차와 함께하는 삶</h2>
            <p className="about-desc">
                차 한 잔의 여유는 바쁜 일상 속에서 마음을 가라앉히고, 자신을 돌아보는 시간을 제공합니다. 차를 통해 소중한 사람들과 대화를 나누고, 새로운 문화를 경험해보세요.
            </p>
        </div>
    );
}

export default About;