/** Tile order is row-major: top-left, top-right, bottom-left, bottom-right. */
export const CHALLENGES = Object.freeze([
  Object.freeze({
    id: "seasoning",
    title: "調味料",
    number: 1,
    correctTiles: Object.freeze([0, 2]),
    tiles: Object.freeze([
      { image: "./assets/puzzles/1.jpg", label: "左上のタイル：文字、豆の絵、矢印と疑問符" },
      { image: "./assets/puzzles/2.jpg", label: "右上のタイル：文字と動物、人形の絵" },
      { image: "./assets/puzzles/3.jpg", label: "左下のタイル：並んだ複数の「さ」" },
      { image: "./assets/puzzles/4.jpg", label: "右下のタイル：五線譜と音符" },
    ]),
  }),
  Object.freeze({
    id: "kakerumono",
    title: "かけるもの",
    number: 2,
    correctTiles: Object.freeze([0, 1, 2, 3]),
    tiles: Object.freeze([
      { image: "./assets/puzzles/5.jpg", label: "左上のタイル：枠の中にある二つの絵" },
      { image: "./assets/puzzles/6.jpg", label: "右上のタイル：「まみむねも」の文字" },
      { image: "./assets/puzzles/7.jpg", label: "左下のタイル：「かるた→肩」「はなし→橋」「こたえ→？」" },
      { image: "./assets/puzzles/8.jpg", label: "右下のタイル：「め」と「く」、山と石の絵" },
    ]),
  }),
]);

export function isCorrectSelection(challenge, selectedTiles) {
  const uniqueTiles = new Set(selectedTiles);
  return uniqueTiles.size === challenge.correctTiles.length &&
    challenge.correctTiles.every((tile) => uniqueTiles.has(tile));
}

export const TABLE_NUMBERS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]);

const RESERVATION = Object.freeze({
  tableNumber: 3,
  guests: Object.freeze([
    Object.freeze({ seat: 1, name: "大原　啓介", gender: "男" }),
    Object.freeze({ seat: 2, name: "林　友恵", gender: "女" }),
    Object.freeze({ seat: 3, name: "-", gender: "" }),
    Object.freeze({ seat: 4, name: "-", gender: "" }),
  ]),
  note: "「3」と「4」のロウソク準備",
});

export function getReservation(tableNumber) {
  return tableNumber === RESERVATION.tableNumber ? RESERVATION : null;
}
