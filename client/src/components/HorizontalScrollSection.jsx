import React from 'react';
import './HorizontalScrollSection.css';

const HorizontalScrollSection = () => {
  return (
    <div className="simple-sections">
      <section className="section section-1">
        <div className="section-content">
          <h1>차의 세계로의 초대</h1>
          <p>수천 년의 전통을 담은 차의 아름다움을 발견하세요. 
             자연의 선물인 차는 우리의 마음을 평온하게 하고 몸을 건강하게 합니다.</p>
        </div>
        <div className="image-placeholder">
          <img 
            src="https://images.pexels.com/photos/31155561/pexels-photo-31155561.jpeg" 
            alt="차의 세계" 
          />
        </div>
      </section>

      <section className="section section-2">
        <div className="section-content">
          <h1>차의 종류와 특성</h1>
          <p>녹차, 홍차, 우롱차 등 다양한 차의 종류와 각각의 독특한 맛과 향을 경험해보세요. 
             각 차마다 고유한 제조 과정과 건강상의 이점이 있습니다.</p>
        </div>
        <div className="image-placeholder">
          <img 
            src="https://images.pexels.com/photos/16244203/pexels-photo-16244203.jpeg" 
            alt="차의 종류" 
          />
        </div>
      </section>

      <section className="section section-3">
        <div className="section-content">
          <h1>차 문화와 철학</h1>
          <p>차는 단순한 음료가 아닌 삶의 철학입니다. 
             차 한 잔의 여유로움을 통해 마음의 평화를 찾고, 
             일상의 소중함을 깨닫게 됩니다.</p>
        </div>
        <div className="image-placeholder">
          <img 
            src="https://images.pexels.com/photos/8329305/pexels-photo-8329305.jpeg" 
            alt="차 문화" 
          />
        </div>
      </section>
    </div>
  );
};

export default HorizontalScrollSection;