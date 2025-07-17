// export const getAllPokemons = async (url) => {
//   // 全てのポケモンデータを取得(fetchでデータを取得するまで待ってと命令している)
//   return new Promise((resolve, reject) => {
//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => resolve(data));
//   });
// };

// とりあえず20体のポケモンの情報概要を取得
export const getAllPokemon = (url) => {
  return fetch(url).then(response => response.json());
};

// 20体の各ポケモンの詳細情報を取得
export const getPokemon = (url) => {
  return fetch(url).then(response => response.json());
};