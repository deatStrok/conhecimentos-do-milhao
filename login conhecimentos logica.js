document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const overlayRight = document.querySelector('.overlay-right');

    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
        overlayRight.innerHTML = `
            <h1>Já possui uma conta?</h1>
            <p>Faça login agora!</p>
            <button class="ghost" id="dynamicSignIn">Login</button>
        `;
        document.getElementById('dynamicSignIn').addEventListener('click', () => {
            container.classList.remove("right-panel-active");
            overlayRight.innerHTML = `
                <h1>Não possui uma conta?</h1>
                <p>Cadastre-se agora!</p>
                <button class="ghost" id="dynamicSignUp">Cadastrar</button>
            `;
            document.getElementById('dynamicSignUp').addEventListener('click', () => {
                container.classList.add("right-panel-active");
                document.getElementById('dynamicSignIn').click();
            });
        });
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });

    // Redirecionamento ao clicar em "Cadastrar"
    document.querySelector('.sign-up-container form').addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = document.querySelector('.sign-up-container input[placeholder="Nome"]').value;
        const usuario = document.querySelector('.sign-up-container input[placeholder="Usuário"]').value; // Apelido escolhido
        const email = document.querySelector('.sign-up-container input[placeholder="E-mail"]').value;
        const senha = document.querySelector('.sign-up-container input[placeholder="Senha"]').value;
        const confirmarSenha = document.querySelector('.sign-up-container input[placeholder="Confirmar Senha"]').value;

        if (!nome || !usuario || !email || !senha || !confirmarSenha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        const jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
        if (jogadores.some(jogador => jogador.email === email)) {
            alert('Este e-mail já está cadastrado.');
            return;
        }

        jogadores.push({ nome, usuario, email, senha }); // Salva o apelido no localStorage
        localStorage.setItem('jogadores', JSON.stringify(jogadores));
        alert(`Cadastro realizado com sucesso! Bem-vindo, ${usuario}!`);
        window.location.href = 'conhecimentos do milhao1.html';
    });

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

        // Após o login, armazena o nickname do jogador no sessionStorage
        if (jogador) {
            if (lembrarDeMim) {
                sessionStorage.setItem('rememberedEmail', email);
            } else {
                sessionStorage.removeItem('rememberedEmail');
            }

            sessionStorage.setItem('currentEmail', email);
            sessionStorage.setItem('currentPlayer', jogador.usuario); // Armazena o nickname do jogador
            alert(`Bem-vindo, ${jogador.usuario}!`);
            window.location.href = 'conhecimentos do milhao1.html'; // Redireciona para o jogo
        } else {
            alert('E-mail ou senha incorretos.');
        }
    });

    // Atualiza o sistema para ativar automaticamente o botão "Lembrar de mim" se o e-mail for preenchido automaticamente
    const rememberedEmail = sessionStorage.getItem('rememberedEmail');
    const rememberCheckbox = document.getElementById('remember');

    if (rememberedEmail) {
        document.querySelector('.sign-in-container input[placeholder="E-mail"]').value = rememberedEmail;
        rememberCheckbox.checked = true; // Ativa o botão "Lembrar de mim"
    } else {
        const uniqueEmail = sessionStorage.getItem('uniqueEmail') || `user_${Date.now()}@example.com`;
        sessionStorage.setItem('uniqueEmail', uniqueEmail);
        document.querySelector('.sign-in-container input[placeholder="E-mail"]').value = uniqueEmail;
        rememberCheckbox.checked = false; // Desativa o botão "Lembrar de mim"
    }

    // Cria um botão para visualizar a senha
    document.querySelectorAll('input[type="password"]').forEach(input => {
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.textContent = '👁️';

        if (input.closest('.sign-in-container')) {
            toggleButton.classList.add('toggle-password-login');
            toggleButton.addEventListener('click', () => {
                input.type = input.type === 'password' ? 'text' : 'password';
                toggleButton.textContent = input.type === 'password' ? '👁️' : '🙈';
            });

            input.parentNode.insertBefore(toggleButton, input.nextSibling);
        } else if (input.closest('.sign-up-container')) {
            toggleButton.classList.add('toggle-password-signup');
            toggleButton.addEventListener('click', () => {
                input.type = input.type === 'password' ? 'text' : 'password';
                toggleButton.textContent = input.type === 'password' ? '👁️' : '🙈';
            });
            input.parentNode.insertBefore(toggleButton, input.nextSibling);

            // Adiciona botão para o campo de confirmar senha
            if (input.placeholder === 'Senha') {
                const confirmToggleButton = document.createElement('button');
                confirmToggleButton.type = 'button';
                confirmToggleButton.textContent = '👁️';
                confirmToggleButton.classList.add('toggle-password-confirm');
                confirmToggleButton.addEventListener('click', () => {
                    input.type = input.type === 'password' ? 'text' : 'password';
                    confirmToggleButton.textContent = input.type === 'password' ? '👁️' : '🙈';
                });
                input.parentNode.insertBefore(confirmToggleButton, input.nextSibling);
            }
        }
    });
    
        

    // Atualiza a lista de logins ativos dinamicamente ao detectar mudanças no localStorage
    window.addEventListener('storage', (event) => {
        if (event.key === 'loginsAtivos') {
            const loginsAtivos = JSON.parse(sessionStorage.getItem('loginsAtivos')) || [];
            const loginButton = document.getElementById('login-button');
            loginButton.textContent = loginsAtivos.map(login => login.usuario).join(', ') || 'Login';
        }
    });
});