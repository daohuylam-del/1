import React, { useEffect, useState } from "react";

function InstallButton() {
  const [prompt, setPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    (prompt as any)?.prompt?.();
  };

  if (!prompt) {
    return null;
  }

  return <button onClick={onClick}>Install</button>;
}

export default InstallButton;
