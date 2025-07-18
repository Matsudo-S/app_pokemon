import React, { useEffect, useState } from 'react';
import './FVAnimation.css';

const FVAnimation = ({ onAnimationComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // sessionStorageでアニメーション表示済みかチェック
    const hasShownAnimation = sessionStorage.getItem('fvAnimationShown');
    
    if (!hasShownAnimation) {
      setIsVisible(true);
      
      // アニメーション完了後にsessionStorageに記録
      const timer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('fvAnimationShown', 'true');
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 3000); // 3秒でアニメーション完了

      return () => clearTimeout(timer);
    } else {
      // 既に表示済みの場合は即座にコールバックを呼び出し
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  }, [onAnimationComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fv-animation-overlay">
      <div className="fv-animation-container">
        <div className="pokeball-animation">
          <div className="pokeball-top"></div>
          <div className="pokeball-center"></div>
          <div className="pokeball-bottom"></div>
        </div>
      </div>
    </div>
  );
};

export default FVAnimation; 