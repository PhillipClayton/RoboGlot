const startBtn = document.getElementById("startBtn");
const languageSelect = document.getElementById("languageSelect");
const transcriptEl = document.querySelector("#transcript span");
const responseEl = document.querySelector("#response span");

startBtn.addEventListener("click", () => {
  const lang = languageSelect.value;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    transcriptEl.textContent = transcript;

    const geminiResponse = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: transcript })
    }).then(res => res.json());

    responseEl.textContent = geminiResponse.reply;
    speakText(geminiResponse.reply, lang);
  };

  recognition.onerror = (event) => {
    alert("Speech recognition error: " + event.error);
  };
});

function speakText(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}