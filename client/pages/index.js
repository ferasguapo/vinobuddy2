import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function Home() {
  const [vin, setVin] = useState("");
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  const startCamera = () => {
    codeReader.current = new BrowserMultiFormatReader();
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          setVin(result.getText());
          stopCamera();
        }
      });
    });
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (codeReader.current) codeReader.current.reset();
  };

  const submitVin = async () => {
    if (!vin) return;
    try {
      const vinResp = await fetch('/api/vininfo', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ vin })});
      const vinData = await vinResp.json();
      const aiResp = await fetch('/api/ai', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ vin, data: vinData })});
      const aiData = await aiResp.json();
      setResult({ vinData, aiData });
    } catch(e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">VinOBuddy</h1>
      <input type="text" placeholder="Enter VIN" value={vin} onChange={e=>setVin(e.target.value)} className="p-2 rounded bg-gray-800 text-green-400 mb-2 w-full max-w-md"/>
      <button onClick={startCamera} className="bg-green-700 px-4 py-2 rounded m-1">Scan VIN</button>
      <button onClick={submitVin} className="bg-green-700 px-4 py-2 rounded m-1">Submit</button>
      <video ref={videoRef} className="w-80 h-40 my-2 border border-green-500"></video>
      {result && <div className="bg-gray-800 p-4 rounded w-full max-w-md mt-4">
        <h2 className="font-bold mb-2">AI Summary:</h2>
        <pre className="whitespace-pre-wrap">{result.aiData.summary}</pre>
      </div>}
      <footer className="mt-auto text-sm">Made by Feras</footer>
    </div>
  );
}
