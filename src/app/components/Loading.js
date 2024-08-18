import { useEffect, useState } from 'react';

export default function Loading() {
  const actions = [
    'Analyzing...',
    'Visiting the source...',
    'Reading page content...',
    'Taking screenshots...',
    'Running AI models...',
    'Checking for credibility...',
    'Joining the dots...',
  ];
  const [currentAction, setCurrentAction] = useState(actions[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % actions.length;
        setCurrentAction(actions[nextIndex]);
        return nextIndex;
      });
    }, Math.random() * (2500 - 1500) + 1500); // Random interval between 1.5 and 2.5 seconds

    return () => clearInterval(interval);
  }, [actions]);
  return (
    <div className="bg-[#103783] min-h-screen flex flex-col justify-center items-center">
      <svg
        className="animate-spin h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.003 8.003 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="text-white text-2xl mt-4">{currentAction}</p>
    </div>
  );
}
