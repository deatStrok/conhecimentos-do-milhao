'use strict'; 

function aplicarShake(botao) {
    botao.classList.remove("shake"); // Garante reinício da animação
    void botao.offsetWidth; // Força reflow
    botao.classList.add("shake");

    setTimeout(() => {
        botao.classList.remove("shake");
    }, 400);
}

let playerName = null;
let totalPoints = 0; // Pontos acumulados
const rank = []; // Array para armazenar o ranking

// Função para atualizar o ranking
function updateRank() {
    const rankContainer = document.getElementById('rank-container');
    rankContainer.innerHTML = '<h3>Ranking</h3>'; // Garante que o título seja mantido
    const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
    const sortedJogadores = jogadores.sort((a, b) => (b.pontos || 0) - (a.pontos || 0));

    sortedJogadores.forEach((jogador, index) => {
        const div = document.createElement('div');
        div.textContent = `${index + 1}. ${jogador.usuario} - ${jogador.pontos || 0} pontos`;
        rankContainer.appendChild(div);
    });
}

// Atualiza o ranking dinamicamente ao detectar mudanças no localStorage
window.addEventListener('storage', (event) => {
    if (event.key === 'jogadores') {
        updateRank(); // Atualiza o ranking quando os dados dos jogadores mudam
    }
});

// Função para salvar os pontos do jogador atual
function savePlayerPoints(usuario, pontos) {
    const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
    const jogador = jogadores.find(j => j.usuario === usuario);

    if (jogador) {
        jogador.pontos = pontos; // Atualiza os pontos do jogador sem somar novamente
    } else {
        jogadores.push({ usuario, pontos }); // Adiciona um novo jogador com os pontos iniciais
    }

    localStorage.setItem('jogadores', JSON.stringify(jogadores));
}

function loginPlayer(usuario, email) {
    const loginsAtivos = JSON.parse(localStorage.getItem('loginsAtivos')) || [];
    
    // Verifica se o jogador já está logado
    const jogadorExistente = loginsAtivos.find(login => login.email === email);
    if (!jogadorExistente) {
        loginsAtivos.push({ usuario, email }); // Adiciona o novo jogador
        localStorage.setItem('loginsAtivos', JSON.stringify(loginsAtivos));
    }
}

function redirectToLoginPage() {
    window.location.href = 'login conhecimentos.html'; // Corrigido o caminho
}

document.addEventListener('DOMContentLoaded', () => {
    const switcher = document.querySelector('.tema .slider');

    function updateThemeIcon() {
        const isLightTheme = document.body.classList.contains('light-theme');
        switcher.textContent = isLightTheme ? '☼' : '☾';
    }

    switcher.parentElement.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');
        updateThemeIcon();
    });

    updateThemeIcon(); // Inicializa o ícone correto ao carregar a página
});

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-button');
    const yearSelection = document.getElementById('year-selection');
    const yearItems = document.querySelectorAll('#year-selection > ul > li');
    const confirmButton = document.getElementById('confirm-button');
    const stopButton = document.getElementById('stop-button');
    const currentPrizeDisplay = document.getElementById('current-prize');
    const nextPrizeDisplay = document.getElementById('next-prize');
    const stopPrizeDisplay = document.getElementById('stop-prize');
    const rejogarContainer = document.getElementById('rejogar-container');
    const rejogarButton = document.getElementById('rejogar-button');
    const scoreboard = document.getElementById('scoreboard').querySelector('ul');
    const helpCardButton = document.getElementById('help-card');
    const helpBoardsButton = document.getElementById('help-boards');
    const helpAudienceButton = document.getElementById('help-audience');
    const startButton = document.getElementById('start-button');
    const selectedSubject = document.getElementById('selected-subject');
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const answers = document.querySelectorAll('.answer');
    const loginButton = document.getElementById('login-button');
    const logoutOption = document.createElement('div');
    logoutOption.id = 'logout-option';
    logoutOption.textContent = 'Sair';
    logoutOption.style.display = 'none';
    document.body.appendChild(logoutOption);
    const nickname = localStorage.getItem('nickname');
    const loginsAtivos = JSON.parse(localStorage.getItem('loginsAtivos')) || [];
    const currentPlayerDisplay = document.getElementById('current-player');

    document.addEventListener('DOMContentLoaded', () => {
        if (!localStorage.getItem('loginsAtivos')) {
            localStorage.setItem('loginsAtivos', JSON.stringify([]));
        }
        if (!localStorage.getItem('jogadores')) {
            localStorage.setItem('jogadores', JSON.stringify([]));
        }
    });

    // Atualiza o jogador atual na interface
    function updateCurrentPlayer() {
        const currentPlayer = sessionStorage.getItem('currentPlayer'); // Obtém o jogador atual
        if (currentPlayer) {
            loginButton.textContent = currentPlayer; // Exibe o nickname no botão
            logoutOption.style.display = 'block'; // Exibe o botão de sair
        } else {
            loginButton.textContent = 'Login'; // Exibe "Login" se não houver jogador
            logoutOption.style.display = 'none'; // Oculta o botão de sair
        }
    }

    // Gerencia o clique no botão de login/nickname
    loginButton.addEventListener('click', () => {
        const currentPlayer = sessionStorage.getItem('currentPlayer');
        if (!currentPlayer) {
            window.location.href = 'login conhecimentos.html'; // Redireciona para a área de login
        } else {
            logoutOption.style.display = logoutOption.style.display === 'none' ? 'block' : 'none'; // Alterna a exibição do botão de sair
        }
    });

    // Gerencia o logout
    logoutOption.addEventListener('click', () => {
        sessionStorage.removeItem('currentPlayer'); // Remove o jogador atual da aba
        updateCurrentPlayer(); // Atualiza a interface para refletir o logout
    });

    // Inicializa o estado do jogador atual
    updateCurrentPlayer();

    // Sincroniza mudanças no ranking entre abas, mas ignora interferências no estado de login
    window.addEventListener('storage', (event) => {
        if (event.key === 'jogadores') {
            updateRank(); // Atualiza o ranking quando os dados dos jogadores mudam
        }
    });

    let selectedAnswer = null;
    let currentPrize = 1000;
    let lastPrize = 0;
    const maxPrize = 1000000;

    let helpBoardsUsage = 0; // Contador para o uso das placas
    let helpAudienceUsage = 0; // Contador para o uso da plateia
    let helpCardUsed = false; // Controle para o uso das cartas

    menuButton.addEventListener('click', () => {
        const isHidden = yearSelection.style.display === 'none';
        yearSelection.style.display = isHidden ? 'block' : 'none';

        const containers = [
            document.getElementById('game-container'),
            document.getElementById('rank-container'),
            document.getElementById('points-container')
        ];

        containers.forEach(container => {
            if (container) { // Verifica se o container existe
                if (isHidden) {
                    container.classList.add('menu-open'); // Move os containers para a direita
                } else {
                    container.classList.remove('menu-open'); // Volta os containers para o centro
                }
            }
        });
    });

    yearItems.forEach(item => {
        const arrow = item.querySelector('.arrow');
        const subTopics = item.querySelector('ul');

        item.addEventListener('click', () => {
            const isOpen = subTopics.style.display === 'block';
            subTopics.style.display = isOpen ? 'none' : 'block';
            arrow.classList.toggle('down', !isOpen);
        });

        subTopics.querySelectorAll('li').forEach(subject => {
            subject.addEventListener('click', (event) => {
                event.stopPropagation();
                selectedSubject.textContent = subject.textContent;
                startContainer.style.display = 'block';
                gameContainer.style.display = 'none';
            });
        });
    });

    answers.forEach(answer => {
        answer.addEventListener('click', () => {
            if (selectedAnswer) {
                selectedAnswer.classList.remove('selected');
            }
            selectedAnswer = answer;
            selectedAnswer.classList.add('selected'); // Adiciona a classe para piscar e exibir a seta
        });
    });

    const confirmDialog = document.createElement('div');
    confirmDialog.id = 'confirm-dialog';
    confirmDialog.innerHTML = `
        <p>Você tem certeza da sua escolha?</p>
        <button id="confirm-yes">Sim</button>
        <button id="confirm-no">Não</button>
    `;
    confirmDialog.style.display = 'none';
    gameContainer.appendChild(confirmDialog);

    const stopDialog = document.createElement('div');
    stopDialog.id = 'stop-dialog';
    stopDialog.innerHTML = `
        <p>Você tem certeza que quer parar aqui?</p>
        <button id="stop-yes">Sim</button>
        <button id="stop-no">Não</button>
    `;
    stopDialog.style.display = 'none';
    gameContainer.appendChild(stopDialog);

    confirmButton.addEventListener('click', () => {
        if (!selectedAnswer) {
            alert('Por favor, selecione uma resposta!');
            return;
        }
        confirmDialog.style.display = 'flex';
    });

    document.getElementById('confirm-yes').addEventListener('click', () => {
        confirmDialog.style.display = 'none';
        if (selectedAnswer.textContent.includes('C)')) {
            lastPrize = currentPrize;
            currentPrize *= 2;

            if (currentPrize > maxPrize) {
                currentPrize = maxPrize;
                endGame();
            } else {
                resetQuestionState(); // Reseta o estado da pergunta
                updatePrizeDisplays();
            }
        } else {
            const points = lastPrize > 0 ? calculatePoints(lastPrize) : 0;
            displayPointsMessage(points);
            goToRejogarContainer();
        }
    });

    document.getElementById('confirm-no').addEventListener('click', () => {
        confirmDialog.style.display = 'none';
    });

    stopButton.addEventListener('click', () => {
        stopDialog.style.display = 'flex';
    });

    document.getElementById('stop-yes').addEventListener('click', () => {
        stopDialog.style.display = 'none';
        const points = calculatePoints(currentPrize);
        displayPointsMessage(points);
        goToRejogarContainer();
    });

    document.getElementById('stop-no').addEventListener('click', () => {
        stopDialog.style.display = 'none';
    });

    const botoes = [
        { id: "help-card", countId: "help-card-count", nome: "cartas" },
        { id: "help-audience", countId: "help-audience-count", nome: "plateia" },
        { id: "help-boards", countId: "help-boards-count", nome: "placas" },
    ];

    botoes.forEach(({ id, countId, nome }) => {
        const botao = document.getElementById(id);
        const contador = document.getElementById(countId);

        botao.addEventListener("click", () => {
            let valor = parseInt(contador.textContent);

            if (valor > 0) {
                valor--;
                contador.textContent = valor;

                if (id === "help-card" && !helpCardUsed) {
                    const wrongAnswers = Array.from(answers).filter(answer => !answer.textContent.includes('C)'));
                    const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
                    wrongAnswers.forEach((answer, index) => {
                        if (index !== randomIndex) {
                            answer.style.visibility = 'hidden';
                        }
                    });
                    helpCardUsed = true;
                    botao.disabled = false;
                } else if (id === "help-boards" && helpBoardsUsage < 3) {
                    const helpBoardsContainer = document.getElementById('help-boards-container');
                    const correctAnswer = Array.from(answers).find(answer => answer.textContent.includes('C)'));
                    const possibleAnswers = Array.from(answers).sort(() => Math.random() - 0.5).slice(0, 3);

                    if (!possibleAnswers.includes(correctAnswer)) {
                        possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)] = correctAnswer;
                    }

                    const board = document.createElement('div');
                    board.classList.add('board');
                    board.textContent = possibleAnswers[helpBoardsUsage].textContent.split(')')[0];
                    helpBoardsContainer.appendChild(board);

                    // Adiciona a classe 'raised' para ativar a animação
                    setTimeout(() => board.classList.add('raised'), 0);

                    helpBoardsContainer.style.display = 'flex';
                    helpBoardsUsage++;
                    contador.textContent = (3 - helpBoardsUsage).toString();

                    if (helpBoardsUsage >= 3) {
                        botao.disabled = false;
                    }
                } else if (id === "help-audience" && helpAudienceUsage < 2) {
                    const correctAnswer = Array.from(answers).find(answer => answer.textContent.includes('C)'));
                    const randomAnswer = Math.random() < 0.4 ? correctAnswer : answers[Math.floor(Math.random() * answers.length)];
                    randomAnswer.classList.add('blink');
                    setTimeout(() => randomAnswer.classList.remove('blink'), 5000);
                    helpAudienceUsage++;
                    contador.textContent = (2 - helpAudienceUsage).toString();

                    if (helpAudienceUsage >= 2) {
                        botao.disabled = false;
                    }
                }
            } else {
                aplicarShake(botao); // Mantém o tremor quando o contador está em 0
            }
        });
    });

    startButton.addEventListener('click', () => {
        if (!selectedSubject || selectedSubject.textContent.trim() === '' || selectedSubject.textContent === 'escolha seu ano e materia desejada no menu') {
            const menu = document.getElementById('menu-button');
            menu.style.animation = 'blink-red 1s infinite';
            setTimeout(() => {
                menu.style.animation = ''; // Remove a animação após 3 segundos
            }, 3000);
            return;
        }
        startContainer.style.display = 'none'; // Oculta o container inicial
        gameContainer.style.display = 'block'; // Exibe o game-container
        updatePrizeDisplays();
        selectedAnswer = null;
        answers.forEach(answer => {
            answer.classList.remove('selected');
            answer.style.visibility = 'visible';
        });
    });

    rejogarButton.addEventListener('click', () => {
        resetGame();
        rejogarContainer.style.display = 'none'; // Oculta o container de rejogar
        startContainer.style.display = 'block'; // Exibe o container inicial
    });

    function resetGame() {
        // Não acumula pontos novamente ao reiniciar o jogo
        currentPrize = 1000;
        lastPrize = 0;
        updatePrizeDisplays();
        startContainer.style.display = 'block';
        gameContainer.style.display = 'none';
        rejogarContainer.style.display = 'none';
        selectedAnswer = null;
        answers.forEach(answer => {
            answer.classList.remove('selected');
            answer.style.visibility = 'visible';
        });
        helpBoardsUsage = 0; // Reseta o contador de uso das placas
        helpAudienceUsage = 0; // Reseta o contador de uso da plateia
        helpCardUsed = false; // Reseta o uso das cartas

        // Reativa os botões de ajuda e reseta os contadores
        document.getElementById('help-card-count').textContent = '1';
        document.getElementById('help-boards-count').textContent = '3';
        document.getElementById('help-audience-count').textContent = '2';
        helpCardButton.disabled = false;
        helpBoardsButton.disabled = false;
        helpAudienceButton.disabled = false;

        // Remove as placas do container
        const helpBoardsContainer = document.getElementById('help-boards-container');
        helpBoardsContainer.innerHTML = ''; // Garante que as placas sejam removidas
        helpBoardsContainer.style.display = 'none'; // Oculta o container de placas
    }

    function resetQuestionState() {
        // Reseta o estado da pergunta para a próxima rodada
        selectedAnswer = null;
        answers.forEach(answer => {
            answer.classList.remove('selected', 'blink');
            answer.style.visibility = 'visible';
        });

        const helpBoardsContainer = document.getElementById('help-boards-container');
        helpBoardsContainer.innerHTML = ''; // Remove as placas

        helpBoardsUsage = 0; // Reseta o contador de uso das placas
        helpAudienceUsage = 0; // Reseta o contador de uso da plateia
        helpCardUsed = false; // Reseta o uso das cartas
    }

    function endGame() {
        gameContainer.style.display = 'none';
        rejogarContainer.style.display = 'flex';
    }

    function goToRejogarContainer() {
        gameContainer.style.display = 'none';
        rejogarContainer.style.display = 'flex';
    }

    function updatePrizeDisplays() {
        currentPrizeDisplay.textContent = `Valor atual se parar: R$ ${currentPrize}`;
        nextPrizeDisplay.textContent = currentPrize < maxPrize ? `Se acertar: R$ ${currentPrize * 2}` : 'Se acertar: R$ 1.000.000';
        stopPrizeDisplay.textContent = `Se errar: R$ ${lastPrize}`;
        updateScoreboard();
    }

    function updateScoreboard() {
        scoreboard.innerHTML = '';
        let prizes = [0, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000, 1000000];
        prizes.forEach((prize, index) => {
            const li = document.createElement('li');
            li.textContent = `R$ ${prize.toLocaleString()}`;

            if (prize === currentPrize) {
                li.classList.add('current'); // Atual
            } else if (prize < currentPrize && index === prizes.indexOf(currentPrize) - 1) {
                li.classList.add('previous'); // Anterior
            } else if (prize > currentPrize && index === prizes.indexOf(currentPrize) + 1) {
                li.classList.add('next'); // Próximo
            }

            scoreboard.appendChild(li);
        });
    }

    function calculatePoints(prize) {
        return Math.min(1000, Math.max(1, prize / 1000));
    }

    function displayPointsMessage(points) {
        const currentPlayer = sessionStorage.getItem('currentPlayer'); // Obtém o jogador atual
        if (currentPlayer) {
            const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
            const jogador = jogadores.find(j => j.usuario === currentPlayer);
            const totalPoints = (jogador?.pontos || 0) + points; // Calcula os pontos totais corretamente
            savePlayerPoints(currentPlayer, totalPoints); // Salva os pontos atualizados
        }

        document.getElementById('total-points').textContent = `${points} pontos`; // Exibe os pontos da rodada
        updateRank(); // Atualiza o ranking

        rejogarContainer.innerHTML = `
            <div id="rejogar-border">
                <h1>Parabéns, você recebeu ${points} pontos!</h1>
                <button id="rejogar-button">Rejogar</button>
            </div>
        `;
        document.getElementById('rejogar-button').addEventListener('click', () => {
            rejogarContainer.style.display = 'none'; // Apenas reinicia o jogo
            resetGame();
        });
    }

    // Atualiza o sistema para lembrar o e-mail do usuário de forma independente por aba
    document.querySelector('.sign-in-container form').addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.querySelector('.sign-in-container input[placeholder="E-mail"]').value;
        const senha = document.querySelector('.sign-in-container input[placeholder="Senha"]').value;
        const lembrarDeMim = document.getElementById('remember').checked;

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
        const jogador = jogadores.find(jogador => jogador.email === email && jogador.senha === senha);

        if (jogador) {
            if (lembrarDeMim) {
                sessionStorage.setItem('rememberedEmail', email); // Salva o e-mail apenas na aba atual
            } else {
                sessionStorage.removeItem('rememberedEmail');
            }

            sessionStorage.setItem('currentEmail', email);
            alert(`Bem-vindo, ${jogador.usuario}!`);
            window.location.href = 'conhecimentos do milhao1.html'; // Redireciona para o jogo
        } else {
            alert('E-mail ou senha incorretos.');
        }
    });

    // Preenche automaticamente o campo de e-mail com base no "Lembrar de mim" ou no e-mail único da aba
    const rememberedEmail = sessionStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.querySelector('.sign-in-container input[placeholder="E-mail"]').value = rememberedEmail;
    } else {
        const uniqueEmail = sessionStorage.getItem('uniqueEmail') || `user_${Date.now()}@example.com`;
        sessionStorage.setItem('uniqueEmail', uniqueEmail);
        document.querySelector('.sign-in-container input[placeholder="E-mail"]').value = uniqueEmail;
    }

    // Inicialização
    updatePrizeDisplays();
    gameContainer.style.display = 'none';
    updateRank();
});


