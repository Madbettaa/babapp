import Axios from 'axios'
import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import { API_HOST  } from '../../utils/constant';

const Add = () => {

    const [cin, setcin] = useState('')
    const [name, setName] = useState('')
    const [phone, setphone] = useState('')
    const [terrain, setTerrain] = useState('')
    const [tprice, setprice] = useState('')
    const [lotC, setlotC] = useState('')
    // const [excelFile, setExcelFile] = useState<File | null>(null);
    const nav = useNavigate(); 

    function handleSubmit(e:any){
        e.preventDefault();
        // if (excelFile) {
        //     const formData = new FormData();
        //     formData.append('file', excelFile);

        //     Axios.post('http://localhost:3366/upload', formData)
        //         .then((response) => {
        //             console.log(response.data);
        //             nav('/');
        //         })
        //         .catch((error) => {
        //             console.error('Error uploading file:', error);
        //         });
        // }
        Axios.post(`${API_HOST}/add`, {cin,name,terrain,phone,tprice,lotC})
        .then(res => {
            nav('/');
            console.log(res);
        }).catch(err =>console.log(err))
    }
  return (
        <main className='left-[21%] top-[25%] relative w-[70%] h-[100%]'>
        <div className='absolute w-[80%] h-[100%]'>
            <div className='d-flex vh-100 bg-[#555555] justify-content-center align-items-center  drop-shadow-2xl shadow-[#777777] rounded-lg'>
            <div className='w-50 bg-white rounded p-4'>
                <h1 className='text-center text-roboto mb-4'>Ajouter une nouvelle personne</h1>
                <form className='flex flex-col items-center space-y-4'>
                <div className='flex flex-col items-start w-full mb-4'>
                    <label htmlFor='cin' className='text-sm mb-1'>CIN</label>
                    <input
                    type='text'
                    id='cin'
                    placeholder='Enter CIN'
                    className='border p-2 w-full'
                    onChange={(e) => setcin(e.target.value)}
                    />
                </div>
                <div className='flex flex-col items-start w-full mb-4'>
                    <label htmlFor='name' className='text-sm mb-1'>Nom et prénom</label>
                    <input
                    type='text'
                    id='name'
                    placeholder='Entrer Nom'
                    className='border p-2 w-full'
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='flex flex-col items-start w-full mb-4'>
                    <label htmlFor='phone' className='text-sm mb-1'>Numéro de téléphone</label>
                    <input
                    type='text'
                    id='phone'
                    placeholder='Entrer Numéro de téléphone'
                    className='border p-2 w-full'
                    onChange={(e) => setphone(e.target.value)}
                    />
                </div>
                <div className='flex flex-col items-start w-full mb-4'>
                    <label htmlFor='terrain' className='text-sm mb-1'>Terrain</label>
                    <input
                    type='text'
                    id='terrain'
                    placeholder='Enter Terrain'
                    className='border p-2 w-full'
                    onChange={(e) => setTerrain(e.target.value)}
                    />
                </div>
                <div className='flex flex-col items-start w-full mb-4'>
                    <label htmlFor='lotC' className='text-sm mb-1'>lot Commercial</label>
                    <input
                    type='text'
                    id='lotC'
                    placeholder='Enter Lot Commercial'
                    className='border p-2 w-full'
                    onChange={(e) => setlotC(e.target.value)}
                    />
                </div>
                <div className='flex flex-col items-start w-full mb-4'>
                    <label htmlFor='tprice' className='text-sm mb-1'>Prix ​du terrain</label>
                    <input
                    type='text'
                    id='tprice'
                    placeholder='Enter Prix ​​du terrain'
                    className='border p-2 w-full'
                    onChange={(e) => setprice(e.target.value)}
                    />
                </div>
                {/* <div className='flex flex-col items-start w-full mb-4'>
                                <label htmlFor='excelFile' className='text-sm mb-1'>Upload Excel File</label>
                                <input
                                    type='file'
                                    id='excelFile'
                                    className='border p-2 w-full'
                                    accept='.xlsx,.xls'
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setExcelFile(file);
                                        }
                                    }}
                                />
                </div> */}
                <button onClick={handleSubmit} className='btn btn-success w-full'>Submit</button>
                </form>
            </div>
            </div>
        </div>
        </main>

  )
}

export default Add