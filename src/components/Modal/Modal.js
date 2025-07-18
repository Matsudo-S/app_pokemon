import React, { useEffect } from "react";
import "./Modal.css";
import { getStatJapaneseName } from "../../utils/pokemon";

const Modal = ({ pokemon, onClose }) => {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // モーダルの背景クリックで閉じる
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-header">
          <div className="modal-pokemon-image">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            {pokemon.sprites.back_default && (
              <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} />
            )}
          </div>
          <div className="modal-pokemon-info">
            <h2 className="modal-pokemon-name">{pokemon.japaneseName || pokemon.name}</h2>
            <span className="modal-pokemon-number">#{pokemon.id}</span>
            <div className="modal-types">
              {pokemon.types.map((type) => (
                <span key={type.type.name} className="type-badge">
                  {type.japaneseName || type.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3>基本情報</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">高さ:</span>
                <span className="info-value">{pokemon.height / 10}m</span>
              </div>
              <div className="info-item">
                <span className="info-label">重さ:</span>
                <span className="info-value">{pokemon.weight / 10}kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">ベース経験値:</span>
                <span className="info-value">{pokemon.base_experience}</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>アビリティ</h3>
            <div className="abilities-list">
              {pokemon.abilities.map((ability, index) => (
                <div key={ability.ability.name} className="ability-item">
                  <span className="ability-name">{ability.japaneseName || ability.ability.name}</span>
                  {ability.is_hidden && <span className="hidden-ability">隠しアビリティ</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h3>ステータス</h3>
            <div className="stats-grid">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-item">
                  <span className="stat-name">{getStatJapaneseName(stat.stat.name)}</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>

          {pokemon.game_indices && pokemon.game_indices.length > 0 && (
            <div className="modal-section">
              <h3>ゲームでの登場</h3>
              <div className="game-indices">
                {pokemon.game_indices.slice(0, 5).map((game) => (
                  <span key={game.version.name} className="game-badge">
                    {game.version.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pokemon.species && (
            <div className="modal-section">
              <h3>種族情報</h3>
              <div className="species-info">
                <p><strong>種族名:</strong> {pokemon.species.japaneseName || pokemon.species.name}</p>
                <p><strong>捕獲率:</strong> {pokemon.species.capture_rate || 'N/A'}</p>
                <p><strong>孵化歩数:</strong> {pokemon.species.hatch_counter || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal; 