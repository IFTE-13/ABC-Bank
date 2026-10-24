// ABC Bank - Minimalist Banking Logic - Pure Vanilla JS
(function () {
  const STORAGE_KEY = "abc_bank_state_v3";

  // Default initial state
  const defaultState = {
    user: {
      name: "Alex Morgan",
      isLoggedIn: false,
    },
    balance: 1240.0,
    totalDeposits: 1240.0,
    totalWithdrawals: 0.0,
    transactions: [
      {
        id: "tx-1",
        type: "deposit",
        amount: 1200.0,
        note: "Initial account opening",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "tx-2",
        type: "deposit",
        amount: 40.0,
        note: "Interest credit",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  };

  // State
  let state = loadState();

  // Screen Elements
  const loginScreen = document.getElementById("login-screen");
  const dashboardScreen = document.getElementById("dashboard-screen");
  const loginForm = document.getElementById("login-form");
  const loginUsernameInput = document.getElementById("login-username");
  const logoutBtn = document.getElementById("logout-btn");
  const headerUserName = document.getElementById("header-user-name");
  const cardHolderName = document.getElementById("card-holder-name");

  // Dashboard Elements
  const balanceEl = document.getElementById("balance-display");
  const totalDepositEl = document.getElementById("total-deposit-display");
  const totalWithdrawEl = document.getElementById("total-withdraw-display");
  const formEl = document.getElementById("transaction-form");
  const amountInput = document.getElementById("amount-input");
  const noteInput = document.getElementById("note-input");
  const submitBtn = document.getElementById("submit-btn");
  const messageBar = document.getElementById("message-bar");
  const txListEl = document.getElementById("transaction-list");
  const depositTab = document.getElementById("tab-deposit");
  const withdrawTab = document.getElementById("tab-withdraw");
  const quickAmountBtns = document.querySelectorAll(".chip-btn");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const resetAppBtn = document.getElementById("reset-app-btn");

  let currentMode = "deposit"; // 'deposit' or 'withdraw'

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.totalDeposits === undefined) parsed.totalDeposits = 1240.0;
        if (parsed.totalWithdrawals === undefined) parsed.totalWithdrawals = 0.0;
        return parsed;
      }
    } catch (e) {
      console.warn("Storage not available, using default", e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  function formatDate(isoString) {
    const d = new Date(isoString);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isToday) return `Today, ${time}`;

    const date = d.toLocaleDateString([], { month: "short", day: "numeric" });
    return `${date}, ${time}`;
  }

  function updateAuthViews() {
    if (state.user && state.user.isLoggedIn) {
      loginScreen.classList.add("hidden");
      dashboardScreen.classList.remove("hidden");

      const name = state.user.name || "Alex Morgan";
      headerUserName.textContent = name;
      cardHolderName.textContent = name.toUpperCase();
    } else {
      loginScreen.classList.remove("hidden");
      dashboardScreen.classList.add("hidden");
      if (state.user && state.user.name) {
        loginUsernameInput.value = state.user.name;
      }
    }
  }

  function renderDashboard() {
    // 1. Balance
    balanceEl.textContent = formatter.format(state.balance);

    // 2. Summary stats (preserve totals even if log is cleared)
    const totalDeposited = state.totalDeposits !== undefined ? state.totalDeposits : 1240;
    const totalWithdrawn = state.totalWithdrawals !== undefined ? state.totalWithdrawals : 0;

    totalDepositEl.textContent = `+${formatter.format(totalDeposited)}`;
    totalWithdrawEl.textContent = `-${formatter.format(totalWithdrawn)}`;

    // 3. Transactions list
    txListEl.innerHTML = "";

    if (!state.transactions || state.transactions.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty-state";
      empty.textContent = "No recent transactions";
      txListEl.appendChild(empty);
      return;
    }

    state.transactions.forEach((tx) => {
      const item = document.createElement("li");
      item.className = "transaction-item";

      const info = document.createElement("div");
      info.className = "tx-info";

      const title = document.createElement("div");
      title.className = "tx-description";
      title.textContent = tx.note || (tx.type === "deposit" ? "Deposit" : "Withdrawal");

      const time = document.createElement("div");
      time.className = "tx-time";
      time.textContent = formatDate(tx.timestamp);

      info.appendChild(title);
      info.appendChild(time);

      const amount = document.createElement("div");
      amount.className = `tx-amount ${tx.type === "deposit" ? "credit" : "debit"}`;
      amount.textContent = `${tx.type === "deposit" ? "+" : "-"}${formatter.format(tx.amount)}`;

      item.appendChild(info);
      item.appendChild(amount);
      txListEl.appendChild(item);
    });
  }

  function showMessage(text, isError = false) {
    messageBar.textContent = text;
    messageBar.className = `message-bar ${isError ? "error" : "success"}`;
    messageBar.style.display = "block";

    setTimeout(() => {
      messageBar.style.display = "none";
    }, 3200);
  }

  function setMode(mode) {
    currentMode = mode;
    if (mode === "deposit") {
      depositTab.classList.add("active");
      depositTab.setAttribute("aria-selected", "true");
      withdrawTab.classList.remove("active");
      withdrawTab.setAttribute("aria-selected", "false");
      submitBtn.textContent = "Deposit Funds";
      amountInput.placeholder = "0.00";
    } else {
      withdrawTab.classList.add("active");
      withdrawTab.setAttribute("aria-selected", "true");
      depositTab.classList.remove("active");
      depositTab.setAttribute("aria-selected", "false");
      submitBtn.textContent = "Withdraw Funds";
      amountInput.placeholder = "0.00";
    }
    amountInput.focus();
  }

  // --- Auth Handlers ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredName = loginUsernameInput.value.trim() || "Alex Morgan";
    state.user = {
      name: enteredName,
      isLoggedIn: true,
    };
    saveState();
    updateAuthViews();
    renderDashboard();
  });

  logoutBtn.addEventListener("click", () => {
    state.user.isLoggedIn = false;
    saveState();
    updateAuthViews();
  });

  // --- Transaction Handlers ---
  depositTab.addEventListener("click", () => setMode("deposit"));
  withdrawTab.addEventListener("click", () => setMode("withdraw"));

  quickAmountBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      amountInput.value = btn.dataset.amount;
      amountInput.focus();
    });
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const rawValue = parseFloat(amountInput.value);
    const note = noteInput.value.trim();

    if (isNaN(rawValue) || rawValue <= 0) {
      showMessage("Please enter a valid positive amount.", true);
      amountInput.focus();
      return;
    }

    const amount = Math.round(rawValue * 100) / 100;

    if (currentMode === "withdraw" && amount > state.balance) {
      showMessage("Insufficient funds. Cannot withdraw more than balance.", true);
      amountInput.focus();
      return;
    }

    // Apply transaction
    if (currentMode === "deposit") {
      state.balance += amount;
      state.totalDeposits = (state.totalDeposits || 0) + amount;
    } else {
      state.balance -= amount;
      state.totalWithdrawals = (state.totalWithdrawals || 0) + amount;
    }

    if (!Array.isArray(state.transactions)) {
      state.transactions = [];
    }

    // Add to history
    state.transactions.unshift({
      id: "tx-" + Date.now(),
      type: currentMode,
      amount: amount,
      note: note || (currentMode === "deposit" ? "Deposit" : "Withdrawal"),
      timestamp: new Date().toISOString(),
    });

    saveState();
    renderDashboard();

    // Reset inputs
    amountInput.value = "";
    noteInput.value = "";
    showMessage(`${currentMode === "deposit" ? "Deposited" : "Withdrawn"} ${formatter.format(amount)} successfully.`);
  });

  // Direct, reliable clear without blocking confirm popups
  clearHistoryBtn.addEventListener("click", () => {
    if (!state.transactions || state.transactions.length === 0) {
      showMessage("Recent activity is already empty.");
      return;
    }
    state.transactions = [];
    saveState();
    renderDashboard();
    showMessage("Recent activity log cleared.");
  });

  resetAppBtn.addEventListener("click", () => {
    const currentUserName = state.user?.name || "Alex Morgan";
    state = JSON.parse(JSON.stringify(defaultState));
    state.user.name = currentUserName;
    state.user.isLoggedIn = true;
    saveState();
    renderDashboard();
    showMessage("Account reset to default.");
  });

  // Init
  updateAuthViews();
  if (state.user && state.user.isLoggedIn) {
    renderDashboard();
  }
})();
