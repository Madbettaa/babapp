import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddContribution = () => {
    const { personId } = useParams();
    const [contributionDate, setContributionDate] = useState('');
    const [contributionAmount, setContributionAmount] = useState('');
    const navigate = useNavigate();

    function handleSubmit() {
        Axios.post(`http://31.220.78.64:3366/contributions/add/${personId}`, {
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
        <main className='left-[21%] top-[25%] relative w-[70%] h-[100%]'>
            <div className='absolute w-[80%] h-[100%]'>
                <div className='d-flex vh-100 bg-[#555555] justify-content-center align-items-center drop-shadow-2xl shadow-[#777777] rounded-lg'>
                    <div className='w-50 bg-white rounded p-4'>
                        <h1 className='text-center text-roboto mb-4'>Add New Contribution</h1>
                        <form className='flex flex-col items-center space-y-4'>
                            <div className='flex flex-col items-start w-full mb-4'>
                                <label htmlFor='contributionDate' className='text-sm mb-1'>Contribution Date</label>
                                <input
                                    type='date'
                                    id='contributionDate'
                                    className='border p-2 w-full'
                                    onChange={(e) => setContributionDate(e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col items-start w-full mb-4'>
                                <label htmlFor='contributionAmount' className='text-sm mb-1'>Contribution Amount</label>
                                <input
                                    type='text'
                                    id='contributionAmount'
                                    placeholder='Enter Contribution Amount'
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
