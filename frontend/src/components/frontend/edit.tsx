
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';

const Edit = () => {
  const { id } = useParams();
  const [cin, setcin] = useState('');
  const [name, setName] = useState('');
  const [phone, setphone] = useState('');
  const [terrain, setTerrain] = useState('');
  const nav = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    Axios.put(`http://31.220.78.64:3366/edit/${id}`, { cin, name, terrain , phone})
      .then(res => {
        console.log(res);
        nav('/');
      })
      .catch(err => console.log(err));
  };

  return (
            <main className='left-[21%] top-[25%] relative w-[70%] h-[100%]'>
            <div className='absolute w-[80%] h-[100%]'>
                <div className='d-flex vh-100 bg-[#555555] justify-content-center align-items-center  drop-shadow-2xl shadow-[#777777] rounded-lg'>
                <div className='w-50 bg-white rounded p-4'>
                    <h1 className='text-center text-roboto mb-4'>Edit Person</h1>
                    <form className='flex flex-col items-center space-y-4'>
                    <div className='flex flex-col items-start w-full mb-4'>
                        <label htmlFor='cin' className='text-sm mb-1'>CIN</label>
                        <input
                        type='text'
                        id='cin'
                        placeholder='Enter new CIN'
                        className='border p-2 w-full'
                        onChange={(e) => setcin(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col items-start w-full mb-4'>
                        <label htmlFor='name' className='text-sm mb-1'>Name</label>
                        <input
                        type='text'
                        id='name'
                        placeholder='Enter new Name'
                        className='border p-2 w-full'
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col items-start w-full mb-4'>
                        <label htmlFor='phone' className='text-sm mb-1'>Phone</label>
                        <input
                        type='text'
                        id='phone'
                        placeholder='Enter new Phone'
                        className='border p-2 w-full'
                        onChange={(e) => setphone(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col items-start w-full mb-4'>
                        <label htmlFor='terrain' className='text-sm mb-1'>Terrain</label>
                        <input
                        type='text'
                        id='terrain'
                        placeholder='Enter new Terrain'
                        className='border p-2 w-full'
                        onChange={(e) => setTerrain(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSubmit} className='btn btn-success w-full'>Submit</button>
                    </form>
                </div>
                </div>
            </div>
            </main>
    
  );
};

export default Edit;
