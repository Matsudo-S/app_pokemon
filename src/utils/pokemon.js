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

// 日本語の種族データを取得
export const getSpeciesData = (speciesUrl) => {
  return fetch(speciesUrl).then(response => response.json());
};

// 日本語のアビリティデータを取得
export const getAbilityData = (abilityUrl) => {
  return fetch(abilityUrl).then(response => response.json());
};

// 日本語のタイプデータを取得
export const getTypeData = (typeUrl) => {
  return fetch(typeUrl).then(response => response.json());
};

// ステータス名の日本語マッピング
export const getStatJapaneseName = (statName) => {
  const statMapping = {
    'hp': 'たいりょく',
    'attack': 'こうげき',
    'defense': 'ぼうぎょ',
    'special-attack': 'とくこう',
    'special-defense': 'とくぼう',
    'speed': 'すばやさ'
  };
  return statMapping[statName] || statName;
};