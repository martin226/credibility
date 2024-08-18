import Image from 'next/image';
import Search from './search.svg';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex flex-row justify-between py-8 px-12">
        <h1 className="text-4xl bg-gradient-to-r from-[#196CCE] to-[#103783] text-transparent bg-clip-text font-extrabold">
          Credibility
        </h1>
        <ul className="flex flex-row gap-4 text-[#767676] text-2xl">
          <li>
            <a href="#">About</a>
          </li>
        </ul>
      </nav>
      <main className="flex flex-1 flex-col items-center justify-center p-24 gap-14">
        <h1 className="font-extrabold text-6xl leading-6 text-center text-[#2D3748]">
          Research with{' '}
          <span className="bg-gradient-to-r from-[#196CCE] to-[#103783] text-transparent bg-clip-text">
            Credibility
          </span>
          .
        </h1>
        <p className="text-3xl font-semibold text-[#666666]">
          Stop using untrustworthy sources. Research with confidence using Credibility.
        </p>
        <div class="relative flex h-12 w-full min-w-[200px] max-w-[64rem]">
          <Image
            src={Search}
            alt="Search"
            width={24}
            height={24}
            layout="fixed"
            className="absolute left-2 top-3"
          />
          <button
            class="!absolute right-2 top-2 z-10 select-none rounded bg-[#196CCE] py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
            data-ripple-light="true"
          >
            Analyze
          </button>
          <input
            type="url"
            name="url"
            id="url"
            class="h-full w-full rounded-lg border border-[#bbb] bg-transparent pl-10 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            required
            placeholder="Enter URL to analyze"
          />
        </div>
      </main>
    </div>
  );
}
