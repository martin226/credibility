import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export default function Results({ results }) {
  let credibilityColor = 'text-blue-600';
  if (results.credibility_score < 50) {
    credibilityColor = 'text-red-600';
  } else if (results.credibility_score < 75) {
    credibilityColor = 'text-yellow-600';
  }
  let credibility = 'Credible';
  if (results.credibility_score < 50) {
    credibility = 'Not Credible';
  } else if (results.credibility_score < 75) {
    credibility = 'Somewhat Credible';
  }
  const sentimentMap = {
    '-1': 'Negative 🚩',
    0: 'Neutral ✅',
    1: 'Positive 🚩',
  };

  const resultsRef = useRef(null);

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const [showBiasModal, setShowBiasModal] = useState(false);
  const [showSentimentModal, setShowSentimentModal] = useState(false);
  const [showPublisherModal, setShowPublisherModal] = useState(false);

  return (
    <div className="flex flex-col min-h-screen" ref={resultsRef}>
      <div className="bg-[#196CCE] px-16 py-16 mb-8">
        <h2 className="text-4xl font-semibold text-white">
          Credibility Report for{' '}
          <a
            className="font-light underline "
            href="https://www.livescience.com/archaeology/romans/pompeii-victims-died-in-extreme-agony-2-newfound-skeletons-reveal"
          >
            {results.domain}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 inline ml-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </h2>
      </div>
      <div className="flex px-16">
        <div className="flex flex-col shadow-lg rounded-lg px-8 py-4 items-center">
          <div className="relative size-40 bg-white">
            <svg
              className="rotate-[135deg] size-full"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-gray-200"
                strokeWidth="1.5"
                strokeDasharray="75 100"
                strokeLinecap="round"
              ></circle>

              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`stroke-current ${credibilityColor}`}
                strokeWidth="1.5"
                strokeDasharray={`${(results.credibility_score / 100) * 75} 100`}
                strokeLinecap="round"
              ></circle>
            </svg>

            <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className={`text-4xl font-bold ${credibilityColor}`}>
                {results.credibility_score}
              </span>
              <span className={`${credibilityColor} block`}>Credibility Score</span>
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${credibilityColor} text-center`}>{credibility}</h3>
        </div>
        <div className="flex flex-col justify-center shadow-lg rounded-lg px-8 py-4 text-xl text-gray-600">
          <h3 className={`text-2xl font-bold ${credibilityColor}`}>Comments</h3>
          <ul className="list-inside list-disc">
            <li>{results.gpt_data.content_credibility_justification}</li>
            <li>{results.gpt_data.screenshot_notes}</li>
            <li>{results.gpt_data.additional_notes}</li>
          </ul>
        </div>
      </div>
      <div className="flex px-16"></div>
      <div className="flex px-16">
        <div className="flex flex-col shadow-lg rounded-lg p-8 relative w-3/4 gap-4">
          <h3 className={`text-2xl font-bold ${credibilityColor}`}>What We Saw</h3>
          <Image
            src={`data:image/png;base64,${results.screenshot}`}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col shadow-lg rounded-lg p-8 gap-4">
            <h3 className={`text-2xl font-bold ${credibilityColor}`}>
              Bias
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 inline ml-1 cursor-pointer"
                onClick={() => setShowBiasModal(true)}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </h3>
            <p>{results.gpt_data.bias ? 'Yes 🚩' : 'No Bias Detected ✅'}</p>
            {showBiasModal && (
              <Modal onClose={() => setShowBiasModal(false)}>
                <p>{results.gpt_data.bias_justification}</p>
              </Modal>
            )}
          </div>
          <div className="flex flex-col shadow-lg rounded-lg p-8 gap-4">
            <h3 className={`text-2xl font-bold ${credibilityColor}`}>
              Sentiment
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 inline ml-1 cursor-pointer"
                onClick={() => setShowSentimentModal(true)}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </h3>
            <p>{sentimentMap[results.gpt_data.sentiment]}</p>
            {showSentimentModal && (
              <Modal onClose={() => setShowSentimentModal(false)}>
                <p>{results.gpt_data.sentiment_justification}</p>
              </Modal>
            )}
          </div>
          <div className="flex flex-col shadow-lg rounded-lg p-8 gap-4">
            <h3 className={`text-2xl font-bold ${credibilityColor}`}>
              Publisher Reputation
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 inline ml-1 cursor-pointer"
                onClick={() => setShowPublisherModal(true)}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </h3>
            <p>{results.gpt_data.publisher_reputation ? 'Reputable ✅' : 'Not Reputable 🚩'}</p>
            {showPublisherModal && (
              <Modal onClose={() => setShowPublisherModal(false)}>
                <p>{results.gpt_data.publisher_reputation_justification}</p>
              </Modal>
            )}
          </div>
          <div className="flex-1 flex flex-col shadow-lg rounded-lg p-8 text-xl text-gray-600 gap-4">
            <h3 className={`text-2xl font-bold ${credibilityColor}`}>Other Credibility Metrics</h3>
            <p>
              <span className="font-bold">Domain Age: </span>
              {results.domain_age} years
            </p>
            <p>
              <span className="font-bold">Traffic Rank: </span>
              {results.tranco_rank == -1 ? 'N/A' : `#${results.tranco_rank}/1,000,000`}
            </p>
            <p>
              <span className="font-bold">Author Listed: </span>
              {results.metadata.author ? `Yes (${results.metadata.author})` : 'No'}
            </p>
            <p>
              <span className="font-bold">Date Listed: </span>
              {results.metadata.date ? `Yes (${formatDate(results.metadata.date)})` : 'No'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
