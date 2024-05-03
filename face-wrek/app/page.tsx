import Image from "next/image";

// Components
import Disclaimer from "./(Disclaimer)/Disclaimer";
import NavBar from "./(NavBar)/NavBar";

export default function Home() {
  return (
    <>
      <div className="text-left w-screen">
        <NavBar />
      </div>
      <div>
        <Disclaimer />
      </div>
    </>
  );
}
