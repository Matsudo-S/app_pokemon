import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Card from './components/Card/Card';
import { getAllPokemon, getPokemon } from './utils/pokemon';

function App() {

  const initialURL = "https://pokeapi.co/api/v2/pokemon/";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  useEffect(() => {
    const fetchPokemondata = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細なデータを取得
      loadPokemon(res.results);

      // 次のページと前のページのURLを取得
      setNextUrl(res.next);
      setPrevUrl(res.previous);

      // ローディングを終了
      setLoading(false);
    };
    fetchPokemondata();
  }, []);

  const loadPokemon = async (data) => {
    let pokemonData = await Promise.all(
      data.map((pokemon) => {
        // 各ポケモンの詳細なデータを取得
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(pokemonData);
  };

// 前のページへのボタン
const handlePrevPage = async () => {
  // loading
  setLoading(true);
  let data = await getAllPokemon(prevUrl);
  await loadPokemon(data.results);
  // 次のページと前のページのURLを取得
  setNextUrl(data.next);
  setPrevUrl(data.previous);
  // loading終了
  setLoading(false);
};

// 次のページへのボタン
const handleNextPage = async() => {
  // loading
  setLoading(true);
  let data = await getAllPokemon(nextUrl);
  await loadPokemon(data.results);
  // 次のページと前のページのURLを取得
  setNextUrl(data.next);
  setPrevUrl(data.previous);
  // loading終了
  setLoading(false);
};

  // 実際に表示される内容
  return (
    <div className="App">
      {loading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : (
        <>
          <Navbar />
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return (
                  <Card key={i} pokemon={pokemon} />
                );
              })}
            </div>
            <div className='btn'>
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
        </>
      )}
    </div>
  );
}

export default App;
