/* ════════════════════════════════════════════════════════════
   1. UI, HELPERS E MEMÓRIA (CARRINHO)
════════════════════════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', () => {
  loadCartData();
  renderCartPage(); // Garante que a página do carrinho carregue os dados na hora

  const splash = document.getElementById('splash');
  if (splash) {
      splash.style.opacity = '0';
      splash.style.transform = 'scale(1.04)';
      splash.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      goTo('login');
      setTimeout(() => { splash.style.display = 'none'; }, 700);
  }
});

function loadCartData() {
  const cartTotal = localStorage.getItem('cart_total') || 'R$ 0,00';
  const cartQty = localStorage.getItem('cart_qty') || '0';
  
  document.querySelectorAll('#homeCartTotal, #cartValue').forEach(el => el.textContent = cartTotal);
  document.querySelectorAll('#homeCartBadge').forEach(el => {
    el.textContent = cartQty;
    el.classList.toggle('show', parseInt(cartQty) > 0);
  });

  const detailTitle = document.getElementById('detail-title');
  if (detailTitle) {
     const movieStr = localStorage.getItem('cart_movie_obj');
     if (movieStr) {
         const m = JSON.parse(movieStr);
         detailTitle.textContent = m.title;
         const desc = document.getElementById('detail-desc');
         if (desc) desc.textContent = m.desc;
         const poster = document.getElementById('detail-poster-svg');
         if (poster) poster.innerHTML = m.posterHtml;
     }
  }

  const confirmTitle = document.getElementById('confirmTitle');
  if (confirmTitle) {
      confirmTitle.textContent = localStorage.getItem('cart_movie_title') || 'Filme';
      
      const time = localStorage.getItem('cart_time') || '—';
      if(document.getElementById('confirmTime')) document.getElementById('confirmTime').textContent = time;
      if(document.getElementById('confirmHorario')) document.getElementById('confirmHorario').textContent = time;
      
      const seats = localStorage.getItem('cart_seats') || '—';
      if(document.getElementById('confirmSeats')) document.getElementById('confirmSeats').textContent = seats;
      
      if(document.getElementById('paycardTotal')) document.getElementById('paycardTotal').textContent = cartTotal;
      if(document.getElementById('pixTotal')) document.getElementById('pixTotal').textContent = cartTotal;
      
      const posterHtml = localStorage.getItem('cart_poster_html') || '';
      if(document.getElementById('confirmPoster')) document.getElementById('confirmPoster').innerHTML = posterHtml;
      
      updateInstallments();
  }
}

function toggleEye(inputId, iconId) {
  const inp  = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!inp || !icon) return;
  const hidden = inp.type === 'password';
  inp.type = hidden ? 'text' : 'password';
  icon.innerHTML = hidden
    ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
}

function selectTipo(el) {
  document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function toggleCheck() {
  const check = document.getElementById('termosCheck');
  if (check) check.classList.toggle('checked');
}

/* ── Sidebars ── */
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
}
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function openAdminSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('adminSidebarOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
}
function closeAdminSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('adminSidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

/* ── Navigation (Com Rotas Mapeadas) ── */
let _prevScreen = 'home';

function goTo(screenId) {
  if (typeof closeSidebar === 'function') closeSidebar();
  if (typeof closeAdminSidebar === 'function') closeAdminSidebar();

  const rotas = {
    'splash': 'index.html', 'login': 'index.html', 'cadastro': 'index.html',
    'home': 'home.html',
    'movie-detail': 'reserva.html', 'seats': 'reserva.html', 'tickets': 'reserva.html',
    'confirm': 'pagamento.html', 'pay-card': 'pagamento.html', 'pay-pix': 'pagamento.html', 'ticket-confirmed': 'pagamento.html',
    'suporte': 'painel-cliente.html', 'historico': 'historico.html', 'avaliacoes': 'avaliacoes.html', 'perfil': 'perfil.html', 'configuracoes': 'configuracoes.html',
    'admin-dashboard': 'admin.html', 'admin': 'admin.html', 'admin-filmes': 'admin-filmes.html', 'admin-salas': 'admin-salas.html', 'admin-sessoes': 'admin-sessoes.html', 'admin-relatorios': 'admin-relatorios.html',
    'carrinho': 'carrinho.html'
  };

  const target = document.getElementById(screenId);

  // Redirecionamento
  if (!target) {
    if (rotas[screenId]) {
      window.location.href = rotas[screenId];
      return;
    }
    return;
  }

  if (screenId === 'perfil') {
    const active = document.querySelector('.screen:not(.hidden)');
    if (active && active.id) _prevScreen = active.id;
  }

  document.querySelectorAll('.screen').forEach(s => {
    s.classList.add('hidden');
    s.style.zIndex = '1';
  });

  target.classList.remove('hidden');
  target.style.zIndex = '4';
  
  if (screenId === 'cadastro') target.scrollTop = 0;
  if (screenId === 'seats' && typeof buildSeatMap === 'function') buildSeatMap();
  if (screenId === 'admin-dashboard' && typeof populateAdminPosters === 'function') setTimeout(populateAdminPosters, 50);
  if (screenId !== 'pay-pix' && typeof _pixInterval !== 'undefined' && _pixInterval) { clearInterval(_pixInterval); _pixInterval = null; }
  if (screenId === 'home') {
    const hc = target.querySelector('.home-content');
    if (hc) hc.scrollTop = 0;
  }
}

function goToFromPerfil() {
  window.history.back();
}


/* ════════════════════════════════════════════════════════════
   LÓGICA EXCLUSIVA DO CARRINHO (Blinda erros de outras páginas)
════════════════════════════════════════════════════════════ */

function openCart() {
  // Blinda a função: só coleta esses dados se o arquivo atual for o reserva.html
  const detailScreen = document.getElementById('movie-detail');
  
  if (detailScreen) {
    const titleEl = document.getElementById('detail-title');
    if (titleEl) localStorage.setItem('cart_movie_title', titleEl.textContent);

    const timePill = document.querySelector('.time-pill.active');
    if (timePill) localStorage.setItem('cart_time', timePill.textContent.trim());

    const srcPoster = document.getElementById('detail-poster-svg');
    if (srcPoster) localStorage.setItem('cart_poster_html', srcPoster.innerHTML);
  }

  // Joga para a tela do carrinho
  goTo('carrinho');
}

function renderCartPage() {
  if (!document.getElementById('carrinho')) return;

  const qty = parseInt(localStorage.getItem('cart_qty')) || 0;
  
  const emptyView = document.getElementById('cartEmpty');
  const contentView = document.getElementById('cartContent');
  
  if (!emptyView || !contentView) return;

  if (qty === 0) {
    emptyView.style.display = 'block';
    contentView.style.display = 'none';
  } else {
    emptyView.style.display = 'none';
    contentView.style.display = 'block';

    const total = localStorage.getItem('cart_total') || 'R$ 0,00';
    const movieTitle = localStorage.getItem('cart_movie_title') || 'Filme não selecionado';
    const poster = localStorage.getItem('cart_poster_html') || '';
    const seats = localStorage.getItem('cart_seats') || 'Nenhum';
    const time = localStorage.getItem('cart_time') || '--:--';

    const pEl = document.getElementById('cartPoster');
    if(pEl) pEl.innerHTML = poster;

    const tEl = document.getElementById('cartMovieName');
    if(tEl) tEl.textContent = movieTitle;

    const sEl = document.getElementById('cartSession');
    if(sEl) sEl.textContent = 'Sessão: ' + time;

    const aEl = document.getElementById('cartSeats');
    if(aEl) aEl.textContent = seats;

    const qEl = document.getElementById('cartQtyBadge');
    if(qEl) qEl.textContent = qty + (qty === 1 ? ' un.' : ' uns.');

    const prEl = document.getElementById('cartPrice');
    if(prEl) prEl.textContent = total;
    
    const subEl = document.getElementById('cartSubtotal');
    if(subEl) subEl.textContent = total;

    const totEl = document.getElementById('cartTotalFinal');
    if(totEl) totEl.textContent = total;
  }
}

function clearCart() {
  localStorage.removeItem('cart_total');
  localStorage.removeItem('cart_total_num');
  localStorage.removeItem('cart_qty');
  localStorage.removeItem('cart_seats');
  localStorage.removeItem('cart_movie_obj');
  localStorage.removeItem('cart_movie_title');
  localStorage.removeItem('cart_poster_html');
  localStorage.removeItem('cart_time');
  
  loadCartData();
  renderCartPage();
}

/* ════════════════════════════════════════════════════════════
   2. MOVIE & SEATS LOGIC
════════════════════════════════════════════════════════════ */

const MOVIES = [
  { 
    title: 'O Diabo Veste Prada 2', 
    desc: `Miranda Priestly (Meryl Streep) enfrenta o declínio da revista Runway e a crise da mídia impressa. Para salvar a publicação, ela precisa do apoio de anunciantes controlados por sua ex-assistente, Emily (Emily Blunt), agora uma executiva poderosa. Nesse cenário, Andy (Anne Hathaway) retorna para ajudar`,
    img: 'https://ingresso-a.akamaihd.net/prd/img/movie/o-diabo-veste-prada-2/4e042f1b-0072-4560-96f9-409c59dd0da2.webp'
  },
  { 
    title: 'Michael', 
    desc: `A cinebiografia de Michael Jackson, o Rei do Pop, explorando os altos e baixos de sua vida pessoal, suas performances icônicas e sua carreira musical lendária.`,
    img: 'https://br.web.img2.acsta.net/img/e9/f1/e9f1efa99c6af0bbe48871b6d0a299f9.jpg'
  },
  { 
    title: 'Star Wars: O Mandaloriano e Grogu', 
    desc: `Acompanha o lendário caçador de recompensas Din Djarin (Pedro Pascal) e seu aprendiz Grogu em uma nova missão pela galáxia. Ambientada após a queda do Império, a história segue a dupla trabalhando para a recém-criada Nova República, caçando esconderijos de senhores da guerra imperiais.`,
    img: 'https://cinemococa.com.br/wp-content/uploads/2026/04/efe2f2a9-eea9-4c23-92b7-667180c7703f-1.webp'
  },
  { 
    title: 'Todo Mundo em Pânico 2026', 
    desc: `Marca o retorno da clássica franquia de comédia aos cinemas. A trama reúne o quarteto original — Cindy (Anna Faris), Brenda (Regina Hall), Shorty (Marlon Wayans) e Ray (Shawn Wayans) — na mira do icônico assassino mascarado, quase 26 anos após os eventos originais.`,
    img: 'https://m.media-amazon.com/images/M/MV5BMzUyNDNhNmUtZWZmYy00OGY4LWEwMjgtZGJlZTA3ZTY2MTY0XkEyXkFqcGc@._V1_.jpg'
  },
  { 
    title: 'Vingadores: Doutor Destino', 
    desc: `Heróis de três universos distintos — incluindo os Vingadores e os Novos Vingadores (Terra-616), o Quarteto Fantástico (Terra-828) e os X-Men originais — convergem e entram em rota de colisão. Juntos, eles precisam enfrentar uma ameaça existencial sem precedentes.`,
    img: 'https://ingresso-a.akamaihd.net/b2b/production/uploads/articles-content/d336e250-c7b3-4860-a730-a5bd6160290a.jpg'
  },
  { 
    title: 'Duna: Parte 3', 
    desc: `(Baseada no livro O Messias de Duna) acompanha Paul Atreides anos após sua vitória. Agora governando como Imperador, Paul é tragado pelas consequências da guerra santa que desencadeou, lidando com conspirações políticas mortais e o peso dos bilhões de vidas perdidas em seu nome.`,
    img: 'https://ingresso-a.akamaihd.net/prd/img/movie/duna-parte-3/32ac8c1b-16cb-498f-9fb7-6cc148f07374.webp'
  }
];

function openMovieDetail(cardEl) {
  // 1. Pega o nome do filme direto do texto do card clicado
  const nameEl = cardEl.querySelector('.movie-card-name');
  const title = nameEl ? nameEl.textContent.trim() : 'Filme';

  // 2. Tenta achar a sinopse na lista MOVIES. 
  // Se não achar (filme novo), cria um objeto na hora com o título certo!
  const movie = MOVIES.find(m => m.title === title) || {
    title: title,
    desc: 'Sinopse não disponível para este filme no momento.'
  };

  // 3. Extrai a imagem ou SVG do poster clicado
  let posterHtml = '';
  const srcImg = cardEl.querySelector('.movie-card img');
  const srcSvg = cardEl.querySelector('svg.poster-art');

  if (srcImg) {
    posterHtml = `<img src="${srcImg.src}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:6px;"/>`;
  } else if (srcSvg) {
    const clone = srcSvg.cloneNode(true);
    clone.style.width = '100%'; 
    clone.style.height = '100%'; 
    clone.style.display = 'block';
    posterHtml = clone.outerHTML; // Salva o SVG como texto para a memória
  }

  // 4. Salva a foto, o título e a descrição exatos no Carrinho (Memória)
  const movieObj = { title: movie.title, desc: movie.desc, posterHtml };
  localStorage.setItem('cart_movie_obj', JSON.stringify(movieObj));
  localStorage.setItem('cart_movie_title', movie.title);
  localStorage.setItem('cart_poster_html', posterHtml);

  // 5. Manda para a tela de reserva
  goTo('movie-detail');
}
function selectPill(el, group) {
  const parent = el.closest('.date-pills, .time-pills');
  if (parent) {
    parent.querySelectorAll('.date-pill, .time-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }
}

const ROWS = ['A','B','C','D','E'];
const SEAT_LAYOUT = {
  A: [0,1,0,0,0,0,1, 0, 1,0,0,1,0,0,0],
  B: [0,0,1,0,1,0,0, 0, 0,0,1,0,0,1,0],
  C: [1,0,0,0,0,1,0, 0, 0,1,0,0,0,0,1],
  D: [0,0,1,0,0,0,1, 0, 1,0,0,1,0,0,0],
  E: [0,1,0,0,1,0,0, 0, 0,0,1,0,0,0,1],
};

let selectedSeats = new Set();

function buildSeatMap() {
  const map = document.getElementById('seatMap');
  if (!map) return;
  map.innerHTML = '';
  selectedSeats.clear();
  updateSeatsLabel();

  ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'seat-row';

    const label = document.createElement('div');
    label.className = 'seat-row-label';
    label.textContent = row;
    rowEl.appendChild(label);

    const seatsWrap = document.createElement('div');
    seatsWrap.className = 'seat-row-seats';

    const layout = SEAT_LAYOUT[row];
    layout.forEach((state, idx) => {
      if (idx === 7) {
        const gap = document.createElement('div');
        gap.className = 'seat-row-gap';
        seatsWrap.appendChild(gap);
        return;
      }
      const seat = document.createElement('div');
      const seatId = row + (idx < 7 ? idx+1 : idx);
      seat.className = 'seat ' + (state === 1 ? 'occupied' : 'available');
      seat.dataset.id = seatId;
      seat.title = seatId;
      if (state !== 1) {
        seat.addEventListener('click', () => toggleSeat(seat));
      }
      seatsWrap.appendChild(seat);
    });

    rowEl.appendChild(seatsWrap);
    map.appendChild(rowEl);
  });
}

function toggleSeat(seat) {
  const id = seat.dataset.id;
  if (seat.classList.contains('selected')) {
    seat.classList.remove('selected');
    seat.classList.add('available');
    selectedSeats.delete(id);
  } else {
    seat.classList.remove('available');
    seat.classList.add('selected');
    selectedSeats.add(id);
  }
  updateSeatsLabel();
}

function updateSeatsLabel() {
  const el = document.getElementById('selectedSeatsLabel');
  const seatsStr = selectedSeats.size > 0 ? Array.from(selectedSeats).join(', ') : '—';
  if (el) el.textContent = seatsStr;
  
  // Salva os assentos no carrinho
  localStorage.setItem('cart_seats', seatsStr);
}

/* ════════════════════════════════════════════════════════════
   3. TICKETS & PAYMENT LOGIC
════════════════════════════════════════════════════════════ */

function changeQty(btn, delta) {
  const row    = btn.closest('.ticket-row');
  const price  = parseFloat(row.dataset.price);
  const qtyEl  = row.querySelector('.qty-value');
  const subEl  = row.querySelector('.ticket-subtotal');

  let qty = parseInt(qtyEl.textContent) + delta;
  if (qty < 0) qty = 0;
  qtyEl.textContent = qty;

  const sub = qty * price;
  subEl.textContent = formatBRL(sub);
  subEl.classList.toggle('zero', sub === 0);

  updateTicketTotals();
}

function updateTicketTotals() {
  let total = 0;
  let totalItems = 0;
  document.querySelectorAll('#tickets .ticket-row').forEach(row => {
    const price = parseFloat(row.dataset.price);
    const qty   = parseInt(row.querySelector('.qty-value').textContent) || 0;
    total += price * qty;
    totalItems += qty;
  });
  
  const fmt = formatBRL(total);
  
  // Salva total e quantidade no carrinho em tempo real
  localStorage.setItem('cart_total', fmt);
  localStorage.setItem('cart_total_num', total);
  localStorage.setItem('cart_qty', totalItems);

  // Recarrega os dados visuais na tela atual
  loadCartData();
}

function formatBRL(val) {
  return 'R$ ' + val.toFixed(2).replace('.', ',');
}

// O botão no final de reserva.html chama essa função!
function finalizarCompra() {
  // Invoca a função do carrinho que coleta os últimos detalhes e muda de tela
  openCart();
}

function proceedPayment() {
  if (_payMethod === 'pix') {
    startPixTimer();
    goTo('pay-pix');
  } else {
    updateInstallments();
    goTo('pay-card');
  }
}

let _payMethod = 'card';
let _pixInterval = null;

function selectPayMethod(method) {
  _payMethod = method;
  const pmCard = document.getElementById('pmCard');
  const pmPix = document.getElementById('pmPix');
  if (pmCard) pmCard.classList.toggle('active', method === 'card');
  if (pmPix) pmPix.classList.toggle('active', method === 'pix');
}

function updateInstallments() {
  const totalStr = localStorage.getItem('cart_total_num') || "0";
  const val = parseFloat(totalStr);
  const sel = document.getElementById('installSelect');
  if (!sel) return;
  sel.innerHTML = '';
  [1,2,3].forEach(n => {
    const opt = document.createElement('option');
    opt.textContent = n + 'x de R$ ' + (val/n).toFixed(2).replace('.',',') + ' sem juros';
    sel.appendChild(opt);
  });
}

function fmtCard(input) {
  let v = input.value.replace(/\D/g,'').slice(0,16);
  input.value = v.replace(/(\d{4})(?=\d)/g,'$1 ');
}

function fmtExpiry(input) {
  let v = input.value.replace(/\D/g,'').slice(0,4);
  if (v.length >= 3) v = v.slice(0,2) + ' / ' + v.slice(2);
  input.value = v;
}

function copyPix() {
  const code = '00020126580014BR.GOV.BCB.PIX0136f8a9e6-1234-5678-abcd-ef0123456789';
  navigator.clipboard.writeText(code).catch(() => {});
  const btn = document.querySelector('.pix-copy-btn');
  if (btn) { btn.style.opacity = '1'; setTimeout(() => btn.style.opacity = '0.5', 1000); }
}

function startPixTimer() {
  if (_pixInterval) clearInterval(_pixInterval);
  let seconds = 10 * 60; 
  const timerEl = document.getElementById('pixTimer');

  function tick() {
    if (!timerEl) return;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timerEl.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
    timerEl.classList.toggle('urgent', seconds <= 60);
    if (seconds <= 0) {
      clearInterval(_pixInterval);
      timerEl.textContent = '00:00';
      timerEl.classList.add('urgent');
    }
    seconds--;
  }
  tick();
  _pixInterval = setInterval(tick, 1000);
}

function completePurchase() {
  if (_pixInterval) { clearInterval(_pixInterval); _pixInterval = null; }

  const totalVal = parseFloat(localStorage.getItem('cart_total_num')) || 0;
  const totalQty = parseInt(localStorage.getItem('cart_qty')) || 0;
  const filmTitle = localStorage.getItem('cart_movie_title') || 'Filme';
  const seats = localStorage.getItem('cart_seats') || '—';

  // Envia pro admin
  if (typeof registerSaleInAdmin === 'function') {
      registerSaleInAdmin({ film: { title: filmTitle, idx: 0 }, seats, total: totalVal, tickets: totalQty });
  }

  // Prepara a tela de confirmação
  const tTitle = document.getElementById('tconfTitle');
  if (tTitle) tTitle.textContent = filmTitle;

  const tHorario = document.getElementById('tconfHorario');
  if (tHorario) tHorario.textContent = localStorage.getItem('cart_time') || '—';

  const tSeats = document.getElementById('tconfSeats');
  if (tSeats) tSeats.textContent = seats;

  const dstPoster = document.getElementById('tconfPoster');
  if (dstPoster) dstPoster.innerHTML = localStorage.getItem('cart_poster_html') || '';

  // Gera um número de pedido aleatório
  const orderNum = Math.floor(Math.random() * 90000) + 10000;
  const tOrder = document.getElementById('tconfOrder');
  if (tOrder) tOrder.textContent = '#CBR-' + orderNum;

  // Limpa o carrinho e avança para a tela animada
  clearCart();
  goTo('ticket-confirmed');
}

/* ════════════════════════════════════
   4. TICKET CONFIRMATION & EMAIL
════════════════════════════════════ */

function toggleEmailPanel() {
  const panel = document.getElementById('emailPanel');
  const input = document.getElementById('emailPanelInput');
  if (panel) {
    const isOpen = panel.classList.toggle('open');
    if (isOpen && input) setTimeout(() => input.focus(), 350);
  }
}

function sendTicketEmail() {
  const input = document.getElementById('emailPanelInput');
  if (!input) return;
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.style.borderColor = 'rgba(227,28,28,0.7)';
    setTimeout(() => input.style.borderColor = '', 1500);
    return;
  }
  showToast('✉️  Ingresso enviado para ' + email, '#22c55e');
  input.value = '';
  const panel = document.getElementById('emailPanel');
  if (panel) panel.classList.remove('open');
}

function downloadTicket() {
  if (document.querySelector('.dl-toast')) return;

  const shell = document.querySelector('.phone-shell');
  if (!shell) return;

  const toast = document.createElement('div');
  toast.className = 'dl-toast';
  toast.innerHTML = `
    <div class="dl-toast-header">
      <div class="dl-toast-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Baixando ingresso...
      </div>
      <button class="dl-toast-close" onclick="this.closest('.dl-toast').remove()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="dl-progress-bar-bg"><div class="dl-progress-bar" id="dlBar"></div></div>
    <div class="dl-toast-sub" id="dlPct">0%</div>
  `;
  shell.appendChild(toast);

  const bar  = document.getElementById('dlBar');
  const pct  = document.getElementById('dlPct');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      pct.textContent = '100%';
      toast.querySelector('.dl-toast-title').innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Download concluído!`;
      setTimeout(() => {
        toast.style.transition = 'opacity 0.4s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      }, 1800);
      return;
    }
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 180);
}

function showToast(msg, color) {
  const shell = document.querySelector('.phone-shell');
  if (!shell) return;
  const t = document.createElement('div');
  t.style.cssText = [
    'position:absolute','bottom:40px','left:50%','transform:translateX(-50%)',
    'background:' + color,'color:#fff','padding:12px 22px',
    'border-radius:12px','font-weight:700','font-size:13px',
    'z-index:99','white-space:nowrap',
    'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
    'animation:slideUp 0.3s ease both'
  ].join(';');
  t.textContent = msg;
  shell.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity 0.4s';
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 400);
  }, 2500);
}

/* ════════════════════════════════════
   5. ADMIN & UTILS
════════════════════════════════════ */

const adminData = {
  totalRevenue: 0, totalTickets: 0, totalTransactions: 0, sales: [],
  filmCounts: { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0 },
};

function adminNav(section) {
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
  const navMap = { 'dashboard': 'navDashboard', 'filmes': 'navFilmes', 'salas': 'navSalas', 'sessoes': 'navSessoes', 'relatorios': 'navRelatorios', 'graficos': 'navRelatorios' };
  const navEl = document.getElementById(navMap[section]);
  if (navEl) navEl.classList.add('active');
  
  closeAdminSidebar();

  document.querySelectorAll('.admin-panel-section').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + section);
  if (panel) panel.classList.add('active');

  const titles = { 'dashboard': 'Painel Administrativo', 'filmes': 'Filmes', 'salas': 'Salas', 'sessoes': 'Sessões', 'relatorios': 'Relatórios', 'graficos': 'Gráficos' };
  const titleEl = document.querySelector('.admin-topbar-title');
  if (titleEl) titleEl.textContent = titles[section] || 'Painel Administrativo';

  if (section === 'relatorios' && typeof refreshRelatorios === 'function') refreshRelatorios();
  if (section === 'graficos' && typeof refreshGraficos === 'function') refreshGraficos();
  if (section === 'dashboard' && typeof populateAdminPosters === 'function') populateAdminPosters();
}

function registerSaleInAdmin(saleData) {
  const { film, seats, total, tickets } = saleData;
  adminData.totalRevenue += total;
  adminData.totalTickets += tickets;
  adminData.totalTransactions++;

  if (adminData.filmCounts[film.idx] !== undefined) adminData.filmCounts[film.idx] += tickets;

  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  adminData.sales.unshift({
    name: document.getElementById('clientName')?.value || 'Usuário',
    film: film.title, seats: seats, value: total, time: timeStr
  });
  if (adminData.sales.length > 10) adminData.sales.pop();
  
  if (document.getElementById('admin-dashboard')) {
      refreshAdminDashboard();
  }
}

function refreshAdminDashboard() {
  const d = adminData;
  const fmt = v => 'R$' + v.toFixed(2).replace('.',',');

  if(document.getElementById('kpiFaturamento')) document.getElementById('kpiFaturamento').textContent = fmt(d.totalRevenue);
  const kpiFatSub = document.getElementById('kpiFaturamentoSub');
  if(kpiFatSub) kpiFatSub.textContent = '↑ +' + d.totalTransactions + ' transaç' + (d.totalTransactions === 1 ? 'ão' : 'ões');

  if(document.getElementById('kpiIngressos')) document.getElementById('kpiIngressos').textContent = d.totalTickets;
  const kpiIngSub = document.getElementById('kpiIngressosSub');
  if(kpiIngSub) kpiIngSub.textContent = d.totalTransactions + ' transaç' + (d.totalTransactions === 1 ? 'ão' : 'ões');

  const avg = d.totalTransactions > 0 ? d.totalRevenue / d.totalTransactions : 0;
  if(document.getElementById('kpiTicket')) document.getElementById('kpiTicket').textContent = fmt(avg);

  const lu = document.getElementById('adminLastUpdate');
  if (lu) {
    const n = new Date();
    lu.textContent = 'Atualizado às ' + n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0') + ':' + n.getSeconds().toString().padStart(2,'0');
  }

  const topIdx = Object.entries(d.filmCounts).sort((a,b) => b[1]-a[1])[0];
  if (topIdx && parseInt(topIdx[1]) > 0) {
    const cards = document.querySelectorAll('.movie-card-wrap');
    const idx = parseInt(topIdx[0]);
    const card = cards[idx];
    if (card) {
      const img = card.querySelector('.movie-card img');
      const di = document.getElementById('adminDestaqueImg');
      if (di && img) di.src = img.src;
      const dn = document.getElementById('adminDestaqueName');
      if (dn) dn.textContent = card.querySelector('.movie-card-name').textContent;
      const dc = document.getElementById('adminDestaqueCount');
      if (dc) dc.firstChild.textContent = topIdx[1];
      const bar = document.getElementById('adminDestaqueBar');
      if (bar) bar.style.width = Math.min(100, parseInt(topIdx[1]) * 5) + '%';
    }
  }

  const sessMap = { 0:'sess1Count', 1:'sess2Count', 2:'sess3Count' };
  Object.entries(sessMap).forEach(([filmIdx, elId]) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = d.filmCounts[filmIdx] || 0;
  });

  const list = document.getElementById('adminSalesList');
  const empty = document.getElementById('adminSalesEmpty');
  if (list) {
    if (d.sales.length > 0) {
      if (empty) empty.style.display = 'none';
      list.innerHTML = d.sales.map(s => `
        <div class="admin-sale-row">
          <div class="admin-sale-avatar">${s.name.charAt(0).toUpperCase()}</div>
          <div class="admin-sale-info">
            <div class="admin-sale-name">${s.name}</div>
            <div class="admin-sale-detail">${s.film} · Assentos: ${s.seats}</div>
          </div>
          <div class="admin-sale-value">${'R$' + s.value.toFixed(2).replace('.',',')}</div>
          <div class="admin-sale-time">${s.time}</div>
        </div>`).join('');
    } else {
      if (empty) empty.style.display = 'block';
      list.innerHTML = '';
    }
  }
}

function populateAdminPosters() {
  const cards = document.querySelectorAll('.movie-card-wrap');
  const getSrc = (idx) => { const img = cards[idx]?.querySelector('.movie-card img'); return img ? img.src : ''; };
  const di = document.getElementById('adminDestaqueImg');
  if (di) di.src = getSrc(1);

  document.querySelectorAll('.adminFilmeImg').forEach(img => {
    const idx = parseInt(img.dataset.idx);
    if (!isNaN(idx)) img.src = getSrc(idx);
  });

  const filmesCard = document.getElementById('filmesCard');
  if (filmesCard) {
    const FILMS_CFG = [
      {name:'O Diabo Veste Prada 2', dur:'2h05', ind:'12', sala:'Sala 2', horario:'17:30', idx:1},
      {name:'Michael', dur:'1h40', ind:'16', sala:'Sala 1', horario:'15:00', idx:0},
      {name:'Star Wars: O Mandaloriano e Grogu', dur:'1h55', ind:'18', sala:'Sala 3', horario:'20:00', idx:2},
      {name:'Todo Mundo em Pânico 2026', dur:'1h50', ind:'14', sala:'Sala 1', horario:'23:00', idx:3},
      {name:'Vingadores: Doutor Destino', dur:'2h00', ind:'14', sala:'Sala 2', horario:'19:00', idx:4},
      {name:'Duna: Parte 3', dur:'2h22', ind:'12', sala:'Sala 3', horario:'21:00', idx:5},
    ];
    const header = filmesCard.querySelector('.adm-card-header');
    filmesCard.innerHTML = '';
    if (header) filmesCard.appendChild(header);
    FILMS_CFG.forEach(f => {
      const sold = adminData.filmCounts[f.idx] || 0;
      const rev  = sold * 40;
      const div  = document.createElement('div');
      div.className = 'adm-film-row';
      div.innerHTML = `
        <div class="adm-film-poster"><img src="${getSrc(f.idx)}" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>
        <div class="adm-film-info">
          <div class="adm-film-name">${f.name}</div>
          <div class="adm-film-meta">${f.dur} · ${f.ind}+ anos · ${f.horario} · ${f.sala}</div>
        </div>
        <div class="adm-film-stats">
          <span class="adm-stat-pill adm-stat-cartaz">Em Cartaz</span>
          <span class="adm-stat-pill adm-stat-tickets">${sold} ing.</span>
          <span class="adm-stat-pill adm-stat-receita">R$${rev.toLocaleString('pt-BR')}</span>
        </div>`;
      filmesCard.appendChild(div);
    });
  }
  refreshAdminDashboard();
  if (document.getElementById('panel-relatorios')) refreshRelatorios();
}

/* ════════════════════════════════════
   RELATÓRIOS & GRÁFICOS
════════════════════════════════════ */
const PIE_COLORS  = ['#E31C1C','#c8960c','#3b82f6','#22c55e','#a855f7','#f97316'];
const BAR_COLORS  = ['#E31C1C','#c8960c','#3b82f6','#22c55e','#a855f7','#f97316'];
const FILM_NAMES  = ['O Diabo Veste Prada 2','Michael','Star Wars: O Mandaloriano e Grogu','Todo Mundo em Pânico 2026','Vingadores: Doutor Destino','Duna: Parte 3'];
const BASE_TICKET = [930, 1250, 325, 450, 200, 600]; 
const BASE_REV    = [34650, 68000, 3750, 18000, 8000, 24000];

function getFilmData() {
  return FILM_NAMES.map((name, i) => ({
    name,
    ingressos: BASE_TICKET[i] + (adminData.filmCounts[i] || 0),
    receita:   BASE_REV[i]    + (adminData.filmCounts[i] || 0) * 40,
  })).sort((a,b) => b.ingressos - a.ingressos);
}

function refreshRelatorios() {
  const films = getFilmData();
  const cards = document.querySelectorAll('.movie-card-wrap');
  const orderMap = {'O Diabo Veste Prada 2':0,'Michael':1,'Star Wars: O Mandaloriano e Grogu':2,'Todo Mundo em Pânico 2026':3,'Vingadores: Doutor Destino':4,'Duna: Parte 3':5};
  const rankClass = ['gold','silver','bronze','','',''];
  const getSrc = name => { const c = cards[orderMap[name]]; return c ? (c.querySelector('.movie-card img')?.src||'') : ''; };
  const fmtBRL = v => 'R$ ' + v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

  const tbody = document.getElementById('relatorioTableBody');
  if (tbody) {
    tbody.innerHTML = films.map((f, i) => `
      <div class="adm-rel-row">
        <div class="adm-rel-rank ${rankClass[i]}">${i+1}</div>
        <div class="adm-film-poster" style="width:34px;flex-shrink:0;border-radius:5px;overflow:hidden;aspect-ratio:2/3;box-shadow:0 2px 6px rgba(0,0,0,0.5);">
          <img src="${getSrc(f.name)}" style="width:100%;height:100%;object-fit:cover;display:block;"/>
        </div>
        <div class="adm-rel-info">
          <div class="adm-rel-name">${f.name}</div>
          <div class="adm-rel-meta">${f.ingressos.toLocaleString('pt-BR')} ingressos</div>
        </div>
        <div class="adm-rel-numbers">
          <div class="adm-rel-tickets">${f.ingressos.toLocaleString('pt-BR')}</div>
          <div class="adm-rel-revenue">${fmtBRL(f.receita)}</div>
        </div>
      </div>`).join('');
  }

  const total   = films.reduce((s,f) => s + f.receita, 0);
  const totalTk = films.reduce((s,f) => s + f.ingressos, 0);
  const avg     = films.length > 0 ? total / films.length : 0;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('relatorioTotal',  fmtBRL(total));
  set('relTotalTickets', totalTk.toLocaleString('pt-BR'));
  set('relTicketMedio',  fmtBRL(avg));

  const salaMap  = [[0,3],[1],[2,4,5]]; 
  const salaCap  = [200, 180, 150];
  salaMap.forEach((indices, s) => {
    const sold = indices.reduce((sum,i) => sum + (adminData.filmCounts[i]||0), 0);
    const pct  = Math.min(100, Math.round((sold / salaCap[s]) * 100));
    const pctEl = document.getElementById('sala'+(s+1)+'Pct');
    const barEl = document.getElementById('sala'+(s+1)+'Bar');
    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl) barEl.style.width = pct + '%';
  });

  const sessMap = {0:'sessVend1',1:'sessVend2',2:'sessVend3',3:'sessVend4'};
  Object.entries(sessMap).forEach(([idx,id]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = adminData.filmCounts[idx] || 0;
  });

  const filmesCard = document.getElementById('filmesCard');
  if (filmesCard) {
    const rows = filmesCard.querySelectorAll('.adm-film-row');
    films.forEach((f, i) => {
      if (!rows[i]) return;
      const tkEl = rows[i].querySelector('.adm-stat-tickets');
      const rvEl = rows[i].querySelector('.adm-stat-receita');
      if (tkEl) tkEl.textContent = f.ingressos.toLocaleString('pt-BR') + ' ing.';
      if (rvEl) rvEl.textContent = fmtBRL(f.receita);
    });
  }
}

function refreshGraficos() {
  const films = getFilmData();
  const total = films.reduce((s,f) => s + f.receita, 0);
  const maxIng = Math.max(...films.map(f => f.ingressos));

  const gt = document.getElementById('graficosTotal');
  if (gt) gt.textContent = 'R$ ' + total.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

  const barSvg = document.getElementById('barChartSvg');
  if (barSvg) {
    const W=140, H=85, padL=10, padB=22, padT=4, barW=14, gap=5;
    const chartH = H - padT - padB;
    let svgContent = `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H-padB}" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
      <line x1="${padL}" y1="${H-padB}" x2="${W}" y2="${H-padB}" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>`;
    [0.25,0.5,0.75,1].forEach(f => {
      const y = padT + chartH * (1-f);
      svgContent += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>`;
      svgContent += `<text x="${padL-1}" y="${(y+1.5).toFixed(1)}" font-size="5" fill="rgba(255,255,255,0.3)" text-anchor="end">${Math.round(maxIng*f)}</text>`;
    });
    films.forEach((f, i) => {
      const x = padL + 4 + i*(barW+gap);
      const h = (f.ingressos / maxIng) * chartH;
      const y = H - padB - h;
      svgContent += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW}" height="${h.toFixed(1)}" fill="${BAR_COLORS[i]}" rx="2" opacity="0.85"/>`;
      const label = f.name.split(' ')[0];
      svgContent += `<text x="${(x+barW/2).toFixed(1)}" y="${H-padB+8}" font-size="4.5" fill="rgba(255,255,255,0.5)" text-anchor="middle">${label}</text>`;
    });
    barSvg.innerHTML = svgContent;
  }

  const pieSvg = document.getElementById('pieChartSvg');
  if (pieSvg) {
    const cx=55, cy=50, r=40;
    let startAngle = -Math.PI/2;
    let paths = '';
    let legend = '';
    films.forEach((f, i) => {
      const slice = (f.receita / total) * 2 * Math.PI;
      const endAngle = startAngle + slice;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const large = slice > Math.PI ? 1 : 0;
      const midAngle = startAngle + slice/2;
      const lx = cx + (r*0.65) * Math.cos(midAngle);
      const ly = cy + (r*0.65) * Math.sin(midAngle);
      const pct = Math.round((f.receita/total)*100);
      paths += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${PIE_COLORS[i]}" stroke="#0d0e10" stroke-width="1"/>`;
      if (pct >= 8) paths += `<text x="${lx.toFixed(1)}" y="${(ly+1.5).toFixed(1)}" font-size="7" font-weight="700" fill="white" text-anchor="middle">${pct}%</text>`;
      legend += `<rect x="85" y="${8+i*13}" width="7" height="7" rx="1.5" fill="${PIE_COLORS[i]}"/>`;
      const short = f.name.length > 9 ? f.name.slice(0,9)+'…' : f.name;
      legend += `<text x="95" y="${15.5+i*13}" font-size="5.5" fill="rgba(255,255,255,0.65)">${short}</text>`;
      startAngle = endAngle;
    });
    pieSvg.innerHTML = paths + legend;
  }
}