import { useState } from 'react';

function Login() {
    // useState pra armazenar e escrever os campos de usuario e login
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    // função pra verificar condições
    function handleLogin() {
        console.log("Usuario: ", usuario);
        console.log("Senha", senha);
    }

    return (
        // tela do login
        <div>
            <h2 className="task-title">LOGIN</h2>
            {/* campo de usuário */}
            <input
                type='text'
                placeholder='Nome de usuário *'
                onChange={(e) => setUsuario(e.target.value)}
            />
            {/* campo de senha */}
            <input 
                type='password'
                placeholder='Senha *'
                onChange={(e) => setSenha(e.target.value)} 
            />
            {/* botão de entrar */}
            <button onClick={handleLogin}>Entrar</button>
        </div>
    );
}

export default Login;