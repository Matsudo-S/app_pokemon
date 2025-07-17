import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

const Card = ({ pokemon }) => {
  return (
    <div className="card">
      <div className="cardImg">
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      </div>
      <div className="cardInfo">
        <span className="cardNumber">#{pokemon.id}</span>
        <h3 className="cardName">{pokemon.name}</h3>
        <div className="cardTypes">
          <div>タイプ</div>
          {pokemon.types.map((type) => {
            return (
              <div className="type" key={type.type.name}>
                <span className="typeName">{type.type.name}</span>
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
            <p className="title">アビリティ: {pokemon.abilities[0].ability.name}</p>
          </div>
        </div>
        {/* <Link to={`/pokemon/${pokemon.id}`}>
          <button>View</button>
        </Link> */}
      </div>
    </div>
  );
};

export default Card;