export default function UploadForm() {
  return (
    <>
      <div className="flex w-screen justify-around">
        <div className="flex flex-col h-full justify-between">
          <div className="flex">photo of your face</div>
          <div className="flex">photo of your ID Card / Passport Document</div>
          <div className="flex">
            <button className="bg-blue-500 hover:bg-blue-700">Verify</button>
          </div>
        </div>
      </div>
    </>
  );
}
