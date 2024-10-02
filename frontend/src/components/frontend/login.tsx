import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void; // Define the type for onLogin prop
}

const Login: React.FC<LoginProps> = ({ onLogin }) => { // Receive onLogin as a prop

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        const response = await axios.post(`http://31.220.78.64:3366/login`, { password });
        localStorage.setItem('token', response.data.token);
        onLogin(); // Call the onLogin function upon successful login
        navigate('/');
        console.log('Login successful');
      } catch (error) {
        setError('Invalid password');
      }
    };

  return (
    <div className='h-screen flex justify-center items-center'>
       <div className='absolute left-[33%]'>
        <main className='flex bg-white w-[60vh] h-[30vh] drop-shadow-2xl shadow-[#777777] rounded-lg justify-center'>
            <h2 className='absolute top-[5%] font-bold'>ALJAWHARA Adherents</h2>
            <h1 className='absolute top-[20%] text-2xl font-extrabold'>Admin Login</h1>
            <div>
                <input
                    type="password"
                    id="password"
                    placeholder='Password'
                    value={password}
                    className='relative left-[10vh] top-[40%] w-[40vh] rounded-md px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-gray-500 focus:z-10 sm:text-sm'
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleLogin} className='relative right-[33%] top-[65%] w-[40vh] h-[4vh] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-10'>Login</button>
        </main>
            {error && <div className='relative bottom-[13vh] left-[11vh] w-[40vh] text-gray-500 text-xs'>{error}</div>}
       <p className='relative top-[34vh] left-[35%] text-[1vh] text-[#999999]'>Powered By Mohamed kheir Aouss, Inc. 2024</p>
       </div>
    </div>
  );
};

export default Login;
