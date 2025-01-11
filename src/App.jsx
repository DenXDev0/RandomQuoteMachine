import { useState, useEffect, useCallback, useRef } from "react";
import xLogo from './assets/x.svg'
import fbLogo from './assets/fb.svg'
import rdtLogo from './assets/rdt.svg'

function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [timer, setTimer] = useState(10);
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState("");
  const [fade, setFade] = useState(true);
  const timerRef = useRef(null);

  const bgColors = [
    "#c78188", "#d9b489", "#77b1a9", "#27ae60", "#BAE1FF", "#9874c2", "#73a857", "#bdbb99", "#16a085", "#e74c3c", "#2c3e50"
  ];

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setFade(false);
    try {
      const randomId = Math.floor(Math.random() * 100) + 1;
      const response = await fetch(`https://dummyjson.com/quotes/${randomId}`);
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();
      const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
      setQuote(data.quote);
      setAuthor(data.author);
      setBgColor(randomColor);
      setTimeout(() => {
        setFade(true);
      }, 500);
    } catch (err) {
      console.error("Error fetching quote:", err);
      setQuote("Oops! Something went wrong.");
      setAuthor("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          fetchQuote();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);


    return () => clearInterval(timerRef.current);
  }, [fetchQuote]);

  const handleNextQuote = () => {
    fetchQuote();
    setTimer(10);
  };

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  
    const elements = [
      { selector: '.quote-section', style: 'color' },
      { selector: 'button', style: 'backgroundColor' },
      { selector: '.timer-progress', style: 'backgroundColor' },
    ];
  
    elements.forEach(({ selector, style }) => {
      const element = document.querySelector(selector);
      if (element) {
        element.style[style] = bgColor;
      }
    });
  }, [bgColor]);
  
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote}" - ${author}`)}`;
  const rdtUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(`"${quote}" - ${author}`)}`;

  return (
    <div id="quote-box" className="quotes-container">
        <div className="timer-line">
          <div
            className="timer-progress"
            style={{ width: `${(timer / 10) * 100}%` }}
          ></div>
        </div>
      <div className={`quote-section ${fade ? "fade-in" : "fade-out"}`}>
            <p id="text" className="quote-text">{quote}</p>
            {author && <p id="author" className="author-text">- {author}</p>}
      </div>
      <div className="button-section">
        <div className="share-link">
          <a id="tweet-quote" href={tweetUrl} target="_blank" rel="noopener noreferrer">
            <img src={xLogo} alt="Icon"/>
          </a>
          <a id="fb-quote" href="#" target="_blank" rel="noopener noreferrer">
            <img src={fbLogo} alt="Icon"/>
          </a>
          <a id="rdt-quote" href={rdtUrl} target="_blank" rel="noopener noreferrer">
            <img src={rdtLogo} alt="Icon"/>
          </a>
        </div>
        <button id="new-quote" onClick={handleNextQuote} disabled={loading}>
          New Quote
        </button>
      </div>
    </div>
  );
}

export default App;