import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ScratchCard from 'react-scratchcard-v2';
import axios from 'axios';

const App = () => {
  const { id } = useParams();
  const [step, setStep] = useState('loading');
  const [feedback, setFeedback] = useState('');
  const [reward, setReward] = useState(null);

  useEffect(() => {
    axios.get(`/api/verify/${id}`).then(res => {
      if (res.data.valid) setStep('form');
      else setStep('used');
    });
  }, [id]);

  const handleSubmit = async () => {
    const res = await axios.post(`/api/submit/${id}`, { feedback });
    setReward(res.data.reward);
    setStep('scratch');
  };

  const settings = {
    width: 300,
    height: 300,
    image: '/scratch-overlay.png',
    finishPercent: 50,
    onComplete: () => alert(`You won ₹${reward}!`)
  };

  if (step === 'loading') return <div className="text-center mt-10">Loading...</div>;
  if (step === 'used') return <div className="text-center mt-10 text-red-500">This link has already been used.</div>;
  if (step === 'form') {
    return (
      <div className="max-w-md mx-auto p-4 mt-10">
        <h2 className="text-xl mb-4">Give us your feedback</h2>
        <textarea
          className="w-full p-2 border rounded"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit & Scratch
        </button>
      </div>
    );
  }

  if (step === 'scratch') {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl mb-4">Scratch to reveal your cashback!</h2>
        <ScratchCard {...settings}>
          <div className="flex items-center justify-center w-full h-full bg-yellow-100">
            <span className="text-2xl font-bold">₹{reward}</span>
          </div>
        </ScratchCard>
      </div>
    );
  }
};

export default App;
