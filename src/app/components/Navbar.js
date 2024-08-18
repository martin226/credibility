export default function Navbar() {
  return (
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
  );
}
