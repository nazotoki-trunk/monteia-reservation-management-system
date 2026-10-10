import { CHALLENGES, TABLE_NUMBERS, getReservation, isCorrectSelection } from "./puzzles.mjs";

const ICON_PATHS = Object.freeze({
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  shield: '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  tables: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  note: '<path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6"/>',
});

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

function focusHeading(container) {
  container.querySelector("h1").focus({ preventScroll: true });
}

function renderWelcome(container, onBegin) {
  container.innerHTML = `
    <section class="card" aria-labelledby="welcome-heading">
      <div class="welcome">
        <div class="welcome-illustration" aria-hidden="true">
          <svg viewBox="0 0 64 64"><rect x="13" y="14" width="38" height="40" rx="5" fill="white"/><path d="M23 9v11m18-11v11M13 27h38m-27 12 6 6 12-13"/></svg>
        </div>
        <p class="eyebrow">レストラン モンテイア</p>
        <h1 id="welcome-heading" tabindex="-1">予約管理システム</h1>
        <p class="intro">店内の予約情報を確認するシステムです。<br>下のボタンからお進みください。</p>
        <button type="button" class="button button-primary" id="begin-button">すすむ ${icon("arrow")}</button>
        <p class="welcome-note">${icon("shield")} ロボットでないことを確認します</p>
      </div>
      <p class="card-bottom">スタッフ用 ／ 予約情報照会</p>
    </section>`;
  container.querySelector("#begin-button").addEventListener("click", onBegin);
  focusHeading(container);
}

function tileMarkup(tile, index) {
  // The SVG viewport displays an unchanged part of the supplied reference.
  // Keeping the source artwork preserves every clue, including letter sizes.
  return `<button class="tile" type="button" data-tile="${index}" aria-pressed="false" aria-label="${tile.label}">
    <svg class="tile-art" viewBox="${tile.viewport}" aria-hidden="true" focusable="false">
      <image href="./assets/puzzle-reference.png" width="1116" height="786"/>
    </svg>
    <span class="tile-check" aria-hidden="true">${icon("check")}</span>
  </button>`;
}

function animateRejection(element) {
  element.classList.remove("shake");
  // Restart the same short animation for consecutive unsuccessful attempts.
  void element.offsetWidth;
  element.classList.add("shake");
}

function renderChallenge(container, challenge, onVerified) {
  container.innerHTML = `
    <section class="card" aria-labelledby="challenge-heading">
      <div class="verification-top">
        <span class="verification-label">${icon("shield")} セキュリティチェック</span>
        <span class="verification-number">${challenge.number} / ${CHALLENGES.length}</span>
      </div>
      <div class="challenge-body">
        <div class="challenge-heading">
          <p class="small-label">私はロボットではありません</p>
          <h1 id="challenge-heading" tabindex="-1">${challenge.title}</h1>
          <p id="challenge-instruction">のタイルを下からすべて選んでください</p>
        </div>
        <div class="tile-grid" role="group" aria-labelledby="challenge-heading" aria-describedby="challenge-instruction">
          ${challenge.tiles.map(tileMarkup).join("")}
        </div>
        <div class="selection-bar">
          <span id="selection-count" aria-live="polite">0枚選択中</span>
          <button id="clear-selection" class="clear-selection" type="button" disabled>${icon("reset")} 選択を解除</button>
        </div>
        <p class="verification-feedback" id="verification-feedback" role="status" aria-live="polite" aria-atomic="true"></p>
        <button type="button" class="button button-verify" id="verify-button">確認 ${icon("arrow")}</button>
        <p class="verification-footer">選択したタイルをもう一度押すと、解除できます。</p>
      </div>
    </section>`;

  const selectedTiles = new Set();
  const tileButtons = [...container.querySelectorAll("[data-tile]")];
  const grid = container.querySelector(".tile-grid");
  const counter = container.querySelector("#selection-count");
  const feedback = container.querySelector("#verification-feedback");
  const verifyButton = container.querySelector("#verify-button");
  const clearButton = container.querySelector("#clear-selection");
  let transitionTimer;

  function updateSelection() {
    tileButtons.forEach((button, index) => {
      button.setAttribute("aria-pressed", String(selectedTiles.has(index)));
    });
    counter.textContent = `${selectedTiles.size}枚選択中`;
    clearButton.disabled = selectedTiles.size === 0;
    feedback.textContent = "";
    feedback.classList.remove("success");
  }

  function rejectSelection() {
    feedback.textContent = "選択が正しくありません。もう一度お試しください。";
    animateRejection(grid);
  }

  function acceptSelection() {
    verifyButton.disabled = true;
    clearButton.disabled = true;
    tileButtons.forEach((button) => { button.disabled = true; });
    feedback.classList.add("success");
    feedback.textContent = "確認できました。次へ進みます。";
    verifyButton.innerHTML = `${icon("check")} 確認完了`;
    transitionTimer = setTimeout(onVerified, 550);
  }

  tileButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (selectedTiles.has(index)) selectedTiles.delete(index);
      else selectedTiles.add(index);
      updateSelection();
    });
  });
  clearButton.addEventListener("click", () => {
    selectedTiles.clear();
    updateSelection();
  });
  verifyButton.addEventListener("click", () => {
    if (isCorrectSelection(challenge, selectedTiles)) acceptSelection();
    else rejectSelection();
  });
  focusHeading(container);
  return () => clearTimeout(transitionTimer);
}

function renderTables(container, onSelectTable) {
  container.innerHTML = `
    <section class="card table-card" aria-labelledby="table-heading">
      <div class="card-body">
        <div class="section-icon" aria-hidden="true">${icon("tables")}</div>
        <p class="eyebrow">RESERVATION LOOKUP</p>
        <h1 id="table-heading" class="table-title" tabindex="-1">卓番号を選択してください</h1>
        <p class="table-description">確認する卓の番号を押してください。</p>
        <div class="table-grid" role="group" aria-labelledby="table-heading">
          ${TABLE_NUMBERS.map((number) => `<button class="table-button" type="button" data-table="${number}" aria-label="${number}卓"><span class="table-number">${number}</span><span class="table-unit">卓</span></button>`).join("")}
        </div>
      </div>
      <p class="card-bottom">${icon("check")} セキュリティチェックが完了しました</p>
    </section>`;
  container.querySelectorAll("[data-table]").forEach((button) => {
    button.addEventListener("click", () => onSelectTable(Number(button.dataset.table)));
  });
  focusHeading(container);
}

function renderReservation(container, reservation, onBack) {
  container.innerHTML = `
    <section class="card record" aria-labelledby="reservation-heading">
      <div class="card-body">
        <button class="back-link" type="button" id="back-to-tables">${icon("back")} 卓の選択に戻る</button>
        <div class="record-heading">
          <div><p class="eyebrow">RESERVATION DETAIL</p><h1 id="reservation-heading" tabindex="-1">${reservation.tableNumber}<span>卓</span></h1></div>
          <span class="record-status"><span class="status-dot" aria-hidden="true"></span>予約情報</span>
        </div>
        <table class="reservation-table" aria-label="${reservation.tableNumber}卓の予約者一覧">
          <thead><tr><th scope="col">番号</th><th scope="col">お名前</th><th scope="col">性別</th></tr></thead>
          <tbody>${reservation.guests.map((guest) => `<tr><td>${guest.seat}</td><td${guest.name === "-" ? ' class="empty-seat"' : ""}>${guest.name}</td><td>${guest.gender}</td></tr>`).join("")}</tbody>
        </table>
        <section class="reservation-note" aria-labelledby="note-heading">
          <h2 id="note-heading">${icon("note")} 備考</h2>
          <p>${reservation.note}</p>
        </section>
      </div>
      <p class="card-bottom">モンテイア ／ 予約情報照会</p>
    </section>`;
  container.querySelector("#back-to-tables").addEventListener("click", onBack);
  focusHeading(container);
}

function updateProgress(progress, currentStep) {
  progress.querySelectorAll("[data-step]").forEach((step, index) => {
    step.classList.toggle("current", index === currentStep);
    step.classList.toggle("complete", index < currentStep);
    if (index === currentStep) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
    step.querySelector(".step-mark").textContent = index < currentStep ? "✓" : String(index + 1);
  });
}

function createUnavailableNotice(document) {
  const dialog = document.getElementById("unavailable-dialog");
  const description = document.getElementById("unavailable-description");
  document.getElementById("close-unavailable").addEventListener("click", () => dialog.close());
  return (tableNumber) => {
    description.textContent = `${tableNumber}卓の予約情報は、現在閲覧できません。他の卓を選択してください。`;
    dialog.showModal();
  };
}

function bindRestartConfirmation(document, onRestart) {
  const dialog = document.getElementById("restart-dialog");
  document.getElementById("restart-button").addEventListener("click", () => dialog.showModal());
  document.getElementById("cancel-restart").addEventListener("click", () => dialog.close());
  document.getElementById("confirm-restart").addEventListener("click", () => {
    dialog.close();
    onRestart();
  });
}

function initializeApplication(document) {
  const container = document.getElementById("screen");
  const progress = document.getElementById("progress");
  const restartButton = document.getElementById("restart-button");
  const showUnavailableNotice = createUnavailableNotice(document);
  let disposeView = () => {};

  function mountView(render) {
    disposeView();
    disposeView = render() ?? (() => {});
  }

  function showWelcome() {
    updateProgress(progress, 0);
    restartButton.hidden = true;
    mountView(() => renderWelcome(container, showFirstChallenge));
  }

  function showFirstChallenge() {
    updateProgress(progress, 1);
    restartButton.hidden = false;
    mountView(() => renderChallenge(container, CHALLENGES[0], showSecondChallenge));
  }

  function showSecondChallenge() {
    mountView(() => renderChallenge(container, CHALLENGES[1], showTables));
  }

  function showTables() {
    updateProgress(progress, 2);
    mountView(() => renderTables(container, openTable));
  }

  function openTable(tableNumber) {
    const reservation = getReservation(tableNumber);
    if (!reservation) {
      showUnavailableNotice(tableNumber);
      return;
    }
    mountView(() => renderReservation(container, reservation, showTables));
  }

  bindRestartConfirmation(document, showWelcome);
  showWelcome();
}

initializeApplication(document);
