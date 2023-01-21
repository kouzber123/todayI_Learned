import { useEffect, useState } from "react";
import supabase from "./supabase";
// Try it nowAsk again laterDon't show again

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  useEffect(() => {
    try {
      setIsLoading(true);

      //which data we want
      let query = supabase.from("facts").select("*");

      if (currentCategory !== "all") query = query.eq("category", currentCategory);

      const date = async () => {
        let { data: facts, error } = await query.order("votesInteresting", { ascending: false }).limit(1000);

        if (!error) setFacts(facts);
        else console.log(error);

        setIsLoading(false);
      };
      date();
    } catch (error) {
      console.log(error);
    }
  }, [currentCategory]);
  return (
    <>
      {/*HEADER */}
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm} /> : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} />}
      </main>
    </>
  );
}
function Loader() {
  return <p className="message">Loading...</p>;
}
function Header({ showForm, setShowForm }) {
  const appTitle = "Today I Learned.";
  return (
    <header className="header">
      <div className="logo">
        <img src="textbubble.png" alt="bubbleimg" />
        <h1>{appTitle}</h1>
      </div>
      <button className="btn btn-large btn-open" onClick={() => setShowForm(show => !show)}>
        {showForm ? "Close Form" : "Share a fact"}
      </button>
    </header>
  );
}
//data will never change
const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
  { name: "culture", color: "black" }
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState("");

  const textLength = text.length;
  async function handleSubmit(e) {
    //1. prevent browser reload
    e.preventDefault();

    //2. if data is valid if so create new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      console.log("there is valid data");

      //upload fact to supabase and receive new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase.from("facts").insert([{ text, source, category }]).select();
      setIsUploading(false);
      if (!error) setFacts(prev => [newFact[0], ...prev]);
      //new fact will appear as first

      setText("");
      setSource("");
      setCategory("");
      setShowForm(false);
    }
  }
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Share a fact with the world..." value={text} onChange={e => setText(e.target.value)} disabled={isUploading} />

      <span>{200 - textLength}</span>
      <input type="text" placeholder="Trustworthy source..." onChange={e => setSource(e.target.value)} value={source} disabled={isUploading} />
      <select value={category} onChange={e => setCategory(e.target.value)} disabled={isUploading}>
        <option value="">Choose tag</option>
        {CATEGORIES.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <>
      <aside>
        <ul>
          <li className="category">
            <button className="btn btn-all-categories" onClick={() => setCurrentCategory("all")}>
              All
            </button>
          </li>
          {CATEGORIES.map(({ name, color }, index) => (
            <li key={index} className="category">
              <button className="btn btn-category" onClick={() => setCurrentCategory(name)} style={{ backgroundColor: color }}>
                {name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

function FactList({ facts, setFacts }) {
  //temporary
  if (facts.length === 0) {
    return <p className="message">No facts for this category yet! Be the first to break the 🧊!</p>;
  }
  return (
    <section className="fact-list">
      <ul className="facts-list">
        {facts.map(fact => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const { id, text, source, category, votesFalse, votesInteresting, votesMindBlowing } = fact;
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = votesInteresting + votesMindBlowing < votesFalse;
  async function handleVote(columnName) {
    console.log(fact[columnName])
    setIsUpdating(true);

    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", id)
      .select();

    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
    if (!error) setFacts(facts => facts.map(f => (f.id === id ? updatedFact[0] : f)));
  }
  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔DISPUTED]</span> : null}
        {text}
        <a className="source" href={source} target="_blank" rel="noreferrer">
          (Source)
        </a>
      </p>
      <span className="tag" style={{ backgroundColor: CATEGORIES.find(color => color.name === category).color }}>
        {category}
      </span>
      <div className="vote-buttons">
        <button onClick={() => handleVote("votesInteresting")} disabled={isUpdating} >
          👍 {votesInteresting}
        </button>
        <button onClick={() => handleVote("votesMindBlowing")} disabled={isUpdating} >
          🤯 {votesMindBlowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating} >
          ⛔ {votesFalse}
        </button>
      </div>
    </li>
  );
}
export default App;

// const newFact = {
//   id: Math.round(Math.random() * 1000000),
//   text,
//   source,
//   category,
//   votesInteresting: 11,
//   votesMindblowing: 2,
//   votesFalse: 0,
//   createdIn: new Date().getFullYear()
// };
