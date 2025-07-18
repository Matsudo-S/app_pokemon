import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Card from './components/Card/Card';
import FVAnimation from './components/FVAnimation/FVAnimation';
import { getAllPokemon, getPokemon, getSpeciesData, getAbilityData, getTypeData } from './utils/pokemon';

function App() {

  const initialURL = "https://pokeapi.co/api/v2/pokemon/";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFVAnimation, setShowFVAnimation] = useState(true);
  const TOTAL_POKEMON = 1025; // ポケモンの総数を1025に制限

  useEffect(() => {
    const fetchPokemondata = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細なデータを取得
      loadPokemon(res.results);

      // 次のページと前のページのURLを取得
      setNextUrl(res.next);
      setPrevUrl(res.previous);

      // 総ページ数を計算（1ページあたり20体、総数は1025体）
      setTotalPages(Math.ceil(TOTAL_POKEMON / 20));

      // ローディングを終了
      setLoading(false);
    };
    fetchPokemondata();
  }, []);

  const loadPokemon = async (data) => {
    let pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        // 各ポケモンの詳細なデータを取得
        let pokemonRecord = await getPokemon(pokemon.url);
        
        // 日本語データを取得
        try {
          // 種族データを取得
          const speciesData = await getSpeciesData(pokemonRecord.species.url);
          
          // アビリティの日本語データを取得
          const abilitiesWithJapanese = await Promise.all(
            pokemonRecord.abilities.map(async (ability) => {
              const abilityData = await getAbilityData(ability.ability.url);
              const japaneseName = abilityData.names.find(name => name.language.name === 'ja-Hrkt')?.name || ability.ability.name;
              return {
                ...ability,
                japaneseName: japaneseName
              };
            })
          );
          
          // タイプの日本語データを取得
          const typesWithJapanese = await Promise.all(
            pokemonRecord.types.map(async (type) => {
              const typeData = await getTypeData(type.type.url);
              const japaneseName = typeData.names.find(name => name.language.name === 'ja-Hrkt')?.name || type.type.name;
              return {
                ...type,
                japaneseName: japaneseName
              };
            })
          );
          
          // 日本語の名前を取得
          const japaneseName = speciesData.names.find(name => name.language.name === 'ja-Hrkt')?.name || pokemonRecord.name;
          
          // 種族の日本語名を取得
          const speciesJapaneseName = speciesData.names.find(name => name.language.name === 'ja-Hrkt')?.name || speciesData.name;
          
          return {
            ...pokemonRecord,
            japaneseName: japaneseName,
            abilities: abilitiesWithJapanese,
            types: typesWithJapanese,
            species: {
              ...pokemonRecord.species,
              japaneseName: speciesJapaneseName
            }
          };
        } catch (error) {
          console.error('日本語データの取得に失敗しました:', error);
          return pokemonRecord;
        }
      })
    );
    
    // #1025以降のポケモンをフィルタリング
    const filteredPokemonData = pokemonData.filter(pokemon => pokemon.id <= TOTAL_POKEMON);
    
    setPokemonData(filteredPokemonData);
  };

// 最初のページに移動
const handleFirstPage = async () => {
  if (currentPage !== 1) {
    setLoading(true);
    const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20";
    let data = await getAllPokemon(url);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setCurrentPage(1);
    setLoading(false);
  }
};

// 最後のページに移動
const handleLastPage = async () => {
  if (currentPage !== totalPages) {
    setLoading(true);
    const offset = (totalPages - 1) * 20;
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
    let data = await getAllPokemon(url);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setCurrentPage(totalPages);
    setLoading(false);
  }
};

// 前のページへのボタン
const handlePrevPage = async () => {
  if (prevUrl) {
    // loading
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    // 次のページと前のページのURLを取得
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    // 現在のページを更新
    setCurrentPage(prev => prev - 1);
    // loading終了
    setLoading(false);
  }
};

// 次のページへのボタン
const handleNextPage = async() => {
  if (nextUrl) {
    // loading
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    // 次のページと前のページのURLを取得
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    // 現在のページを更新
    setCurrentPage(prev => prev + 1);
    // loading終了
    setLoading(false);
  }
};

// 特定のページに移動
const handlePageChange = async (pageNumber) => {
  if (pageNumber !== currentPage && pageNumber <= totalPages) {
    setLoading(true);
    const offset = (pageNumber - 1) * 20;
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
    let data = await getAllPokemon(url);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setCurrentPage(pageNumber);
    setLoading(false);
  }
};

// ページ番号の配列を生成
const getPageNumbers = () => {
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
};

// ページ選択のオプションを生成
const getPageOptions = () => {
  const options = [];
  for (let i = 1; i <= totalPages; i++) {
    const startId = (i - 1) * 20 + 1;
    const endId = Math.min(i * 20, TOTAL_POKEMON);
    options.push({
      value: i,
      label: `#${startId} ~ #${endId}`
    });
  }
  return options;
};

// ページ選択ハンドラー
const handlePageSelect = (event) => {
  const selectedPage = parseInt(event.target.value);
  if (selectedPage !== currentPage && selectedPage <= totalPages) {
    handlePageChange(selectedPage);
  }
};

// ページ番号からポケモンの範囲を取得
const getPokemonRange = (pageNumber) => {
  const startId = (pageNumber - 1) * 20 + 1;
  const endId = Math.min(pageNumber * 20, TOTAL_POKEMON);
  return `#${startId} ~ #${endId}`;
};

// ページネーションコンポーネント
const Pagination = () => (
  <div className="pagination">
    <button 
      className="pagination-btn first-btn" 
      onClick={handleFirstPage}
      disabled={currentPage === 1}
      title="最初のページ"
    >
      «
    </button>
    <button 
      className="pagination-btn prev-btn" 
      onClick={handlePrevPage}
      disabled={!prevUrl}
      title="前のページ"
    >
      ‹
    </button>
    
    {getPageNumbers().map((pageNumber) => (
      <button
        key={pageNumber}
        className={`pagination-btn page-btn ${pageNumber === currentPage ? 'active' : ''}`}
        onClick={() => handlePageChange(pageNumber)}
        title={getPokemonRange(pageNumber)}
      >
        {pageNumber}
      </button>
    ))}
    
    <button 
      className="pagination-btn next-btn" 
      onClick={handleNextPage}
      disabled={!nextUrl}
      title="次のページ"
    >
      ›
    </button>
    <button 
      className="pagination-btn last-btn" 
      onClick={handleLastPage}
      disabled={currentPage === totalPages}
      title="最後のページ"
    >
      »
    </button>
  </div>
);

  // FVアニメーション完了時のコールバック
  const handleFVAnimationComplete = () => {
    setShowFVAnimation(false);
  };

  // 実際に表示される内容
  return (
    <div className="App">
      {showFVAnimation && (
        <FVAnimation onAnimationComplete={handleFVAnimationComplete} />
      )}
      {loading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : (
        <>
          <Navbar 
            currentPage={currentPage}
            totalPages={totalPages}
            pageOptions={getPageOptions()}
            onPageSelect={handlePageSelect}
          />
          <Pagination />
          <div className="pokemonCardContainer">
            {pokemonData.map((pokemon, i) => {
              return (
                <Card key={i} pokemon={pokemon} />
              );
            })}
          </div>
          <Pagination />
        </>
      )}
    </div>
  );
}

export default App;
