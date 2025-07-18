import React, { useState } from "react";
import "./Card.css";
import Modal from "../Modal/Modal";

const Card = ({ pokemon }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="card" onClick={handleCardClick}>
        <div className="cardImg">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
        <div className="cardInfo">
          <span className="cardNumber">#{pokemon.id}</span>
          <h3 className="cardName">{pokemon.japaneseName || pokemon.name}</h3>
          <div className="cardTypes">
            <div>タイプ</div>
            {pokemon.types.map((type) => {
              return (
                <div className="type" key={type.type.name}>
                  <span className="typeName">{type.japaneseName || type.type.name}</span>
                </div>
              );
            })}
          </div>
          <div className="cardInfo">
            <div className="cardData">
              <p className="title">重さ: {pokemon.weight}</p>
            </div>
            <div className="cardData">
              <p className="title">高さ: {pokemon.height}</p>
            </div>
            <div className="cardData">
              <p className="title">アビリティ: {pokemon.abilities[0].japaneseName || pokemon.abilities[0].ability.name}</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal pokemon={pokemon} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default Card;