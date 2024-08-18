'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Results from './components/Results';
import Loading from './components/Loading';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = (url) => {
    setResults(null);
    setLoading(true);
    axios.get(`/api/analyze?url=${url}`).then((res) => {
      setResults(res.data);
      setLoading(false);
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <Hero onAnalyze={handleAnalyze} />
          </div>
          {results && <Results results={results} />}
        </div>
      )}
    </>
  );
}
