document.addEventListener('DOMContentLoaded', init);

let globalConfig = null;
let toastTimeout;
let allCodes = [];
let isAdmin = false;

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

async function init() {
    if (isMobileDevice()) {
        document.body.classList.add('is-mobile');
    }
    
    if (document.getElementById('codeGrid')) {
        document.body.classList.add('code-page');
        await initCodePage();
        return;
    }

    if (document.getElementById('term-logs')) {
        try {
            const response = await fetch('/config');
            globalConfig = await response.json();
            
            setUi(globalConfig);
            loadEnd(globalConfig.tags);
            startWIBClock();
            await kuroneko(globalConfig);
            loadReminder(); 
            setSearch();
        } catch (e) {
            document.getElementById('term-logs').innerHTML = `<span class="text-red-400 font-bold px-1">SYSTEM FAILURE</span><br>${e.message}`;
        }
    }
}

async function initCodePage() {
    checkAuth();
    setupRouting();
    
    const addForm = document.getElementById('addCodeForm');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            
            const id = 'neko-' + Math.random().toString(36).substr(2, 6);
            
            const title = e.target.title.value;
            const desc = e.target.description.value;
            const content = e.target.content.value;

            btn.innerText = "SAVING...";
            btn.disabled = true;

            try {
                const req = await fetch('/api/code/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, title, description: desc, content })
                });
                
                const res = await req.json();
                
                if(res.status) {
                    document.getElementById('addCodeModal').classList.add('hidden');
                    e.target.reset();
                    loadList();
                    showToast("Snippet Saved!", "success");
                } else {
                    showToast("Error: " + res.message, "error");
                }
            } catch(err) {
                showToast("Connection Error", "error");
            }
            btn.innerText = originalText;
            btn.disabled = false;
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) await loadDetail(id);
    else await loadList();
    
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allCodes.filter(c => 
                (c.title && c.title.toLowerCase().includes(term)) ||
                c.id.toLowerCase().includes(term) || 
                c.description.toLowerCase().includes(term)
            );
            renderGrid(filtered);
        });
    }
}

function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        isAdmin = true;
        updateAdminUI();
    }
}

function updateAdminUI() {
    const loginBtn = document.getElementById('btnLoginNav');
    if (!loginBtn) return;
    
    if(isAdmin) {
        loginBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> LOGOUT';
        loginBtn.classList.replace('border-primary', 'border-red-500');
        loginBtn.classList.replace('text-primary', 'text-red-500');
        loginBtn.onclick = logout;
    } else {
        loginBtn.innerHTML = '<i class="fa-solid fa-user-shield"></i> ADMIN';
        loginBtn.onclick = () => document.getElementById('loginModal').classList.remove('hidden');
    }
}

async function doLogin() {
    const u = document.getElementById('admUser').value.trim();
    const p = document.getElementById('admPass').value.trim();
    const btn = document.getElementById('btnLoginConfirm');
    
    btn.innerText = "CHECKING...";
    
    try {
        const req = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });
        const res = await req.json();
        
        if (res.status) {
            localStorage.setItem('adminToken', res.token);
            isAdmin = true;
            document.getElementById('loginModal').classList.add('hidden');
            updateAdminUI();
            loadList(); 
            showToast('Welcome back, Admin!', 'success');
        } else {
            showToast('Wrong Credentials', 'error');
        }
    } catch (e) {
        showToast('Login Error', 'error');
    }
    btn.innerText = "LOGIN";
}

function logout() {
    localStorage.removeItem('adminToken');
    isAdmin = false;
    location.reload();
}

async function loadList() {
    switchView('home');
    const container = document.getElementById('codeGrid');
    
    container.innerHTML = '<div class="text-center py-10"><i class="fa-solid fa-circle-notch fa-spin text-3xl text-primary"></i></div>';

    try {
        const req = await fetch('/api/admin/list');
        allCodes = await req.json();
        if (!Array.isArray(allCodes)) allCodes = [];
        
        renderGrid(allCodes);
        updateTags(allCodes);
    } catch (e) {
        container.innerHTML = `<div class="text-center text-red-400 font-bold">FAILED TO LOAD DATA</div>`;
    }
}

function renderGrid(data) {
    const container = document.getElementById('codeGrid');
    container.innerHTML = '';
    
    if (data.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-500 py-10 font-bold">NO SNIPPETS FOUND</div>`;
        return;
    }

    data.forEach((item, index) => {
        const tagMatch = item.description.match(/#(\w+)/);
        const tag = tagMatch ? tagMatch[1] : 'snippet';
        const date = new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const displayTitle = item.title || item.id;

        const wrapper = document.createElement('div');
        wrapper.className = "w-full animate-fade-in";
        wrapper.style.animationDelay = `${index * 50}ms`;
        
        const deleteBtn = isAdmin ? `
            <button onclick="deleteCode(event, '${item.id}')" class="text-white bg-red-500 hover:bg-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all px-3 py-1 text-[10px] font-bold rounded">
                <i class="fa-solid fa-trash mr-1"></i> DEL
            </button>
        ` : '';

        wrapper.innerHTML = `
            <div onclick="openDetail('${item.id}')" class="code-card cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                
                <div class="flex items-center gap-4 min-w-0 flex-1">
                    <div class="w-12 h-12 bg-primary/10 text-primary border-2 border-primary/20 flex shrink-0 items-center justify-center font-bold text-lg rounded-lg">&lt;/&gt;</div>
                    <div class="min-w-0">
                        <h4 class="font-bold text-lg text-slate-800 truncate group-hover:text-primary transition-colors capitalize">${displayTitle}</h4>
                        <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-1">
                            <span class="text-[10px] bg-gray-100 px-1 rounded border border-gray-200">${item.id}</span>
                            <span>•</span>
                            <span>${date}</span>
                            <span class="bg-slate-700 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold">#${tag}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
                    ${deleteBtn}
                    <i class="fa-solid fa-chevron-right text-gray-300 group-hover:text-primary transition-colors ml-2"></i>
                </div>

            </div>
        `;
        container.appendChild(wrapper);
    });
}

async function loadDetail(id) {
    window.history.pushState({}, '', `?id=${id}`);
    switchView('detail');
    
    const container = document.getElementById('detailContent');
    const loader = document.getElementById('detailLoader');
    
    container.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        const req = await fetch(`/api/code/${id}`);
        const res = await req.json();

        if (res.status && res.data) {
            const data = res.data;
            const tagMatch = data.description.match(/#(\w+)/);
            const tag = tagMatch ? tagMatch[1] : 'snippet';

            document.getElementById('viewTitle').innerText = data.title || data.id;
            document.getElementById('viewId').innerText = data.id;
            document.getElementById('viewFilename').innerText = `${data.id}.js`;
            document.getElementById('viewDate').innerText = new Date(data.createdAt).toLocaleDateString();
            document.getElementById('viewTag').innerText = tag;
            document.getElementById('viewDesc').innerText = data.description;
            document.getElementById('viewRawLink').onclick = () => window.open(`/code/raw/${data.id}`, '_blank');
            
            const codeBlock = document.getElementById('viewCode');
            const codePre = document.querySelector('#view-detail pre');
            
            if (codePre) {
                codePre.style.whiteSpace = 'pre-wrap';
                codePre.style.wordWrap = 'break-word';
                codePre.style.overflowX = 'hidden';
                codePre.style.wordBreak = 'break-word';
                codePre.style.tabSize = '4';
                codePre.style.MozTabSize = '4';
            }
            
            if (codeBlock) {
                codeBlock.style.whiteSpace = 'pre-wrap';
                codeBlock.style.wordBreak = 'break-word';
                codeBlock.style.overflowWrap = 'break-word';
                codeBlock.style.overflowX = 'hidden';
                codeBlock.style.tabSize = '4';
                codeBlock.classList.add('code-wrapper');
            }
            
            const formattedContent = formatCodeIndentation(data.content);
            codeBlock.textContent = formattedContent;
            
            if(window.Prism) {
                Prism.highlightElement(codeBlock);
                setTimeout(() => {
                    applyCodeWrapStyles();
                }, 100);
            }

            loader.classList.add('hidden');
            container.classList.remove('hidden');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showToast('Code not found', 'error');
            goHome();
        }
    } catch (e) {
        showToast('Error loading code', 'error');
        goHome();
    }
}

function formatCodeIndentation(code) {
    const lines = code.split('\n');
    let minIndent = Infinity;
    
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    
    nonEmptyLines.forEach(line => {
        const leadingSpaces = line.match(/^[ \t]*/)[0].length;
        if (leadingSpaces < minIndent) {
            minIndent = leadingSpaces;
        }
    });
    
    if (minIndent === Infinity || minIndent === 0) {
        return code;
    }
    
    return lines.map(line => {
        if (line.trim().length === 0) return line;
        return line.substring(minIndent);
    }).join('\n');
}

function openDetail(id) { loadDetail(id); }
function goHome() {
    window.history.pushState({}, '', '/code');
    loadList();
}

function setupRouting() {
    window.onpopstate = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if(id) loadDetail(id);
        else loadList();
    };
}

function switchView(viewName) {
    const views = ['home', 'detail'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if(el) {
            if(v === viewName) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    });
}

function updateTags(data) {
    const counts = { 'all': data.length };
    data.forEach(item => {
        const match = item.description.match(/#(\w+)/);
        const tag = match ? match[1] : 'other';
        counts[tag] = (counts[tag] || 0) + 1;
    });

    const tagContainer = document.getElementById('tagFilters');
    if(!tagContainer) return;
    
    let html = '';
    Object.keys(counts).forEach(tag => {
        const isActive = tag === 'all' ? 'bg-primary text-white border-primary shadow-hard' : 'bg-slate-700 text-white border-slate-700 shadow-hard hover:bg-slate-600';
        html += `<button onclick="filterTag('${tag}')" class="px-4 py-1.5 text-xs font-bold transition-all uppercase border-2 ${isActive}" data-tag="${tag}">
            ${tag} (${counts[tag]})
        </button>`;
    });
    tagContainer.innerHTML = html;
}

window.filterTag = (tag) => {
    document.querySelectorAll('#tagFilters button').forEach(btn => {
        if(btn.dataset.tag === tag) {
            btn.className = 'px-4 py-1.5 text-xs font-bold transition-all uppercase border-2 bg-primary text-white border-primary shadow-hard';
        } else {
            btn.className = 'px-4 py-1.5 text-xs font-bold transition-all uppercase border-2 bg-slate-700 text-white border-slate-700 shadow-hard hover:bg-slate-600';
        }
    });

    if (tag === 'all') renderGrid(allCodes);
    else {
        const filtered = allCodes.filter(item => {
            const t = (item.description.match(/#(\w+)/) || [])[1] || 'other';
            return t === tag;
        });
        renderGrid(filtered);
    }
};

function setupCodeEventListeners() { }

async function deleteCode(e, id) {
    e.stopPropagation();
    if(!confirm(`Delete snippet ${id}?`)) return;
    
    try {
        const req = await fetch(`/api/admin/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': localStorage.getItem('adminToken') }
        });
        const res = await req.json();
        if(res.status) {
            showToast('Deleted successfully', 'success');
            loadList();
        } else {
            showToast(res.message, 'error');
        }
    } catch(e) { showToast('Delete failed', 'error'); }
}

function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white font-bold transform translate-y-10 opacity-0 transition-all duration-300 z-[100] flex items-center gap-3 font-mono text-sm ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-check-circle'}"></i> ${msg.toUpperCase()}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.copyCode = () => {
    const code = document.getElementById('viewCode').textContent;
    navigator.clipboard.writeText(code).then(() => showToast('Code copied!', 'success'));
};

function applyCodeWrapStyles() {
    const codeElements = document.querySelectorAll('#view-detail pre, #view-detail code');
    codeElements.forEach(el => {
        el.style.whiteSpace = 'pre-wrap';
        el.style.wordWrap = 'break-word';
        el.style.overflowX = 'hidden';
        el.style.wordBreak = 'break-word';
        el.style.overflowWrap = 'break-word';
        el.style.tabSize = '4';
        el.style.MozTabSize = '4';
    });
}

window.addEventListener('load', function() {
    applyCodeWrapStyles();
    
    const observer = new MutationObserver(applyCodeWrapStyles);
    const detailContent = document.getElementById('detailContent');
    if (detailContent) {
        observer.observe(detailContent, { childList: true, subtree: true });
    }
});

function startWIBClock() {
    const timeEl = document.getElementById('server-time');
    const dateEl = document.getElementById('server-date');
    if(!timeEl) return;
    
    updateTime();
    setInterval(updateTime, 1000);

    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', {
            timeZone: 'Asia/Jakarta',
            hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        const dateString = now.toLocaleDateString('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: 'numeric', month: 'long', year: 'numeric'
        });
        if(timeEl) timeEl.innerText = timeString;
        if(dateEl) dateEl.innerText = dateString;
    }
}

async function loadReminder() {
    try {
        const req = await fetch('../src/reminder.json');
        const data = await req.json();
        if(data?.message) {
            const el = document.getElementById('running-text');
            if(el) el.innerText = data.message.toUpperCase();
        }
    } catch (e) { console.warn("No reminder config found"); }
}

function messeg(msg) {
    const toast = document.getElementById('custom-toast');
    const msgBox = document.getElementById('toast-message');
    if(!toast || !msgBox) return;
    
    msgBox.innerText = msg;
    toast.classList.remove('translate-y-32', 'opacity-0');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('translate-y-32', 'opacity-0');
    }, 3000);
}

function terminalLog(message, type = 'info') {
    const logs = document.getElementById('term-logs');
    if(!logs) return;

    const line = document.createElement('div');
    const time = new Date().toLocaleTimeString('en-US', {hour12: false, hour: "2-digit", minute:"2-digit", second:"2-digit"});
    
    let prefix = `<span class="text-primary/60 font-bold">[${time}]</span>`;
    
    if (type === 'error') {
        prefix += ` <span class="text-red-500 font-bold">ERR</span>`;
        line.className = "text-red-400";
    } else if (type === 'success') {
        prefix += ` <span class="text-green-500 font-bold">OK</span>`;
        line.className = "text-green-400";
    } else if (type === 'warn') {
        prefix += ` <span class="text-yellow-500 font-bold">WARN</span>`;
        line.className = "text-yellow-400";
    } else if (type === 'req-success') {
        line.className = "text-green-400"; 
    } else if (type === 'req-error') {
        line.className = "text-red-400";
    } else {
        prefix += ` <span class="text-blue-400 font-bold">INFO</span>`;
        line.className = "text-gray-300";
    }

    line.innerHTML = `${prefix} ${message}`;
    logs.appendChild(line);
    logs.scrollTop = logs.scrollHeight;
}

async function kuroneko(config) {
    const logs = document.getElementById('term-logs');
    if(!logs) return;
    
    const cmdLine = document.createElement('div');
    cmdLine.className = "mb-2 break-all flex flex-wrap items-center";
    
    const prompt = document.createElement('span');
    prompt.className = "text-green-500 font-bold mr-2";
    prompt.innerHTML = "root@danzz~$";
    
    const inputCmd = document.createElement('span');
    inputCmd.className = "text-gray-200 font-mono relative";
    
    const cursor = document.createElement('span');
    cursor.className = "inline-block w-2.5 h-4 bg-green-500 align-middle ml-0.5 animate-pulse";
    
    cmdLine.appendChild(prompt);
    cmdLine.appendChild(inputCmd);
    inputCmd.appendChild(cursor);
    logs.appendChild(cmdLine);

    const cmd = "npm run dev";
    await new Promise(r => setTimeout(r, 600));

    for (let char of cmd) {
        const randomSpeed = Math.floor(Math.random() * (120 - 40 + 1)) + 40;
        await new Promise(r => setTimeout(r, randomSpeed));
        const textNode = document.createTextNode(char);
        inputCmd.insertBefore(textNode, cursor);
    }
    
    await new Promise(r => setTimeout(r, 500));
    cursor.remove();
    
    const printRaw = (text) => {
        const div = document.createElement('div');
        div.className = "text-gray-400 text-xs font-mono ml-1";
        div.innerText = text;
        logs.appendChild(div);
        logs.scrollTop = logs.scrollHeight;
    };

    const version = config.settings.apiVersion || '1.0.0';
    printRaw(`\n> nekoapy@${version} dev`);
    await new Promise(r => setTimeout(r, 200));
    printRaw(`> node src/index.ts\n`);
    await new Promise(r => setTimeout(r, 400));
    
    const endpoints = Object.values(config.tags).flat();
    const total = endpoints.length;

    terminalLog(`Loading ${total} routes...`, 'info');
    
    let count = 0;
    const maxShow = 3;
    for (const route of endpoints) {
        if(count < maxShow) {
             terminalLog(`Mapped {${route.method}} ${route.endpoint}`, 'success');
             await new Promise(r => setTimeout(r, 50));
        }
        count++;
    }
    if(count > maxShow) terminalLog(`... +${count - maxShow} hidden endpoints mapped`, 'info');

    await new Promise(r => setTimeout(r, 300));
    
    const serverUrl = window.location.origin;
    terminalLog(`Server is running at ${serverUrl}`, 'success');

    const inputLine = document.getElementById('term-input-line');
    if(inputLine) inputLine.classList.remove('hidden');
    
    const container = document.getElementById('api-container');
    if(container) container.classList.remove('opacity-0', 'translate-y-4');
}

function setUi(config) {
    const s = config.settings;
    const navTitle = document.getElementById('nav-title');
    const statVis = document.getElementById('stat-visitors');
    
    if(navTitle) navTitle.innerText = s.apiName || 'API';
    if(statVis) statVis.innerText = s.visitors || '1';
    
    if (s.favicon) {
        let link = document.querySelector("link[rel~='icon']") || document.createElement('link');
        link.rel = 'icon';
        link.href = s.favicon;
        document.head.appendChild(link);
    }
}

function setSearch() {
    const input = document.getElementById('search-input');
    const noResults = document.getElementById('no-results');
    if(!input) return;

    input.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const isSearching = val.length > 0;
        let anyVisible = false;

        document.querySelectorAll('.api-section').forEach(section => {
            const grid = section.querySelector('.api-section-grid');
            const arrow = section.querySelector('.cat-arrow');
            let matchInThisSection = 0;

            section.querySelectorAll('.api-card-wrapper').forEach(card => {
                const txt = card.getAttribute('data-search').toLowerCase();
                if (txt.includes(val)) {
                    card.classList.remove('hidden');
                    matchInThisSection++;
                } else {
                    card.classList.add('hidden');
                }
            });

            if (matchInThisSection > 0) {
                section.classList.remove('hidden');
                anyVisible = true;
                if (isSearching) {
                    grid.classList.remove('hidden');
                    arrow.classList.add('rotate-180');
                } else {
                    grid.classList.add('hidden');
                    arrow.classList.remove('rotate-180');
                }
            } else {
                section.classList.add('hidden');
            }
        });

        if(noResults) {
            noResults.classList.toggle('hidden', anyVisible);
            noResults.classList.toggle('flex', !anyVisible);
        }
    });
}

function loadEnd(tags) {
    const container = document.getElementById('api-container');
    if(!container) return;
    
    container.innerHTML = '';

    for (const [cat, routes] of Object.entries(tags)) {
        const section = document.createElement('div');
        section.className = "api-section w-full";
        
        const catId = `cat-${cat.replace(/\s+/g, '-')}`;

        const headerBtn = `
            <button onclick="toggleCategory('${catId}')" class="w-full flex items-center justify-between bg-white text-primary p-4 rounded-lg shadow-hard border-2 border-primary mb-4 group hover:bg-gray-50 active:scale-[0.99] transition-all duration-150">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-folder-open text-xl"></i>
                    <h2 class="text-lg font-display font-bold uppercase tracking-wider">${cat}</h2>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-[10px] font-mono bg-primary/10 border border-primary/20 px-2 py-1 rounded text-primary font-bold">${routes.length} EP</span>
                    <i id="arrow-${catId}" class="cat-arrow fa-solid fa-chevron-down transition-transform duration-300"></i>
                </div>
            </button>
        `;

        const grid = document.createElement('div');
        grid.id = `grid-${catId}`;
        grid.className = 'api-section-grid grid grid-cols-1 gap-4 hidden mb-8'; 

        routes.forEach((route, idx) => {
            const id = `${cat}-${idx}`.replace(/\s+/g, '-');
            const searchTerms = `${route.name} ${route.endpoint} ${cat}`;
            
            let inputsHtml = '';
            if (route.params?.length) {
                inputsHtml = `<div class="bg-gray-50 p-4 border-t-2 border-primary/20 grid gap-3">` + 
                route.params.map(p => 
                    `<div class="relative">
                        <div class="flex justify-between items-center mb-1">
                            <label class="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                <span class="w-1.5 h-1.5 bg-primary rounded-full inline-block"></span> ${p.name.toUpperCase()}
                            </label>
                            <span class="text-[9px] font-bold ${p.required ? 'text-red-500' : 'text-primary/60'}">${p.required ? 'REQ' : 'OPT'}</span>
                        </div>
                        <input type="text" id="input-${id}-${p.name}" placeholder="${p.description || 'Value...'}" 
                        class="w-full border-2 border-primary/20 p-2 font-mono text-xs focus:border-primary focus:outline-none transition-colors rounded bg-white">
                     </div>`
                ).join('') + `</div>`;
            }

            const methodColor = route.method === 'GET' ? 'bg-sky-500' : 
                               route.method === 'POST' ? 'bg-green-500' :
                               route.method === 'DELETE' ? 'bg-red-500' : 'bg-orange-500';
            
            const card = document.createElement('div');
            card.className = 'api-card-wrapper w-full bg-white border-2 border-primary/20 rounded-lg hover:border-primary transition-colors';
            card.setAttribute('data-search', searchTerms);
            
            card.innerHTML = `
                <div class="p-3 cursor-pointer select-none" onclick="toggle('${id}')">
                    <div class="flex justify-between items-center gap-3">
                        <div class="flex items-center gap-2 overflow-hidden">
                            <span class="px-1.5 py-0.5 text-[10px] font-bold text-white ${methodColor} rounded font-mono">${route.method}</span>
                            <code class="font-bold text-xs sm:text-sm truncate font-mono text-slate-700">${route.endpoint}</code>
                        </div>
                        <i id="icon-${id}" class="fa-solid fa-plus text-xs text-primary transition-transform duration-300"></i>
                    </div>
                    <p class="text-[10px] text-gray-500 mt-2 font-mono truncate">${route.name}</p>
                </div>
                
                <div id="body-${id}" class="hidden animate-slide-down">
                    ${inputsHtml}
                    
                    <div class="p-3 flex gap-2 border-t-2 border-primary/10 bg-gray-50/50">
                        <button id="btn-exec-${id}" onclick="testReq(this, '${route.endpoint}', '${route.method}', '${id}')" class="flex-1 bg-primary text-white font-bold py-2 hover:bg-violet-700 transition-colors shadow-hard-hover active:shadow-none active:translate-y-[2px] text-[10px] tracking-widest uppercase rounded border border-black min-w-[100px]">
                            Execute
                        </button>
                        <button onclick="copy('${route.endpoint}')" class="px-3 border border-primary/30 bg-white hover:bg-primary/5 rounded" title="Copy URL">
                            <i class="fa-regular fa-copy text-primary text-xs"></i>
                        </button>
                    </div>

                    <div id="res-area-${id}" class="hidden border-t-4 border-primary/50 bg-slate-900 text-[11px] relative rounded-b-lg overflow-hidden shadow-inner">
                        <div class="flex justify-between items-center bg-black/40 px-3 py-2 border-b border-white/10">
                            <div class="flex gap-2 items-center">
                                <span class="w-2 h-2 rounded-full bg-yellow-400" id="status-dot-${id}"></span>
                                <span id="status-${id}" class="text-gray-400 font-bold font-mono">WAITING</span>
                            </div>
                            <span id="time-${id}" class="text-gray-500 font-mono text-[10px]">--ms</span>
                        </div>
                        
                        <div class="absolute top-2 right-2 flex gap-1 z-20">
                             <a id="dl-btn-${id}" class="hidden bg-green-500/20 text-green-400 border border-green-500/50 px-2 py-0.5 hover:bg-green-500/30 rounded cursor-pointer transition-colors"><i class="fa-solid fa-download"></i></a>
                             <button onclick="copyRes('${id}')" class="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-2 py-0.5 hover:bg-blue-500/30 rounded transition-colors"><i class="fa-regular fa-clone"></i></button>
                             <button onclick="reset('${id}')" class="bg-red-500/20 text-red-400 border border-red-500/50 px-2 py-0.5 hover:bg-red-500/30 rounded transition-colors"><i class="fa-solid fa-xmark"></i></button>
                        </div>

                        <div id="output-${id}" class="font-mono text-[10px] overflow-x-auto whitespace-pre-wrap break-all max-h-[400px] p-4 custom-scrollbar min-h-[80px] text-gray-300 leading-relaxed"></div>
                    </div>
                </div>`;
            grid.appendChild(card);
        });

        section.innerHTML = headerBtn;
        section.appendChild(grid);
        container.appendChild(section);
    }
}

window.toggleCategory = (catId) => {
    const grid = document.getElementById(`grid-${catId}`);
    const arrow = document.getElementById(`arrow-${catId}`);
    
    if(grid.classList.contains('hidden')) {
        grid.classList.remove('hidden');
        arrow.classList.add('rotate-180');
    } else {
        grid.classList.add('hidden');
        arrow.classList.remove('rotate-180');
    }
};

window.toggle = (id) => {
    const b = document.getElementById(`body-${id}`);
    const i = document.getElementById(`icon-${id}`);
    
    if (b.classList.contains('hidden')) {
        b.classList.remove('hidden');
        i.classList.add('rotate-45'); 
    } else {
        b.classList.add('hidden');
        i.classList.remove('rotate-45');
    }
};

window.copy = (txt) => {
    navigator.clipboard.writeText(window.location.origin + txt);
    messeg("ENDPOINT COPIED");
    terminalLog(`Copied URL: ${txt}`);
};

window.copyRes = (id) => {
    const out = document.getElementById(`output-${id}`);
    if (!out.innerText) return;
    navigator.clipboard.writeText(out.innerText);
    messeg("RESPONSE COPIED");
};

window.reset = (id) => {
    document.getElementById(`res-area-${id}`).classList.add('hidden');
    document.getElementById(`output-${id}`).innerHTML = '';
    const dlBtn = document.getElementById(`dl-btn-${id}`);
    if(dlBtn) dlBtn.classList.add('hidden');
    document.querySelectorAll(`[id^="input-${id}-"]`).forEach(i => i.value = '');
    terminalLog(`Console cleared for req-${id.split('-').pop()}`);
};

window.testReq = async (btn, url, method, id) => {
    if (btn.disabled) return;

    const out = document.getElementById(`output-${id}`);
    const status = document.getElementById(`status-${id}`);
    const statusDot = document.getElementById(`status-dot-${id}`);
    const time = document.getElementById(`time-${id}`);
    const dlBtn = document.getElementById(`dl-btn-${id}`);
    
    const originalBtnText = 'Execute';
    
    btn.disabled = true;
    btn.classList.add('opacity-70', 'cursor-not-allowed');
    
    let startTime = Date.now();
    let timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        btn.innerHTML = `<span class="font-mono">${elapsed}ms...</span>`;
    }, 75);
    
    document.getElementById(`res-area-${id}`).classList.remove('hidden');
    
    if(dlBtn) {
        dlBtn.classList.add('hidden');
        dlBtn.href = '#';
    }
    
    status.innerText = 'PROCESSING...';
    status.className = 'text-yellow-400 font-bold font-mono';
    statusDot.className = 'w-2 h-2 rounded-full bg-yellow-400';

    out.innerHTML = '<span class="text-gray-500 italic">executing...</span>';
    
    const params = {};
    document.querySelectorAll(`[id^="input-${id}-"]`).forEach(i => {
        if(i.value) params[i.id.split(`input-${id}-`)[1]] = i.value;
    });

    let fetchUrl = url + (method === 'GET' && Object.keys(params).length ? '?' + new URLSearchParams(params) : '');
    let opts = { method, ...(method !== 'GET' ? { headers: {'Content-Type': 'application/json'}, body: JSON.stringify(params) } : {}) };

    const fullUrl = fetchUrl.startsWith('http') ? fetchUrl : window.location.origin + fetchUrl;

    try {
        const req = await fetch(fetchUrl, opts);
        
        clearInterval(timerInterval);
        const end = performance.now();
        const duration = (Date.now() - startTime); 
        
        status.innerText = `${req.status} ${req.statusText}`;
        status.className = req.ok ? 'text-green-400 font-bold font-mono' : 'text-red-400 font-bold font-mono';
        statusDot.className = req.ok ? 'w-2 h-2 rounded-full bg-green-400' : 'w-2 h-2 rounded-full bg-red-400';
        time.innerText = `${duration}ms`;

        terminalLog(`[${req.status}] ${fullUrl} (${duration}ms)`, req.ok ? 'req-success' : 'req-error');

        const type = req.headers.get('content-type');
        if (type?.includes('json')) {
            const json = await req.json();
            out.innerHTML = syntaxHighlight(json);
        } else if (type?.startsWith('image')) {
            const blob = await req.blob();
            const urlObj = URL.createObjectURL(blob);
            if(dlBtn) {
                dlBtn.href = urlObj;
                dlBtn.download = `img-${Date.now()}.jpg`;
                dlBtn.classList.remove('hidden');
            }
            
            out.innerHTML = `
                <div class="border border-dashed border-gray-600 p-4 bg-black/20 rounded-lg flex justify-center">
                    <img src="${urlObj}" class="max-w-full shadow-lg max-h-[400px] rounded border border-gray-700">
                </div>`;
        } else if (type?.includes('audio')) {
            const blob = await req.blob();
             out.innerHTML = `<audio controls src="${URL.createObjectURL(blob)}" class="w-full mt-2 rounded"></audio>`;
        } else {
            out.innerText = await req.text();
        }
    } catch (err) {
        clearInterval(timerInterval);
        out.innerHTML = `<span class="text-red-400 font-bold">CONNECTION_REFUSED</span><br><span class="text-gray-500">${err.message}</span>`;
        status.innerText = 'ERR';
        statusDot.className = 'w-2 h-2 rounded-full bg-red-500';
        status.className = 'text-red-400 font-bold font-mono';
        terminalLog(`Fetch Failed: ${err.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
        btn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
};

function syntaxHighlight(json) {
    if (typeof json != 'string') json = JSON.stringify(json, undefined, 2);
    return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) cls = 'json-key';
            else cls = 'json-string';
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
    });
}
