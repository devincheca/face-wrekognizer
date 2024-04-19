// Components
import NavBar from "../(NavBar)/NavBar";
import UploadForm from "../(UploadForm)/UploadForm";

export default function Home() {
  return (
    <>
      <div className="text-left w-screen">
        <NavBar />
      </div>
      <div>
        <UploadForm />
      </div>
    </>
  );
}
