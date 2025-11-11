import { useEffect, useState } from "react";

const CONFIG_URL = "/config/config.json";

const initialState = {
  apiBaseUrl: "",
};

export default function App() {
  const [config, setConfig] = useState(initialState);
  const [message, setMessage] = useState("");
  const [environment, setEnvironment] = useState("");
  const [secretConfigured, setSecretConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(CONFIG_URL)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.statusText}`);
        }
        const data = await response.json();
        setConfig({ ...initialState, ...data });
        return data;
      })
      .then((data) => fetchMessage(data.apiBaseUrl))
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const fetchMessage = (apiBaseUrl) => {
    if (!apiBaseUrl) {
      setError("API base URL is missing. Check your ConfigMap.");
      setLoading(false);
      return;
    }

    fetch(`${apiBaseUrl}/api/message`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Backend request failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((payload) => {
        setMessage(payload.message);
        setEnvironment(payload.environment);
        setSecretConfigured(Boolean(payload.secretConfigured));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <main className="container">
      <h1>Kubernetes Learning Portal</h1>
      <section className="card">
        <h2>Configuration</h2>
        <ul>
          <li>
            <strong>API Base URL:</strong> {config.apiBaseUrl || "not set"}
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>Backend Message</h2>
        {loading && <p>Loading message from the backend...</p>}
        {!loading && error && <p className="error">Error: {error}</p>}
        {!loading && !error && (
          <>
            <p className="message">{message}</p>
            <p>
              <strong>Environment:</strong> {environment}
            </p>
            <p>
              <strong>Secret Configured:</strong>{" "}
              {secretConfigured ? "Yes" : "No"}
            </p>
          </>
        )}
      </section>
    </main>
  );
}

