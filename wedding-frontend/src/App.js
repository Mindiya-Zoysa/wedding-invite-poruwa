import React, { useState } from 'react';
import HeartCover from './components/HeartCover';
import Envelope from './components/Envelope';
import MainPage from './components/MainPage';
import Dashboard from './components/Dashboard';
// We removed the DigitalProgram import here!

function App() {
  const [step, setStep] = useState('heart');

  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin') === 'true';

  if (isAdmin) {
    return <Dashboard />;
  }

  return (
    <div className="App">
      {step === 'heart' && <HeartCover onFinish={() => setStep('envelope')} />}
      {step === 'envelope' && <Envelope onComplete={() => setStep('main')} />}
      {step === 'main' && <MainPage />} 
    </div>
  );
}

export default App;
