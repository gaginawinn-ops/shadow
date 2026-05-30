// SHADOWCHAT - full client-side app
// handles auth, DMs, groups, public hubs, real-time messaging, local storage persistence

// ------------------- STORAGE KEYS -------------------
const STORAGE = {
  ACCOUNTS: "shadow_accounts",
  CURRENT_USER: "shadow_current_user",
  MESSAGES: "shadow_messages",
  CHATS_META: "shadow_chats_meta",
  CHANNELS_META: "shadow_channels_meta"
};

// ------------------- SEED DATA -------------------
const SEED_MESSAGES = {
  "dm_ghost": [
    { id: "m1", roomId: "dm_ghost", senderId: "user_ghost", senderName: "GhostWatcher", content: "Connection established. Are you secure?", timestamp: Date.now() - 1800000 },
    { id: "m2", roomId: "dm_ghost", senderId: "ME", senderName: "Me", content: "Affirmative. Vector locked.", timestamp: Date.now() - 1700000 },
    { id: "m3", roomId: "dm_ghost", senderId: "user_ghost", senderName: "GhostWatcher", content: "Encryption active. No traces.", timestamp: Date.now() - 1600000 },
    { id: "m4", roomId: "dm_ghost", senderId: "user_ghost", senderName: "GhostWatcher", content: "Send the coordinates when ready.", timestamp: Date.now() - 300000 }
  ],
  "dm_neon": [
    { id: "m5", roomId: "dm_neon", senderId: "user_neon", senderName: "NeonViper", content: "Where do we meet?", timestamp: Date.now() - 90000000 },
    { id: "m6", roomId: "dm_neon", senderId: "ME", senderName: "Me", content: "Grid sector 7. Midnight.", timestamp: Date.now() - 89000000 },
    { id: "m7", roomId: "dm_neon", senderId: "user_neon", senderName: "NeonViper", content: "Confirmed. Stay dark until then.", timestamp: Date.now() - 88000000 }
  ],
  "pub_nexus": [
    { id: "m10", roomId: "pub_nexus", senderId: "SYS", senderName: "SYSTEM", content: "Global Nexus online. All channels secure.", timestamp: Date.now() - 3600000 },
    { id: "m11", roomId: "pub_nexus", senderId: "user_void", senderName: "VoidRunner", content: "New nodes detected on the eastern grid.", timestamp: Date.now() - 2700000 },
    { id: "m12", roomId: "pub_nexus", senderId: "user_specter", senderName: "SpecterX", content: "Monitoring the activity. Stay dark.", timestamp: Date.now() - 1800000 },
    { id: "m13", roomId: "pub_nexus", senderId: "ME", senderName: "Me", content: "Acknowledged. Standing by.", timestamp: Date.now() - 900000 }
  ],
  "grp_dark": [
    { id: "m20", roomId: "grp_dark", senderId: "user_iron", senderName: "IronMask", content: "Protocol initiated. Lock down all channels.", timestamp: Date.now() - 7200000 },
    { id: "m21", roomId: "grp_dark", senderId: "user_phantom", senderName: "PhantomCell", content: "Copy. Safehouse is secure.", timestamp: Date.now() - 6800000 },
    { id: "m22", roomId: "grp_dark", senderId: "ME", senderName: "Me", content: "In position. Ready to receive.", timestamp: Date.now() - 6400000 },
    { id: "m23", roomId: "grp_dark", senderId: "user_iron", senderName: "IronMask", content: "Rendezvous confirmed.", timestamp: Date.now() - 600000 }
  ]
};

const INIT_CHATS = [
  { id: "dm_ghost", contactId: "user_ghost", contactName: "GhostWatcher", contactStatus: "online", lastMessage: "Send the coordinates when ready.", lastMessageTime: Date.now() - 300000, unreadCount: 2 },
  { id: "dm_steel", contactId: "user_steel", contactName: "SteelByte", contactStatus: "offline", lastMessage: "Protocol secured.", lastMessageTime: Date.now() - 3600000, unreadCount: 0 },
  { id: "dm_neon", contactId: "user_neon", contactName: "NeonViper", contactStatus: "online", lastMessage: "Confirmed. Stay dark until then.", lastMessageTime: Date.now() - 88000000, unreadCount: 5 },
  { id: "dm_shadow", contactId: "user_shadow", contactName: "ShadowPulse", contactStatus: "away", lastMessage: "Initiating radio silence...", lastMessageTime: Date.now() - 172800000, unreadCount: 0 }
];

const INIT_CHANNELS = [
  { id: "pub_nexus", name: "Public Chat", description: "Public Channel Alpha", memberCount: 12847, isJoined: true, type: "public", lastMessage: "Acknowledged. Standing by.", lastMessageTime: Date.now() - 900000, unreadCount: 0 },
  { id: "pub_tech", name: "Tech Underground", description: "Underground Tech Ops", memberCount: 5234, isJoined: false, type: "public", lastMessage: "", lastMessageTime: 0, unreadCount: 0 },
  { id: "pub_crypto", name: "Crypto Operators", description: "Digital Currency Network", memberCount: 8901, isJoined: false, type: "public", lastMessage: "", lastMessageTime: 0, unreadCount: 0 },
  { id: "grp_dark", name: "Dark Room Protocol", description: "Ultra Safe Safehouse", memberCount: 234, isJoined: true, type: "group", lastMessage: "Rendezvous confirmed.", lastMessageTime: Date.now() - 600000, unreadCount: 3 },
  { id: "grp_cyber", name: "Cyber Phantoms", description: "Elite Tech Operators", memberCount: 847, isJoined: false, type: "group", lastMessage: "", lastMessageTime: 0, unreadCount: 0 },
  { id: "grp_shadow", name: "Shadow Council", description: "Inner Circle — Invite Only", memberCount: 42, isJoined: false, type: "group", lastMessage: "", lastMessageTime: 0, unreadCount: 0 }
];

// helper functions for data persistence
function initializeData() {
  if (!localStorage.getItem(STORAGE.ACCOUNTS)) localStorage.setItem(STORAGE.ACCOUNTS, JSON.stringify([]));
  if (!localStorage.getItem(STORAGE.MESSAGES)) localStorage.setItem(STORAGE.MESSAGES, JSON.stringify(SEED_MESSAGES));
  if (!localStorage.getItem(STORAGE.CHATS_META)) localStorage.setItem(STORAGE.CHATS_META, JSON.stringify(INIT_CHATS));
  if (!localStorage.getItem(STORAGE.CHANNELS_META)) localStorage.setItem(STORAGE.CHANNELS_META, JSON.stringify(INIT_CHANNELS));
}

function getMessages() { return JSON.parse(localStorage.getItem(STORAGE.MESSAGES) || "{}"); }
function saveMessages(messages) { localStorage.setItem(STORAGE.MESSAGES, JSON.stringify(messages)); }
function getChats() { return JSON.parse(localStorage.getItem(STORAGE.CHATS_META) || "[]"); }
function saveChats(chats) { localStorage.setItem(STORAGE.CHATS_META, JSON.stringify(chats)); }
function getChannels() { return JSON.parse(localStorage.getItem(STORAGE.CHANNELS_META) || "[]"); }
function saveChannels(channels) { localStorage.setItem(STORAGE.CHANNELS_META, JSON.stringify(channels)); }
function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE.CURRENT_USER);
  return raw ? JSON.parse(raw) : null;
}
function setCurrentUser(user) {
  if (user) localStorage.setItem(STORAGE.CURRENT_USER, JSON.stringify(user));
  else localStorage.removeItem(STORAGE.CURRENT_USER);
}

// ---------- AUTH ACTIONS ----------
async function signIn(email, password) {
  const accounts = JSON.parse(localStorage.getItem(STORAGE.ACCOUNTS) || "[]");
  const found = accounts.find(acc => acc.email === email && acc.password === password);
  if (!found) throw new Error("Invalid credentials");
  const { password: _, ...safeUser } = found;
  setCurrentUser(safeUser);
  return safeUser;
}

async function register(username, email, password) {
  const accounts = JSON.parse(localStorage.getItem(STORAGE.ACCOUNTS) || "[]");
  if (accounts.find(a => a.email === email)) throw new Error("Email already registered");
  const newUser = { id: Date.now() + "-" + Math.random().toString(36).substr(2, 8), username, email, joinedAt: Date.now() };
  accounts.push({ ...newUser, password });
  localStorage.setItem(STORAGE.ACCOUNTS, JSON.stringify(accounts));
  setCurrentUser(newUser);
  return newUser;
}

function signOut() {
  setCurrentUser(null);
  navigateToAuth("login");
}

// ---------- CORE MESSAGING & CHANNELS ----------
function sendMessage(roomId, content) {
  if (!content.trim()) return;
  const user = getCurrentUser();
  const senderName = user?.username || "Me";
  const newMsg = {
    id: Date.now() + "-" + Math.random().toString(36),
    roomId, senderId: "ME", senderName, content, timestamp: Date.now()
  };
  const messages = getMessages();
  const roomMsgs = messages[roomId] || [];
  messages[roomId] = [...roomMsgs, newMsg];
  saveMessages(messages);
  // update meta lastMessage
  let updated = false;
  const chats = getChats();
  const newChats = chats.map(chat => {
    if (chat.id === roomId) {
      updated = true;
      return { ...chat, lastMessage: content, lastMessageTime: Date.now(), unreadCount: 0 };
    }
    return chat;
  });
  if (!updated) {
    const channels = getChannels();
    const newChannels = channels.map(ch => {
      if (ch.id === roomId) return { ...ch, lastMessage: content, lastMessageTime: Date.now(), unreadCount: 0 };
      return ch;
    });
    saveChannels(newChannels);
  } else saveChats(newChats);
  renderCurrentScreen(); // re-render active view
}

function joinChannel(channelId) {
  let channels = getChannels();
  const idx = channels.findIndex(c => c.id === channelId);
  if (idx !== -1 && !channels[idx].isJoined) {
    channels[idx].isJoined = true;
    channels[idx].memberCount += 1;
    saveChannels(channels);
    renderCurrentScreen();
  }
}

function leaveChannel(channelId) {
  let channels = getChannels();
  const idx = channels.findIndex(c => c.id === channelId);
  if (idx !== -1 && channels[idx].isJoined) {
    channels[idx].isJoined = false;
    channels[idx].memberCount -= 1;
    saveChannels(channels);
    renderCurrentScreen();
  }
}

function markAsRead(roomId) {
  let chats = getChats();
  let changed = false;
  const newChats = chats.map(chat => {
    if (chat.id === roomId && chat.unreadCount > 0) { changed = true; return { ...chat, unreadCount: 0 }; }
    return chat;
  });
  if (changed) saveChats(newChats);
  let channels = getChannels();
  const newChannels = channels.map(ch => {
    if (ch.id === roomId && ch.unreadCount > 0) return { ...ch, unreadCount: 0 };
    return ch;
  });
  saveChannels(newChannels);
}

function getOrCreateChat(contactId, contactName, status) {
  let chats = getChats();
  const existing = chats.find(c => c.contactId === contactId);
  if (existing) return existing.id;
  const newId = "dm_" + contactId;
  const newChat = { id: newId, contactId, contactName, contactStatus: status, lastMessage: "", lastMessageTime: Date.now(), unreadCount: 0 };
  saveChats([newChat, ...chats]);
  return newId;
}

// ---------- ROUTING / NAVIGATION STATE ----------
let currentRoute = { screen: "loading" }; // screen: login, register, main, chat, group

function navigateToAuth(screen) {
  currentRoute = { screen };
  renderAuth();
}

function navigateToMain(tab = "home") {
  currentRoute = { screen: "main", tab };
  renderMain();
}

function openChatRoom(roomId, type) {
  markAsRead(roomId);
  currentRoute = { screen: type === "dm" ? "chat" : "group", roomId };
  renderChatRoom(roomId, type);
}

function goBackToMain() {
  navigateToMain(currentRoute.tab || "chats");
}

// ---------- UI RENDERERS ----------
function renderAuth() {
  const app = document.getElementById("app");
  const isLogin = currentRoute.screen === "login";
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-title">⚡ SHADOWCHAT</div>
        <div class="input-group"><label>EMAIL</label><input id="email" type="email" placeholder="operator@shadow.net"></div>
        <div class="input-group"><label>PASSWORD</label><input id="password" type="password" placeholder="••••••"></div>
        ${!isLogin ? '<div class="input-group"><label>USERNAME</label><input id="username" placeholder="Handle"></div>' : ''}
        <button class="btn-primary" id="submitBtn">${isLogin ? 'ENTER THE GRID' : 'REGISTER'}</button>
        <div class="auth-footer">${isLogin ? 'No access? ' : 'Already inside? '}<span id="toggleAuth">${isLogin ? 'Create identity' : 'Sign in'}</span></div>
      </div>
    </div>
  `;
  document.getElementById("submitBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    try {
      if (isLogin) await signIn(email, pass);
      else {
        const username = document.getElementById("username").value;
        if (!username) throw new Error("Username required");
        await register(username, email, pass);
      }
      navigateToMain("home");
    } catch(e) { alert(e.message); }
  });
  document.getElementById("toggleAuth")?.addEventListener("click", () => {
    navigateToAuth(isLogin ? "register" : "login");
  });
}

function renderMain() {
  if (!getCurrentUser()) { navigateToAuth("login"); return; }
  const tab = currentRoute.tab || "home";
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="main-layout">
      <div class="screen-container" id="mainScreenContainer"></div>
      <div class="tab-bar" id="tabBar"></div>
    </div>
  `;
  const tabs = [
    { id: "home", icon: "fas fa-home", label: "HOME" },
    { id: "chats", icon: "fas fa-comment-dots", label: "CHATS" },
    { id: "groups", icon: "fas fa-users", label: "GROUPS" },
    { id: "public", icon: "fas fa-globe", label: "PUBLIC" },
    { id: "account", icon: "fas fa-user-astronaut", label: "AGENT" }
  ];
  const tabBar = document.getElementById("tabBar");
  tabBar.innerHTML = tabs.map(t => `<div class="tab-item ${tab === t.id ? 'active' : ''}" data-tab="${t.id}"><i class="${t.icon}"></i><span>${t.label}</span></div>`).join("");
  document.querySelectorAll(".tab-item").forEach(el => {
    el.addEventListener("click", () => {
      currentRoute.tab = el.dataset.tab;
      renderMain();
    });
  });
  const container = document.getElementById("mainScreenContainer");
  if (tab === "home") renderHome(container);
  else if (tab === "chats") renderChatsList(container);
  else if (tab === "groups") renderGroupsList(container, "group");
  else if (tab === "public") renderGroupsList(container, "public");
  else if (tab === "account") renderAccount(container);
}

function renderHome(container) {
  const user = getCurrentUser();
  container.innerHTML = `
    <div style="padding: 20px 16px 0"><h2 style="font-size:28px; font-weight:800">ZERO TRACE</h2><p style="color:#c4b5fd">welcome, ${user?.username || "operator"}</p></div>
    <div class="matrix-log" id="matrixLog"></div>
    <div class="section-title">🔮 active vectors</div>
    <div id="recentChats"></div>
  `;
  // animated matrix log
  const logs = [
    ">>> DETECTING STATE PROPAGATION...",">>> FIXED TIMESTAMP RETENTION ENGINE",">>> P2P STREAM ACTIVE",">>> BUBBLE WRAPPERS INJECTED",">>> ANTI-XSS GATEWAY INTACT",">>> ENCRYPTION LAYER v2.5 ACTIVE",">>> QUANTUM TUNNEL ESTABLISHED",">>> SHADOW PROTOCOL ACTIVE",">>> PEER RELAY 14 NODES ONLINE"
  ];
  const matrixDiv = document.getElementById("matrixLog");
  matrixDiv.innerHTML = `<div class="matrix-header"><span>AUTOMATED ENGINE LOGS</span><span>SHADOW_OS</span></div><div class="matrix-scroll" id="matrixScroll"><div id="matrixLines"></div></div>`;
  const linesContainer = document.getElementById("matrixLines");
  let double = [...logs, ...logs];
  linesContainer.innerHTML = double.map(l => `<div class="matrix-line">${l}</div>`).join("");
  const scrollDiv = document.getElementById("matrixScroll");
  let yOff = 0;
  function animate() {
    if (!scrollDiv) return;
    yOff -= 1;
    if (Math.abs(yOff) >= double.length * 18) yOff = 0;
    linesContainer.style.transform = `translateY(${yOff}px)`;
    requestAnimationFrame(animate);
  }
  animate();
  const recentChats = getChats().slice(0, 3);
  const recentDiv = document.getElementById("recentChats");
  if (recentChats.length) {
    recentDiv.innerHTML = recentChats.map(c => `
      <div class="chat-item" data-room="${c.id}" data-type="dm">
        <div class="avatar"><span>${c.contactName.slice(0,2).toUpperCase()}</span><div class="status-dot" style="background:${c.contactStatus==='online'?'#22c55e':c.contactStatus==='away'?'#f59e0b':'#6b7280'}"></div></div>
        <div class="chat-info"><div class="row-top"><span class="chat-name">${c.contactName}</span><span class="time-ago">${timeAgo(c.lastMessageTime)}</span></div><div class="last-msg">${c.lastMessage || "—"}</div></div>
      </div>
    `).join("");
  } else recentDiv.innerHTML = "<div class='empty-text'>no recent contacts</div>";
  document.querySelectorAll("[data-room]").forEach(el => {
    el.addEventListener("click", () => openChatRoom(el.dataset.room, "dm"));
  });
}

function renderChatsList(container) {
  const chats = getChats();
  if (!chats.length) { container.innerHTML = "<div class='empty-text'>⚡ no direct channels</div>"; return; }
  container.innerHTML = `<div class="section-title">📡 ENCRYPTED DMs</div><div id="chatList"></div>`;
  const listDiv = document.getElementById("chatList");
  listDiv.innerHTML = chats.map(chat => `
    <div class="chat-item" data-room="${chat.id}" data-type="dm">
      <div class="avatar"><span>${chat.contactName.slice(0,2).toUpperCase()}</span><div class="status-dot" style="background:${chat.contactStatus==='online'?'#22c55e':chat.contactStatus==='away'?'#f59e0b':'#6b7280'}"></div></div>
      <div class="chat-info"><div class="row-top"><span class="chat-name">${chat.contactName}</span><span class="time-ago">${timeAgo(chat.lastMessageTime)}</span></div><div class="flex-between"><span class="last-msg">${chat.lastMessage || 'start conversation'}</span>${chat.unreadCount>0 ? `<div class="unread-badge">${chat.unreadCount>9?'9+':chat.unreadCount}</div>` : ''}</div></div>
    </div>
  `).join("");
  document.querySelectorAll("[data-room]").forEach(el => {
    el.addEventListener("click", () => openChatRoom(el.dataset.room, "dm"));
  });
}

function renderGroupsList(container, filterType) {
  let channels = getChannels().filter(ch => ch.type === filterType);
  container.innerHTML = `<div class="section-title">${filterType === "group" ? "🔒 CELLS & SAFEHOUSES" : "🌐 PUBLIC HUBS"}</div><div id="groupList"></div>`;
  const listDiv = document.getElementById("groupList");
  if (!channels.length) { listDiv.innerHTML = "<div class='empty-text'>no channels</div>"; return; }
  listDiv.innerHTML = channels.map(ch => `
    <div class="group-item" data-channel='${JSON.stringify(ch)}'>
      <div class="icon-box"><i class="fas ${ch.type === 'public' ? 'fa-globe' : 'fa-shield-haltered'}" style="color:#a855f7; font-size:24px"></i></div>
      <div class="chat-info"><div class="row-top"><span class="chat-name">${ch.name}</span><span class="time-ago">${timeAgo(ch.lastMessageTime)}</span></div><div class="flex-between"><span class="last-msg">${ch.isJoined ? (ch.lastMessage || ch.description) : ch.description}</span><span style="font-size:11px">${ch.memberCount.toLocaleString()}</span></div></div>
      ${!ch.isJoined ? `<div class="join-btn" data-join="${ch.id}">JOIN</div>` : (ch.unreadCount>0 ? `<div class="unread-badge">${ch.unreadCount}</div>` : '')}
    </div>
  `).join("");
  document.querySelectorAll(".group-item").forEach(el => {
    const chData = JSON.parse(el.dataset.channel);
    const joinBtn = el.querySelector("[data-join]");
    if (joinBtn) joinBtn.addEventListener("click", (e) => { e.stopPropagation(); joinChannel(chData.id); renderMain(); });
    else el.addEventListener("click", () => { if (chData.isJoined) openChatRoom(chData.id, "group"); else alert("join the channel first"); });
  });
}

function renderAccount(container) {
  const user = getCurrentUser();
  container.innerHTML = `
    <div style="padding:24px; text-align:center"><div class="avatar" style="width:80px;height:80px;margin:0 auto 16px;background:#1a1a2e"><span style="font-size:28px">${user?.username?.charAt(0).toUpperCase() || 'U'}</span></div>
    <h3>${user?.username}</h3><p style="color:#6b7280">${user?.email}</p><p style="font-size:12px">joined ${new Date(user?.joinedAt).toLocaleDateString()}</p><button class="btn-primary" id="signOutBtn" style="margin-top:32px">⟁ TERMINATE SESSION</button></div>
  `;
  document.getElementById("signOutBtn")?.addEventListener("click", () => signOut());
}

function renderChatRoom(roomId, type) {
  const app = document.getElementById("app");
  const messages = getMessages()[roomId] || [];
  let title = "";
  if (type === "dm") {
    const chat = getChats().find(c => c.id === roomId);
    title = chat?.contactName || "Contact";
  } else {
    const channel = getChannels().find(c => c.id === roomId);
    title = channel?.name || "Channel";
  }
  app.innerHTML = `
    <div class="chat-room">
      <div class="chat-header"><button class="back-btn" id="backBtn"><i class="fas fa-arrow-left"></i></button><span style="font-weight:700;font-size:18px">${escapeHtml(title)}</span></div>
      <div class="messages-area" id="messagesArea"></div>
      <div class="input-bar"><input id="msgInput" placeholder="Type message..." autocomplete="off"><button id="sendMsgBtn" class="send-btn"><i class="fas fa-paper-plane"></i></button></div>
    </div>
  `;
  const msgArea = document.getElementById("messagesArea");
  function renderMessages() {
    const updated = getMessages()[roomId] || [];
    const currentUser = getCurrentUser();
    msgArea.innerHTML = updated.map(msg => {
      const isMe = msg.senderId === "ME" || msg.senderName === (currentUser?.username || "Me");
      return `<div class="bubble-wrapper ${isMe ? 'bubble-me' : 'bubble-other'}">${!isMe && type !== "dm" ? `<div class="sender-name">${escapeHtml(msg.senderName)}</div>` : ''}<div class="bubble"><div class="msg-text">${escapeHtml(msg.content)}</div><div class="msg-time">${new Date(msg.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div></div></div>`;
    }).join("");
    msgArea.scrollTop = msgArea.scrollHeight;
  }
  renderMessages();
  document.getElementById("sendMsgBtn").addEventListener("click", () => {
    const input = document.getElementById("msgInput");
    if (input.value.trim()) { sendMessage(roomId, input.value); renderMessages(); input.value = ""; }
  });
  document.getElementById("msgInput").addEventListener("keypress", (e) => { if(e.key === "Enter") document.getElementById("sendMsgBtn").click(); });
  document.getElementById("backBtn").addEventListener("click", () => goBackToMain());
}

function renderCurrentScreen() {
  const user = getCurrentUser();
  if (!user && currentRoute.screen !== "login" && currentRoute.screen !== "register") navigateToAuth("login");
  else if (currentRoute.screen === "main") renderMain();
  else if (currentRoute.screen === "chat" || currentRoute.screen === "group") renderChatRoom(currentRoute.roomId, currentRoute.screen);
  else if (currentRoute.screen === "login" || currentRoute.screen === "register") renderAuth();
  else navigateToAuth("login");
}

// helper utils
function timeAgo(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  if (diff < 60000) return "now";
  if (diff < 3600000) return Math.floor(diff/60000)+"m";
  if (diff < 86400000) return Math.floor(diff/3600000)+"h";
  return Math.floor(diff/86400000)+"d";
}
function escapeHtml(str) { return String(str).replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }

// bootstrap
initializeData();
if (getCurrentUser()) navigateToMain("home");
else navigateToAuth("login");
