'use strict';

const answers = document.querySelectorAll('.answer');
const confirmButton = document.getElementById('confirm-button');
const helpButton = document.getElementById('help-button');
const stopButton = document.getElementById('stop-button');
const currentPrizeDisplay = document.getElementById('current-prize');
const nextPrizeDisplay = document.getElementById('next-prize');
const stopPrizeDisplay = document.getElementById('stop-prize');
const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');

let selectedAnswer = null;
let currentPrize = 1000; // Jogador começa com R$ 1.000
let lastPrize = 0;

// Atualizar exibição dos valores
function updatePrizeDisplays() {
    currentPrizeDisplay.textContent = `Valor atual: R$ ${currentPrize}`;
    nextPrizeDisplay.textContent = `Se acertar: R$ ${currentPrize * 2}`;
    stopPrizeDisplay.textContent = `Se errar ou parar: R$ ${lastPrize}`;
}

// Selecionar uma resposta
answers.forEach(answer => {
    answer.addEventListener('click', () => {
        if (selectedAnswer) {
            selectedAnswer.classList.remove('selected');
        }
        selectedAnswer = answer;
        selectedAnswer.classList.add('selected');
    });
});

// Confirmar resposta
confirmButton.addEventListener('click', () => {
    if (!selectedAnswer) {
        alert('Por favor, selecione uma resposta!');
        return;
    }

    if (selectedAnswer.textContent.includes('C)')) {
        lastPrize = currentPrize;
        currentPrize *= 2;
        alert(`Resposta correta! Você ganhou R$ ${currentPrize}.`);
        updatePrizeDisplays();
        // Lógica para próxima pergunta...
    } else {
        alert(`Resposta errada! Você ganhou R$ ${lastPrize}.`);
        resetGame();
    }
});

// Parar o jogo
stopButton.addEventListener('click', () => {
    alert(`Você parou e ganhou R$ ${currentPrize}.`);
    resetGame();
});

// Ajuda (exemplo: eliminar uma resposta errada)
helpButton.addEventListener('click', () => {
    const wrongAnswers = Array.from(answers).filter(answer => !answer.textContent.includes('C)'));
    if (wrongAnswers.length > 0) {
        wrongAnswers[0].style.visibility = 'hidden';
    }
});

// Resetar o jogo
function resetGame() {
    currentPrize = 1000;
    lastPrize = 0;
    updatePrizeDisplays();
    startContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}

// Inicializar valores ao carregar o jogo
updatePrizeDisplays();

// Certifique-se de que este arquivo não conflita com a lógica principal do jogo.
