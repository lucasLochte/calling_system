
import { useState, useContext } from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';

export default function SignUp(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {signUp, loadingAuth} = useContext(AuthContext);

    async function handleSignUp(event){
        event.preventDefault();

        if (email!== '' && password!== '' && name !== ''){
             await signUp(email, password, name)
        }   
    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do sistema de chamados" />
                </div>

                <form onSubmit={handleSignUp}>
                    <h1>Nova conta</h1>
                    <input
                        type="text" 
                        placeholder="Seu nome" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />

                    <input
                        type="text" 
                        placeholder="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />

                    <input
                        type="password" 
                        placeholder="******" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    <button type="submit">
                        {loadingAuth ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <Link to="/">Já possui uma conta? Faça login</Link>
            </div>
        </div>
    )
}