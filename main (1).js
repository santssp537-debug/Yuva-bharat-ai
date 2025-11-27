// Lightweight demo quiz logic (no backend). Designed for clarity for a school project.
const quiz = [
  {
    q: "Which activity do you enjoy most?",
    opts: ["Solving puzzles / programming", "Helping people / biology", "Design / art / stories", "Numbers / business"]
  },
  {
    q: "What describes you best?",
    opts: ["Curious & analytical", "Caring & patient", "Creative & visual", "Organized & competitive"]
  },
  {
    q: "Pick a favourite subject",
    opts: ["Computer Science / Math", "Biology / Chemistry", "Art / English", "Economics"]
  },
  {
    q: "What is most important to you in a career?",
    opts: ["Innovation & tech", "Helping society", "Creative freedom", "Leadership & income"]
  }
];

let answers = [];
let step = 0;

const qStepEl = document.getElementById('q-step');
const qTextEl = document.getElementById('q-text');
const qOptionsEl = document.getElementById('q-options');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resultCard = document.getElementById('result');
const quizArea = document.getElementById('quiz-area');
const resultText = document.getElementById('result-text');
const roadmap = document.getElementById('roadmap');
const restart = document.getElementById('restart');

function renderQuestion(){
  qStepEl.textContent = `Question ${step+1} of ${quiz.length}`;
  qTextEl.textContent = quiz[step].q;
  qOptionsEl.innerHTML = '';
  quiz[step].opts.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'option';
    btn.textContent = opt;
    btn.onclick = () => {
      answers[step] = i;
      Array.from(qOptionsEl.children).forEach(c => c.classList.remove('selected'));
      btn.classList.add('selected');
    };
    if (answers[step] === i) btn.classList.add('selected');
    qOptionsEl.appendChild(btn);
  });
  prevBtn.style.display = step === 0 ? 'none' : 'inline-block';
  nextBtn.textContent = step === quiz.length - 1 ? 'Submit' : 'Next';
}

prevBtn.addEventListener('click', () => {
  if (step > 0) step--, renderQuestion();
});

nextBtn.addEventListener('click', () => {
  if (typeof answers[step] === 'undefined') {
    alert('Please select an option to continue.');
    return;
  }
  if (step < quiz.length - 1) {
    step++; renderQuestion();
  } else {
    showResult();
  }
});

function showResult(){
  // Simple scoring mapping -> demo results
  // Count chosen indices favoring careers
  const score = answers.reduce((acc, a) => {
    // mapping: 0 -> Tech, 1 -> Medical, 2 -> Creative, 3 -> Business
    acc[a] = (acc[a] || 0) + 1;
    return acc;
  }, {});
  // find highest
  let highestIndex = 0;
  let highestVal = -1;
  for (let i=0;i<4;i++){
    if ((score[i]||0) > highestVal){ highestVal = (score[i]||0); highestIndex = i; }
  }

  const careers = [
    {title:'Technology & Engineering', text:'Focus on coding, robotics, AI, and engineering. Recommended: Computer Science, Engineering streams. Study roadmap: learn basics of programming → practice projects → target JEE / NITs / polytechnic or direct B.Tech paths.'},
    {title:'Medicine & Life Sciences', text:'Focus on biology, patient care, research. Recommended: MBBS, BSc in Life Sciences, allied health courses. Roadmap: strong biology & chemistry → NEET preparation → clinical internships.'},
    {title:'Creative & Design', text:'Focus on art, design, media, storytelling. Recommended: Animation, Design, Fine Arts, Mass Communication. Roadmap: build portfolio → short courses → entrance to design schools or media internships.'},
    {title:'Business & Management', text:'Focus on entrepreneurship, economics, finance. Recommended: BBA, Commerce, Economics. Roadmap: strengthen math & economics → internships → competitive exams and project experience.'}
  ];
  const pick = careers[highestIndex];

  quizArea.classList.add('hidden');
  resultCard.classList.remove('hidden');
  resultText.textContent = `${pick.title} — ${pick.text}`;
  roadmap.innerHTML = `<h4>Suggested 3-step roadmap</h4>
    <ol>
      <li>Short-term: Explore free courses and simple projects (1-6 months)</li>
      <li>Mid-term: Join focused classes and exam preparation (6-24 months)</li>
      <li>Long-term: Apply to colleges or apprenticeship & build experience</li>
    </ol>`;
}

restart.addEventListener('click', () => {
  answers = []; step = 0;
  resultCard.classList.add('hidden');
  quizArea.classList.remove('hidden');
  renderQuestion();
});

// init
renderQuestion();


// Waitlist form: simple local storage + mailto fallback
const waitForm = document.getElementById('wait-form');
const waitMsg = document.getElementById('wait-msg');
const mailtoBtn = document.getElementById('mailto-btn');

waitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('w-name').value.trim();
  const email = document.getElementById('w-email').value.trim();
  const note = document.getElementById('w-note').value.trim();
  if(!name || !email){ alert('Please enter name and email.'); return; }

  // store locally (demo)
  const store = JSON.parse(localStorage.getItem('yb_waitlist') || '[]');
  store.push({name, email, note, at:new Date().toISOString()});
  localStorage.setItem('yb_waitlist', JSON.stringify(store));
  waitMsg.classList.remove('hidden');
  waitMsg.textContent = 'Thanks! Your entry is saved locally in this demo. Use Submit via Email to send full details.';
  waitForm.reset();
});

mailtoBtn.addEventListener('click', () => {
  const name = document.getElementById('w-name').value.trim() || '[Name]';
  const email = document.getElementById('w-email').value.trim() || '[Email]';
  const note = document.getElementById('w-note').value.trim() || '[School / Class]';
  const subject = encodeURIComponent('Yuva Bharat AI - Waitlist Entry');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nNote: ${note}\nProject: Yuva Bharat AI - School demo`);
  location.href = `mailto:yourteacher@example.com?subject=${subject}&body=${body}`;
});