import React, { useEffect, useState } from 'react';
import '../../index.css';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiAccountEditOutline } from '@mdi/js';
import { mdiDeleteForever } from '@mdi/js';
import { mdiPlusCircle } from '@mdi/js';
import { mdiArrowRightBoldCircle } from '@mdi/js';
import { mdiArrowLeftBoldCircle } from '@mdi/js';
import Pdfprinter from '../../utils/pdfprinter';

interface Person {
  id: number;
  name: string;
  CIN: string;
  phone: string;
  terrain: number;
  tprice: string;
  lotC: number;
}


interface Contribution {
  id: number;
  person_id: number;
  contribution_date: string;
  contribution_amount: number;
}

const formatDate = (isoDateString: string) => {
  const dateObject = new Date(isoDateString);
  return dateObject.toLocaleDateString();
};

const Home = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [popDetails, setpopDetails] = useState(false)
  const [isshowed, setisshowed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);

  useEffect(() => {
    Axios.get<Person[]>('http://31.220.78.64:5000/')
      .then((res) => setPersons(res.data))
      .catch((err) => console.log(err));
  }, []);

  const hdelete = async (id: any) => {
    try {
      await Axios.delete(`http://31.220.78.64:5000/d/${id}`);
      setPersons(prevPersons => prevPersons.filter(person => person.id !== id));
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };
  
  
  const showDetails = (person: Person) => {
    setSelectedPerson(person);
    setpopDetails((prevValue) => !prevValue);
    setisshowed((prevValue) => !prevValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = persons.filter((person) =>
      person.name.toLowerCase().includes(query) ||
      person.terrain.toString().includes(query) ||
      person.CIN.includes(query) 
    );
    setFilteredPersons(filtered);
  };


  const Details = () => {
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [reste, setReste] = useState(0);
    useEffect(() => {
      if (selectedPerson && selectedPerson.tprice) {
        const tpriceNumber = parseFloat(selectedPerson.tprice);
        const totalContributions = contributions.reduce((total, contribution) => {
          return contribution.person_id === selectedPerson.id ? total + contribution.contribution_amount : total;
        }, 0);
        const remainingAmount = tpriceNumber - totalContributions;
        setReste(remainingAmount);
      }
    }, [selectedPerson, contributions]);
    
  
    useEffect(() => {
      if (selectedPerson) {
        Axios.get(`http://31.220.78.64:5000/contributions/${selectedPerson.id}`)
          .then(response => {
            setContributions(response.data);
          })
          .catch(error => {
            console.error('Error fetching contributions:', error);
          });
      }
    }, [selectedPerson]);
  
    return (
      <main className='absolute top-[10vh] left-[102vh] w-[20vh] h-[78vh] bg-white drop-shadow-2xl shadow-[#777777] rounded-lg'>
            <div className='p-2 overflow-y-auto'>
        <div className='absolute top-[2vh] left-[0.5vh] relative justify-items-start grid w-[100%]'>
          <div className='font-bold'>Name:</div>
          <div className='flex justify-center items-center border-box w-[156px] h-[35px] bg-[white] mt-[5px] pt-0.5 rounded-lg drop-shadow-xl'>{selectedPerson?.name}</div>
          <div className='font-bold'>CIN:</div>
          <div className='flex justify-center items-center border-box w-[156px] h-[35px] bg-[white] mt-[5px] pt-0.5 rounded-lg drop-shadow-xl'>{selectedPerson?.CIN}</div>
          <div className='font-bold'>Phone:</div>
          <div className='flex justify-center items-center border-box w-[156px] h-[35px] bg-[white] mt-[5px] pt-0.5 rounded-lg drop-shadow-xl'>{selectedPerson?.phone}</div>
          <div className='font-bold'>Terrain:</div>
          <div className='flex justify-center items-center border-box w-[156px] h-[35px] bg-[white] mt-[5px] pt-0.5 rounded-lg drop-shadow-xl'>{selectedPerson?.terrain}</div>
          <div className='font-bold'>Terrain Price:</div>
          <div className='flex justify-center items-center border-box w-[156px] h-[35px] bg-[white] mt-[5px] pt-0.5 rounded-lg drop-shadow-xl'>{selectedPerson?.tprice}</div>
          <div className='font-bold'>Lot Commercial:</div>
          <div className='flex justify-center items-center border-box w-[156px] h-[35px] bg-[white] mt-[5px] pt-0.5 rounded-lg drop-shadow-xl'>{selectedPerson?.lotC}</div>
          <div className='font-bold'>Contributions:</div>
          <ul>
            {contributions.map(contribution => (
              <li key={contribution.id}>
                <div className='flex justify-center items-center space-x-5 p-1 border-box w-[156px] h-[35px] bg-[white] mt-2 p-1 rounded-lg drop-shadow-2xl'>
                  <h3 className='text-black font-bold text-sm'>{contribution.contribution_amount}</h3>
                  <p className='text-xs'>{formatDate(contribution.contribution_date)}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to={`/addco/${selectedPerson?.id}`} className='relative btn w-[1px] left-[35%] top-[10%]'>
              <Icon path={mdiPlusCircle} size={1} />
          </Link>
          <div className='font-bold'>Le reste:</div>
          <div className='flex justify-center items-center border-box w-[156px] h-[35px] bg-[white] mt-[5px] pt-0.5 rounded-lg drop-shadow-xl'>{reste}</div>

        </div>
        </div>
      </main>
    );
  };

  return (
    <div className='h-screen flex justify-center items-center'>
    <main className='absolute left-[21%] w-[65%] h-[100%]'>
      <div className='absolute w-[100%] left-[4vh] h-[80%] top-[10vh]'>
        <section className='absolute w-[80%] h-[80%] bg-white drop-shadow-2xl shadow-[#777777] rounded-lg'>
          <div className='relative place-items-center grid w-[100%]'>
            <h1 className='text-lg font-bold'>ALJAWHARA Adherents</h1>

            <div className='flex justify-center items-center space-x-12 p-1'>
              <div className='relative right-[13vh]'>CIN</div>
              <div className='relative right-[8vh]'>NAME</div>
              <div className='relative right-[3vh]'>PHONE</div>
              <div className='relative right-[3vh]'>TERRAIN</div>
            </div>
          </div>
          <div className='relative w-auto h-[80%] overflow-y-auto'>
            <ul className='person-list'>
            {(filteredPersons.length > 0 ? filteredPersons : persons).map((data) => (
                <li className='flex justify-center items-center space-x-12 border p-1' key={data.id}>

                  <div className=''>{data.CIN}</div>
                  <div>{data.name}</div>
                  <div>{data.phone}</div>
                  <div>{data.terrain}</div>
                  <div className=''>
                    <Link to={`/edit/${data.id}`} className=''>
                      <Icon path={mdiAccountEditOutline} size={1} />
                    </Link>
                  </div>
                  <button type="button" onClick={() => hdelete(data.id)}>
                    <Icon path={mdiDeleteForever} size={1} />
                  </button>
                  <button type="button" onClick={() => showDetails(data)}>
                    {!isshowed ? (
                      <Icon path={mdiArrowRightBoldCircle} size={1} />
                    ) : (
                      <Icon path={mdiArrowLeftBoldCircle} size={1} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='relative h-[10vh] w-[98%]'>
          <input
              type='text'
              id='cin'
              placeholder='Search for ppl'
              value={searchQuery}
              onChange={handleSearchChange} 
              className='relative left-[2vh]  w-full w-[15vh] border-none outline-none'
            />
            <Link to='/add' className='relative btn w-[1px] left-[50%] bottom-[3vh]'>
              <Icon path={mdiPlusCircle} size={1} />
            </Link>
            <Pdfprinter filteredPersons={filteredPersons} persons={persons} />
          </div>
            <p className='relative top-[20vh] left-[40%] text-[1vh] text-[#999999]'>Powered By Mohamed kheir Aouss, Inc. 2024</p>
          <div>
          </div>
        </section>
      </div>
      
      {popDetails && selectedPerson && <Details />}
    </main>
    </div>
  );
};

export default Home;
