const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://protect-de.mimecast.com/s/_ruYClRZWRHOryzBLFGvz3h?domain=opensource.fb.com",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source: "https://protect-de.mimecast.com/s/8zSYCmq1Wqi1xZRmvuOOJh2?domain=mother.ly",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://protect-de.mimecast.com/s/dEV5CnR2WRHlEz6JnhNfhrB?domain=en.wikipedia.org",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015
  }
];
// Try it nowAsk again laterDon't show again
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

// LINK TO APP SAMPLE DATA: https://protect-de.mimecast.com/s/omZdCoZ3WZUlnMK7kh6VVvB?domain=docs.google.com

//selecting dom elements
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

factsList.innerHTML = "";
const curl = "https://kziyagwskbvjroxalrmh.supabase.co/rest/v1/facts";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXlhZ3dza2J2anJveGFscm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM3MjI1ODMsImV4cCI6MTk4OTI5ODU4M30.oMiwnhd6btoefRCYVIGJaRKrIhiyV4Nu4bgKMpC8tx8";
const url = "https://kziyagwskbvjroxalrmh.supabase.co";
//load data from supabase

async function loadFacts() {
  const res = await fetch(`${curl}`, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`
    }
  });
  const data = await res.json();
  console.log(data)
  // const filteredData = data.filter((fact) => fact.category === "science");
  // console.log(data);
  createFactList(data);
}
loadFacts();

function createFactList(dataArray) {
  const htmlarr = dataArray.map(
    fact => `<li class="fact">
  <p>
  ${fact.text}
  <a class="source" 
  href=${fact.source}
  target="_blank">(Source)
  </a>
  </p>
  <span class="tag" style="background-color: 
  ${CATEGORIES.find((el) => el.name === fact.category).color
  }">${fact.category}</span>
  </li>`
  );
  const html = htmlarr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}

//toggle form visibility

btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
});

// filter btn

let votesInteresting = 24;
let votesMindblowing = 10;
let votesFalse = 5;
