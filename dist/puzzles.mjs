/** Tile order is row-major: top-left, top-right, bottom-left, bottom-right. */
export const CHALLENGES = Object.freeze([
  Object.freeze({
    id: "seasoning",
    title: "調味料",
    number: 1,
    correctTiles: Object.freeze([0, 2]),
    tiles: Object.freeze([
      { viewport: "463 124 94 93", label: "左上のタイル：文字、豆の絵、矢印と疑問符" },
      { viewport: "560 124 94 93", label: "右上のタイル：文字と動物、人形の絵" },
      { viewport: "463 220 94 94", label: "左下のタイル：並んだ複数の「さ」" },
      { viewport: "560 220 94 94", label: "右下のタイル：五線譜と音符" },
    ]),
  }),
  Object.freeze({
    id: "kakerumono",
    title: "かけるもの",
    number: 2,
    correctTiles: Object.freeze([0, 1, 2, 3]),
    tiles: Object.freeze([
      { viewport: "794 124 93 93", label: "左上のタイル：枠の中にある二つの絵" },
      { viewport: "890 124 94 93", label: "右上のタイル：「まみむねも」の文字" },
      { viewport: "794 220 93 94", label: "左下のタイル：「かるた→肩」「はなし→橋」「こたえ→？」" },
      { viewport: "890 220 94 94", label: "右下のタイル：「め」と「く」、山と石の絵" },
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
