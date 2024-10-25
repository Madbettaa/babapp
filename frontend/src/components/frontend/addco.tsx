import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_HOST  } from '../../utils/constant';
const AddContribution = () => {
    const { personId } = useParams();
    const [contributionDate, setContributionDate] = useState('');
    const [contributionAmount, setContributionAmount] = useState('');
    const navigate = useNavigate();

    function handleSubmit() {
        Axios.post(`${API_HOST}/contributions/add/${personId}`, {
            person_id: personId, 
            contribution_date: contributionDate,
            contribution_amount: contributionAmount
        })
        .then(res => {
            navigate('/');
            console.log(res);
        })
        .catch(err => console.log(err));
    }

    return (
        <main className='relative w-[70%] h-screen overflow-y-auto left-[21%] top-[25%]'>
            <div className='relative w-[80%] h-full mx-auto py-10'>
                <div className='flex min-h-screen justify-center items-center bg-[#555555] drop-shadow-2xl shadow-[#777777] rounded-lg p-4'>
                    <div className='w-full max-w-md bg-white rounded p-4'>
                        <h1 className='text-center font-roboto mb-4'>Ajouter une nouvelle contribution</h1>
                        <form className='flex flex-col items-center space-y-4'>
                            <div className='flex flex-col items-start w-full mb-4'>
                                <label htmlFor='contributionDate' className='text-sm mb-1'>Date de cotisation</label>
                                <input
                                    type='date'
                                    id='contributionDate'
                                    className='border p-2 w-full'
                                    onChange={(e) => setContributionDate(e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col items-start w-full mb-4'>
                                <label htmlFor='contributionAmount' className='text-sm mb-1'>Montant de la cotisation</label>
                                <input
                                    type='text'
                                    id='contributionAmount'
                                    placeholder='Enter le montant de la cotisation'
                                    className='border p-2 w-full'
                                    onChange={(e) => setContributionAmount(e.target.value)}
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

export default AddContribution;
