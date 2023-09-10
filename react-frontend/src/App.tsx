import { useRef, useState } from "react";
import JSEncrypt from "jsencrypt";

function App() {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  type Result = {
    message?: string;
    data?: {
      encrypted: string;
      decrypted: object;
    };
  };
  const [result, setResult] = useState<Result>({});

  // Encrypt request data
  const encryptRequestData = (data: string) => {
    let KEY = `-----BEGIN PUBLIC KEY-----
    MIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgBoLTFCc40LxJcidVs6/WFw
    siYOCaEqu2DCHne0fcFDfYe2Sd22+7S+4cDFP7akAInAI/eKVMq97kAl5Y5NKAou
    VB/CIEsqJdtnQavhcGhvBp3mUB7HtbEnGHwLVS85ZOIzeSyePFUoOWDGlMLmL9k4
    ntT2cDpEe996L/uEOqFxAY6Lku9SmIJgQxjD+xhRpDaW2LzcHYBW38780hFtN/D4
    95OEQdgCalAxGWyNCqiA5ZSEusDo33L9rrHJ0KFfZTNA70SdfTlkjslrQljVnYyB
    qxS3FV2OFz6AUjTvfLGvARzn04NeyCssC+9cq0NUpe1MBEcxn7Evu5Ultw/+bCu7
    iK753fdnfDCcnE84mL+MfN8f1uTKFpobKq9gSn+p7g/6n/FMuyNJgoMGn4iKZoMf
    JxMho14i/pGsxZIvlws9vVRlF/1orjpFmHUEbiQGKWb6JXosZRIP5xZe9n5eM9th
    wXQfVkLO3HcufREeCck7pPhBzpl9Aiwntagj8tgvMG/TBAt0UZFrMkxxsKzMGt8c
    fapQue9ZhbXpWQ/KNq/aq9XdHTeJomWXS48GS7Y7QWSLnQtJ/IkpWsQal+90eZA/
    eJcM6Kv450DGlEjGt9qRmnYvo7S+cegAbz9ctHSxiog/nKxK5HOJKShg5tDHoXxG
    Z+GmC+icMM/wiTbs29wlXQIDAQAB
    -----END PUBLIC KEY-----`;
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(KEY);
    return encryptor.encrypt(data);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setResult({});
      if (!nameRef.current?.value || !phoneRef.current?.value) {
        return;
      }
      let data = JSON.stringify({
        name: nameRef.current.value,
        phone: phoneRef.current.value,
      });
      let encrypted_data = encryptRequestData(data);
      let requestBody = JSON.stringify({
        encrypted: encrypted_data,
      });

      const response = await fetch("http://127.0.0.1:8000/api/decrypt-data", {
        method: "POST",
        body: requestBody,
        headers: {
          "Content-Type": "application/json",
        },
      });
      let res = await response.json();
      setResult(res);
    } catch (err) {
      alert(String(err));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>
        Simple form to demonstration Rsa Encryption between a react and laravel
        application
      </h2>
      <label htmlFor="name">Name</label>
      <br />
      <input type="text" name="name" id="name" ref={nameRef} />
      <br />

      <label htmlFor="phone"></label>
      <br />
      <input type="tel" name="phone" id="phone" ref={phoneRef} />
      <br />

      <br />
      <button type="submit">Submit</button>
      <div
        style={{ maxWidth: "500px", padding: "2px", wordWrap: "break-word" }}
      >
        <p>Encrypted: {result.data?.encrypted}</p>
        <p>Decrypted: {JSON.stringify(result.data?.decrypted)}</p>
      </div>
    </form>
  );
}

export default App;
