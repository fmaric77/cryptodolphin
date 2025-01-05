"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => (
  <header className="flex justify-between items-center mb-12">
    <Image
      className="dark:invert"
      src="/c96.png"
      alt="Crypto Dashboard"
      width={180}
      height={38}
      priority
    />
    <h1 className="text-3xl font-bold">CryptoDolphin™</h1>
  </header>
);

const SearchInput = ({ search, setSearch }) => (
  <div className="mb-8">
    <input
      type="text"
      placeholder="Search for a cryptocurrency..."
      className="w-full p-4 rounded-lg bg-gray-800 text-white"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
);

const CryptoCard = ({ crypto, onClick }) => (
  <div
    key={crypto.id}
    className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer w-full"
    style={{ height: 'auto' }}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
          alt={crypto.name}
          width={32}
          height={32}
          className="mr-4"
        />
        <h2 className="text-xl font-semibold">
          {crypto.name} ({crypto.symbol.toUpperCase()})
        </h2>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold">
          ${parseFloat(crypto.priceUsd).toLocaleString()}
        </p>
        <p
          className={`text-sm ${
            parseFloat(crypto.changePercent24Hr) >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
        </p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://api.coincap.io/v2/assets")
      .then((response) => {
        setCryptos(response.data.data);
        setFilteredCryptos(response.data.data);
      });
  }, []);

  useEffect(() => {
    setFilteredCryptos(
      cryptos.filter((crypto) =>
        crypto.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, cryptos]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 sm:p-20">
      <Header />
      <SearchInput search={search} setSearch={setSearch} />
      <main className="grid grid-cols-1 gap-8">
        {filteredCryptos.map((crypto) => (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            onClick={() => router.push(`/crypto/${crypto.id}`)}
          />
        ))}
      </main>
      <footer className="mt-12 flex gap-6 flex-wrap items-center justify-center">
        <p>&copy; {new Date().getFullYear()} CryptoDolphin™. All rights reserved.</p>
      </footer>
    </div>
  );
}