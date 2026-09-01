// ==================== DADOS DOS PERSONAGENS ====================
const CHARACTERS = [
    { id: 'scorpion', name: 'Scorpion', colors: { head: '#f59e0b', torso: '#dc2626', arm: '#f59e0b', leg: '#7c2d12' }, special: 'lanca', specialColor: '#f59e0b', description: 'Get over here!' },
    { id: 'subzero', name: 'Sub-Zero', colors: { head: '#3b82f6', torso: '#1e3a8a', arm: '#3b82f6', leg: '#1e3a8a' }, special: 'gelo', specialColor: '#67e8f9', description: 'Freeze!' },
    { id: 'liukang', name: 'Liu Kang', colors: { head: '#fbbf24', torso: '#dc2626', arm: '#fbbf24', leg: '#991b1b' }, special: 'fogofogo', specialColor: '#ef4444', description: 'Fiery!' },
    { id: 'johnnycage', name: 'Johnny Cage', colors: { head: '#fbbf24', torso: '#166534', arm: '#fbbf24', leg: '#14532d' }, special: 'shadow', specialColor: '#7c3aed', description: 'Pow!' },
    { id: 'sonya', name: 'Sonya Blade', colors: { head: '#fbbf24', torso: '#0ea5e9', arm: '#fbbf24', leg: '#0369a1' }, special: 'anel', specialColor: '#22d3ee', description: 'Ring!' },
    { id: 'raiden', name: 'Raiden', colors: { head: '#fbbf24', torso: '#e5e7eb', arm: '#fbbf24', leg: '#374151' }, special: 'raio', specialColor: '#facc15', description: 'Thunder!' },
    { id: 'reptile', name: 'Reptile', colors: { head: '#22c55e', torso: '#166534', arm: '#22c55e', leg: '#14532d' }, special: 'acido', specialColor: '#4ade80', description: 'Acid!' },
    { id: 'baraka', name: 'Baraka', colors: { head: '#a8a29e', torso: '#78716c', arm: '#a8a29e', leg: '#57534e' }, special: 'lamina', specialColor: '#d4d4d4', description: 'Blades!' },
    { id: 'kitana', name: 'Kitana', colors: { head: '#fbbf24', torso: '#3b82f6', arm: '#fbbf24', leg: '#1d4ed8' }, special: 'ventoinha', specialColor: '#93c5fd', description: 'Fans!' },
    { id: 'mileena', name: 'Mileena', colors: { head: '#ec4899', torso: '#a855f7', arm: '#ec4899', leg: '#7c3aed' }, special: 'sai', specialColor: '#f472b6', description: 'Sai!' },
    { id: 'jax', name: 'Jax', colors: { head: '#92400e', torso: '#4b5563', arm: '#92400e', leg: '#374151' }, special: 'sonic', specialColor: '#a3a3a3', description: 'Boom!' },
    { id: 'kano', name: 'Kano', colors: { head: '#dc2626', torso: '#111827', arm: '#dc2626', leg: '#030712' }, special: 'olho', specialColor: '#ef4444', description: 'Laser!' },
    { id: 'shangtsung', name: 'Shang Tsung', colors: { head: '#fbbf24', torso: '#7c2d12', arm: '#fbbf24', leg: '#451a03' }, special: 'alma', specialColor: '#a855f7', description: 'Souls!' },
    { id: 'goro', name: 'Goro', colors: { head: '#92400e', torso: '#78350f', arm: '#92400e', leg: '#451a03' }, special: 'lanca', specialColor: '#b45309', description: 'Crush!' },
    { id: 'shokan', name: 'Sheeva', colors: { head: '#b91c1c', torso: '#7f1d1d', arm: '#b91c1c', leg: '#450a0a' }, special: 'garras', specialColor: '#f87171', description: 'Claws!' },
    { id: 'erron', name: 'Erron Black', colors: { head: '#fbbf24', torso: '#292524', arm: '#fbbf24', leg: '#1c1917' }, special: 'tiro', specialColor: '#facc15', description: 'Bang!' }
];

// ==================== ESTADO DO JOGO ====================
let gameState = {
    screen: 'title',
    selectedP1: null,
    selectedP2: null,
    selectingPlayer: 1,
    round: 1,
    maxRounds: 3,
    p1Wins: 0,
    p2Wins: 0,
    timer: 99,
    timerInterval: null,
    fightActive: false,
    keys: {},
    projectiles: [],
    projectilesId: 0
};

let p1 = null;
let p2 = null;

// ==================== ÁUDIO (Web Audio API) ====================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    switch(type) {
        case 'punch':
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start(); osc.stop(audioCtx.currentTime + 0.1);
            break;
        case 'kick':
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start(); osc.stop(audioCtx.currentTime + 0.15);
            break;
        case 'special':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(); osc.stop(audioCtx.currentTime + 0.3);
            break;
        case 'block':
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            osc.start(); osc.stop(audioCtx.currentTime + 0.08);
            break;
        case 'hit':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start(); osc.stop(audioCtx.currentTime + 0.2);
            break;
        case 'ko':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.8);
            gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            osc.start(); osc.stop(audioCtx.currentTime + 0.8);
            break;
        case 'round':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.setValueAtTime(550, audioCtx.currentTime + 0.1);
            osc.frequency.setValueAtTime(660, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.start(); osc.stop(audioCtx.currentTime + 0.4);
            break;
    }
}

// ==================== NAVEGAÇÃO DE TELAS ====================
function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + name).classList.add('active');
    gameState.screen = name;
}

function showTitle() {
    showScreen('title');
}

function showCharacterSelect() {
    initAudio();
    showScreen('select');
    gameState.selectedP1 = null;
    gameState.selectedP2 = null;
    gameState.selectingPlayer = 1;
    gameState.p1Wins = 0;
    gameState.p2Wins = 0;
    gameState.round = 1;
    renderCharacterGrid();
    updateSelectUI();
    document.getElementById('btn-fight').disabled = true;
}

// ==================== SELEÇÃO DE PERSONAGENS ====================
function renderCharacterGrid() {
    const grid = document.getElementById('char-grid');
    grid.innerHTML = '';
    CHARACTERS.forEach(char => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <div class="char-sprite" style="
                background: ${char.colors.torso};
                border-radius: 50% 50% 5px 5px;
                border: 2px solid ${char.colors.head};
            "></div>
            <span class="char-name">${char.name}</span>
        `;
        card.addEventListener('click', () => selectCharacter(char, 1));
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            selectCharacter(char, 2);
        });
        card.dataset.charId = char.id;
        grid.appendChild(card);
    });
}

function selectCharacter(char, player) {
    initAudio();
    playSound('block');
    if (player === 1) {
        gameState.selectedP1 = char;
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected-p1'));
        document.querySelector(`[data-char-id="${char.id}"]`).classList.add('selected-p1');
    } else {
        gameState.selectedP2 = char;
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected-p2'));
        document.querySelector(`[data-char-id="${char.id}"]`).classList.add('selected-p2');
    }
    updateSelectUI();
}

function updateSelectUI() {
    const preview1 = document.getElementById('p1-preview');
    const preview2 = document.getElementById('p2-preview');
    const name1 = document.getElementById('p1-name');
    const name2 = document.getElementById('p2-name');

    if (gameState.selectedP1) {
        preview1.style.background = gameState.selectedP1.colors.torso;
        preview1.style.border = `3px solid ${gameState.selectedP1.colors.head}`;
        name1.textContent = gameState.selectedP1.name;
    } else {
        preview1.style.background = 'rgba(196,30,30,0.1)';
        preview1.style.border = '3px solid var(--mk-red)';
        name1.textContent = '???';
    }

    if (gameState.selectedP2) {
        preview2.style.background = gameState.selectedP2.colors.torso;
        preview2.style.border = `3px solid ${gameState.selectedP2.colors.head}`;
        name2.textContent = gameState.selectedP2.name;
    } else {
        preview2.style.background = 'rgba(196,30,30,0.1)';
        preview2.style.border = '3px solid var(--mk-red)';
        name2.textContent = '???';
    }

    document.getElementById('btn-fight').disabled = !(gameState.selectedP1 && gameState.selectedP2);
}

// ==================== CRIAÇÃO DO LUTADOR ====================
function createFighter(charData, playerNum, x) {
    return {
        char: charData,
        player: playerNum,
        x: x,
        y: 0,
        health: 100,
        maxHealth: 100,
        velocityX: 0,
        velocityY: 0,
        facingRight: playerNum === 1,
        isGrounded: true,
        isAttacking: false,
        isBlocking: false,
        isHurt: false,
        attackType: null,
        attackCooldown: 0,
        hurtTimer: 0,
        comboCount: 0,
        comboTimer: 0,
        specialMeter: 0,
        maxSpecial: 100,
        width: 80,
        height: 160
    };
}

// ==================== INÍCIO DA LUTA ====================
function startFight() {
    if (!gameState.selectedP1 || !gameState.selectedP2) return;
    initAudio();
    showScreen('fight');

    const arena = document.getElementById('arena');
    const arenaWidth = arena.offsetWidth;
    const groundY = 120;

    p1 = createFighter(gameState.selectedP1, 1, arenaWidth * 0.2);
    p2 = createFighter(gameState.selectedP2, 2, arenaWidth * 0.8 - 80);

    renderFighter('fighter-p1', p1);
    renderFighter('fighter-p2', p2);

    document.getElementById('hud-p1-name').textContent = p1.char.name.toUpperCase();
    document.getElementById('hud-p2-name').textContent = p2.char.name.toUpperCase();

    updateHealthBars();
    gameState.timer = 99;
    document.getElementById('timer').textContent = '99';
    gameState.fightActive = false;

    showRoundOverlay('ROUND ' + gameState.round, () => {
        setTimeout(() => {
            showRoundOverlay('FIGHT!', () => {
                gameState.fightActive = true;
                startTimer();
                requestAnimationFrame(gameLoop);
            });
        }, 300);
    });
}

function renderFighter(elementId, fighter) {
    const el = document.getElementById(elementId);
    const c = fighter.char.colors;
    const dir = fighter.facingRight ? '1' : '-1';

    el.style.left = fighter.x + 'px';
    el.style.bottom = (120 + fighter.y) + 'px';
    el.style.transform = `scaleX(${dir})`;

    el.innerHTML = `
        <div class="fighter-body">
            <div class="fighter-head" style="background: ${c.head};"></div>
            <div class="fighter-torso" style="background: ${c.torso};"></div>
            <div class="fighter-arm-left" style="background: ${c.arm};"></div>
            <div class="fighter-arm-right" style="background: ${c.arm};"></div>
            <div class="fighter-leg-left" style="background: ${c.leg};"></div>
            <div class="fighter-leg-right" style="background: ${c.leg};"></div>
        </div>
    `;
}

function showRoundOverlay(text, callback) {
    const overlay = document.getElementById('fight-overlay');
    const textEl = document.getElementById('fight-text');
    textEl.textContent = text;
    overlay.classList.add('active');
    playSound('round');
    setTimeout(() => {
        overlay.classList.remove('active');
        if (callback) callback();
    }, 1000);
}

// ==================== TIMER ====================
function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (!gameState.fightActive) return;
        gameState.timer--;
        document.getElementById('timer').textContent = gameState.timer;
        if (gameState.timer <= 0) {
            endRound();
        }
    }, 1000);
}

// ==================== CONTROLES ====================
document.addEventListener('keydown', (e) => {
    gameState.keys[e.key.toLowerCase()] = true;
    gameState.keys[e.code] = true;

    if (!gameState.fightActive || !p1 || !p2) return;

    // Jogador 1
    if (e.key.toLowerCase() === 'j') attack(p1, p2, 'punch');
    if (e.key.toLowerCase() === 'k') attack(p1, p2, 'kick');
    if (e.key.toLowerCase() === 'l') specialAttack(p1, p2);
    if (e.key.toLowerCase() === 's') p1.isBlocking = true;

    // Jogador 2
    if (e.key === '1') attack(p2, p1, 'punch');
    if (e.key === '2') attack(p2, p1, 'kick');
    if (e.key === '3') specialAttack(p2, p1);
    if (e.key === 'ArrowDown') p2.isBlocking = true;
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key.toLowerCase()] = false;
    gameState.keys[e.code] = false;

    if (e.key.toLowerCase() === 's') { if (p1) p1.isBlocking = false; }
    if (e.key === 'ArrowDown') { if (p2) p2.isBlocking = false; }
});

// ==================== FÍSICA E LOOP DO JOGO ====================
const GRAVITY = 0.8;
const MOVE_SPEED = 6;
const JUMP_FORCE = -15;
const GROUND_Y = 0;
const ARENA_PADDING = 120;

function gameLoop() {
    if (!gameState.fightActive) return;

    handleInput();
    updatePhysics(p1);
    updatePhysics(p2);
    checkCollisions();
    updateProjectiles();
    renderAll();

    if (p1.health <= 0 || p2.health <= 0) {
        endRound();
        return;
    }

    requestAnimationFrame(gameLoop);
}

function handleInput() {
    const keys = gameState.keys;

    // P1
    if (keys['a'] && !p1.isAttacking && !p1.isHurt) {
        p1.velocityX = -MOVE_SPEED;
        p1.facingRight = false;
    } else if (keys['d'] && !p1.isAttacking && !p1.isHurt) {
        p1.velocityX = MOVE_SPEED;
        p1.facingRight = true;
    } else {
        p1.velocityX *= 0.8;
    }

    if (keys['w'] && p1.isGrounded && !p1.isAttacking) {
        p1.velocityY = JUMP_FORCE;
        p1.isGrounded = false;
    }

    // P2
    if (keys['ArrowLeft'] && !p2.isAttacking && !p2.isHurt) {
        p2.velocityX = -MOVE_SPEED;
        p2.facingRight = false;
    } else if (keys['ArrowRight'] && !p2.isAttacking && !p2.isHurt) {
        p2.velocityX = MOVE_SPEED;
        p2.facingRight = true;
    } else {
        p2.velocityX *= 0.8;
    }

    if (keys['ArrowUp'] && p2.isGrounded && !p2.isAttacking) {
        p2.velocityY = JUMP_FORCE;
        p2.isGrounded = false;
    }
}

function updatePhysics(fighter) {
    fighter.velocityY += GRAVITY;
    fighter.y += fighter.velocityY;
    fighter.x += fighter.velocityX;

    if (fighter.y >= GROUND_Y) {
        fighter.y = GROUND_Y;
        fighter.velocityY = 0;
        fighter.isGrounded = true;
    }

    const arena = document.getElementById('arena');
    const maxX = arena.offsetWidth - fighter.width;
    fighter.x = Math.max(0, Math.min(maxX, fighter.x));

    if (fighter.attackCooldown > 0) fighter.attackCooldown--;
    if (fighter.hurtTimer > 0) {
        fighter.hurtTimer--;
        if (fighter.hurtTimer <= 0) fighter.isHurt = false;
    }
    if (fighter.comboTimer > 0) {
        fighter.comboTimer--;
        if (fighter.comboTimer <= 0) fighter.comboCount = 0;
    }
}

// ==================== ATAQUES ====================
function attack(attacker, defender, type) {
    if (attacker.attackCooldown > 0 || attacker.isHurt) return;

    attacker.isAttacking = true;
    attacker.attackType = type;

    const el = document.getElementById('fighter-p' + attacker.player);
    el.classList.add(type === 'punch' ? 'attacking' : 'kicking');
    setTimeout(() => el.classList.remove('attacking', 'kicking'), 200);

    const range = type === 'kick' ? 90 : 70;
    const damage = type === 'kick' ? 8 : 5;
    const dx = Math.abs(attacker.x - defender.x);
    const dy = Math.abs(attacker.y - defender.y);

    if (dx < range && dy < 80) {
        if (defender.isBlocking) {
            playSound('block');
            attacker.attackCooldown = 15;
            setTimeout(() => { attacker.isAttacking = false; }, 100);
            return;
        }

        const actualDamage = calculateDamage(damage, attacker, defender);
        defender.health -= actualDamage;
        defender.isHurt = true;
        defender.hurtTimer = 15;
        defender.velocityX = attacker.facingRight ? 5 : -5;

        attacker.comboCount++;
        attacker.comboTimer = 60;
        attacker.specialMeter = Math.min(attacker.maxSpecial, attacker.specialMeter + 10);

        showHitEffect(defender);
        playSound(type === 'punch' ? 'punch' : 'kick');
        showCombo(attacker.player, attacker.comboCount);

        if (defender.health < 0) defender.health = 0;
        updateHealthBars();
    } else {
        attacker.attackCooldown = 10;
    }

    setTimeout(() => { attacker.isAttacking = false; }, 150);
    attacker.attackCooldown = type === 'kick' ? 20 : 12;
}

function specialAttack(attacker, defender) {
    if (attacker.attackCooldown > 0 || attacker.isHurt || attacker.specialMeter < 30) return;

    attacker.specialMeter -= 30;
    attacker.isAttacking = true;
    attacker.attackType = 'special';

    const el = document.getElementById('fighter-p' + attacker.player);
    el.classList.add('special');
    setTimeout(() => el.classList.remove('special'), 400);

    playSound('special');

    const arena = document.getElementById('arena');
    const proj = document.createElement('div');
    proj.className = 'projectile';
    proj.style.background = attacker.char.specialColor;
    proj.style.boxShadow = `0 0 15px ${attacker.char.specialColor}`;
    proj.id = 'proj-' + gameState.projectilesId++;

    const startX = attacker.facingRight ? attacker.x + 80 : attacker.x - 30;
    proj.style.left = startX + 'px';
    proj.style.bottom = (120 + 60) + 'px';
    proj.style.animation = `projectile${attacker.facingRight ? 'Right' : 'Left'} 0.8s linear forwards`;

    arena.appendChild(proj);

    gameState.projectiles.push({
        id: proj.id,
        x: startX,
        y: 60,
        speed: attacker.facingRight ? 12 : -12,
        damage: 12,
        owner: attacker.player,
        element: proj,
        life: 80
    });

    attacker.attackCooldown = 30;
    setTimeout(() => { attacker.isAttacking = false; }, 300);
}

function calculateDamage(baseDamage, attacker, defender) {
    let dmg = baseDamage;
    if (attacker.comboCount > 1) dmg += attacker.comboCount;
    const defense = defender.isBlocking ? 0.3 : 1;
    return Math.round(dmg * defense);
}

// ==================== COLISÕES ====================
function checkCollisions() {
    if (!p1 || !p2) return;
    const dx = Math.abs(p1.x - p2.x);
    if (dx < 60) {
        if (p1.x < p2.x) {
            p1.x -= 3;
            p2.x += 3;
        } else {
            p1.x += 3;
            p2.x -= 3;
        }
    }
}

// ==================== PROJÉTEIS ====================
function updateProjectiles() {
    const toRemove = [];
    gameState.projectiles.forEach(proj => {
        proj.x += proj.speed;
        proj.life--;
        proj.element.style.left = proj.x + 'px';

        const target = proj.owner === 1 ? p2 : p1;
        const dx = Math.abs(proj.x - target.x);
        const dy = Math.abs(proj.y - target.y);

        if (dx < 50 && dy < 80) {
            if (!target.isBlocking) {
                target.health -= proj.damage;
                target.isHurt = true;
                target.hurtTimer = 15;
                target.velocityX = proj.speed > 0 ? 8 : -8;
                showHitEffect(target);
                playSound('hit');
                if (target.health < 0) target.health = 0;
                updateHealthBars();
            } else {
                playSound('block');
            }
            toRemove.push(proj.id);
        }

        if (proj.life <= 0 || proj.x < -50 || proj.x > 1500) {
            toRemove.push(proj.id);
        }
    });

    toRemove.forEach(id => {
        const idx = gameState.projectiles.findIndex(p => p.id === id);
        if (idx !== -1) {
            gameState.projectiles[idx].element.remove();
            gameState.projectiles.splice(idx, 1);
        }
    });
}

// ==================== EFEITOS VISUAIS ====================
function showHitEffect(fighter) {
    const hitId = 'hit-p' + fighter.player;
    const hitEl = document.getElementById(hitId);
    hitEl.style.left = (fighter.x + 20) + 'px';
    hitEl.style.bottom = (120 + 60) + 'px';
    hitEl.classList.remove('active');
    void hitEl.offsetWidth;
    hitEl.classList.add('active');
    setTimeout(() => hitEl.classList.remove('active'), 300);
}

function showCombo(player, count) {
    if (count < 2) return;
    const el = document.getElementById('combo-p' + player);
    el.textContent = count + ' COMBO!';
    el.classList.remove('active');
    void el.offsetWidth;
    el.classList.add('active');
}

function updateHealthBars() {
    if (!p1 || !p2) return;
    const p1Pct = (p1.health / p1.maxHealth) * 100;
    const p2Pct = (p2.health / p2.maxHealth) * 100;

    document.getElementById('p1-health').style.width = p1Pct + '%';
    document.getElementById('p2-health').style.width = p2Pct + '%';

    setTimeout(() => {
        document.getElementById('p1-damage').style.width = p1Pct + '%';
        document.getElementById('p2-damage').style.width = p2Pct + '%';
    }, 300);

    setHealthColor('p1-health', p1Pct);
    setHealthColor('p2-health', p2Pct);
}

function setHealthColor(id, pct) {
    const el = document.getElementById(id);
    if (pct > 50) el.style.background = 'linear-gradient(180deg, #22c55e, #16a34a)';
    else if (pct > 25) el.style.background = 'linear-gradient(180deg, #eab308, #ca8a04)';
    else el.style.background = 'linear-gradient(180deg, #dc2626, #b91c1c)';
}

function renderAll() {
    renderFighter('fighter-p1', p1);
    renderFighter('fighter-p2', p2);
}

// ==================== FIM DA RODADA ====================
function endRound() {
    gameState.fightActive = false;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);

    let winner = null;
    if (p1.health <= 0 && p2.health <= 0) {
        showRoundOverlay('EMPATE!', nextRound);
        return;
    } else if (p1.health <= 0) {
        winner = 2;
        gameState.p2Wins++;
    } else if (p2.health <= 0) {
        winner = 1;
        gameState.p1Wins++;
    } else {
        winner = p1.health >= p2.health ? 1 : 2;
        if (winner === 1) gameState.p1Wins++;
        else gameState.p2Wins++;
    }

    const winnerChar = winner === 1 ? p1.char : p2.char;
    playSound('ko');

    if (gameState.p1Wins >= 2 || gameState.p2Wins >= 2) {
        showRoundOverlay(winnerChar.name.toUpperCase() + ' VENCE!', () => {
            setTimeout(() => showResult(winner), 1500);
        });
    } else {
        const text = 'JOGADOR ' + winner + ' VENCE!';
        showRoundOverlay(text, nextRound);
    }
}

function nextRound() {
    gameState.round++;
    startFight();
}

function showResult(winner) {
    showScreen('result');
    document.getElementById('result-title').textContent =
        winner === 1 ? 'JOGADOR 1 VENCE!' : 'JOGADOR 2 VENCE!';
    document.getElementById('result-winner').textContent = winner === 1 ? p1.char.name : p2.char.name;

    const winnerChar = winner === 1 ? p1.char : p2.char;
    const resultDiv = document.getElementById('result-fighter');
    resultDiv.style.background = winnerChar.colors.torso;
    resultDiv.style.border = `4px solid ${winnerChar.colors.head}`;
    resultDiv.style.borderRadius = '10px';
}

// ==================== PREVENIR SCROLL ====================
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});
