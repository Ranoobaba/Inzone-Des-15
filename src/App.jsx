import { useState, useRef, useCallback } from "react";

const NAV = ["Overview", "Research Plan", "Interviews", "Affinity Diagram", "Insights", "Problem Statement"];

const team = [
  { name: "Meshal Alothra", initials: "MA" },
  { name: "Rayyan Ali", initials: "RA" },
  { name: "Aryan Nagpal", initials: "AN" },
];

const memberColors = {
  RA: { bg: "#dbeafe", border: "#93c5fd", text: "#1e3a5f" },
  MA: { bg: "#ede9fe", border: "#c4b5fd", text: "#3b1f7e" },
  AN: { bg: "#fed7aa", border: "#fdba74", text: "#7c2d12" },
};

const affinityNotes = [
  { id: 1, text: "\"Cognitively taxing tasks drain me\"", theme: "Rationalized Distraction", by: "RA", x: 40, y: 75, r: -2 },
  { id: 2, text: "Phone as a rational escape hatch", theme: "Rationalized Distraction", by: "MA", x: 220, y: 65, r: 1.5 },
  { id: 3, text: "Diminishing returns justification", theme: "Rationalized Distraction", by: "AN", x: 55, y: 195, r: -1 },
  { id: 4, text: "Avoidance framed as self-care", theme: "Rationalized Distraction", by: "RA", x: 235, y: 185, r: 2 },
  { id: 5, text: "6\u20138 sec OPAL delay works", theme: "Friction as Key Mechanism", by: "RA", x: 530, y: 70, r: 1 },
  { id: 6, text: "Hard blocks feel punishing", theme: "Friction as Key Mechanism", by: "MA", x: 710, y: 60, r: -1.5 },
  { id: 7, text: "Puzzles > passive timers", theme: "Friction as Key Mechanism", by: "AN", x: 545, y: 190, r: 2.5 },
  { id: 8, text: "Pause enables self-reflection", theme: "Friction as Key Mechanism", by: "RA", x: 725, y: 180, r: -0.5 },
  { id: 9, text: "\"Working memory erased\"", theme: "Re-entry Cost", by: "MA", x: 40, y: 385, r: -1.5 },
  { id: 10, text: "Break \u2192 restart barrier", theme: "Re-entry Cost", by: "AN", x: 220, y: 375, r: 2 },
  { id: 11, text: "Context loss is painful", theme: "Re-entry Cost", by: "RA", x: 55, y: 500, r: 0.5 },
  { id: 12, text: "Long sessions hard to resume", theme: "Re-entry Cost", by: "MA", x: 235, y: 490, r: -2.5 },
  { id: 13, text: "Stress noticed after the fact", theme: "Retrospective Awareness", by: "AN", x: 530, y: 380, r: 1.5 },
  { id: 14, text: "Others notice before self", theme: "Retrospective Awareness", by: "RA", x: 710, y: 370, r: -1 },
  { id: 15, text: "No real-time internal signal", theme: "Retrospective Awareness", by: "MA", x: 545, y: 495, r: 2 },
  { id: 16, text: "Patterns felt but not captured", theme: "Retrospective Awareness", by: "AN", x: 725, y: 485, r: -0.5 },
];

const interviewees = [
  {
    interviewer: "Rayyan Ali",
    participant: "Muhammed",
    status: "complete",
    background: "Berkeley CS & History graduate. Currently job-hopping and building projects. Enjoys reading and crime novels. Has ADHD and experiences significant attention and focus challenges.",
    responses: [
      {
        q: "Walk me through the last time you tried to focus on something important.",
        a: "Attended a YC hackathon and built a project. Struggled to focus for most of it — but because he genuinely enjoyed the problem, he sustained 5 hours of work. Intrinsic motivation was the primary driver of sustained attention.",
        breakdown: "Focus is highly contingent on interest level. When a task feels mandatory rather than engaging, focus collapses quickly regardless of environment.",
      },
      {
        q: "When you pick up your phone during a focus session, what triggers that?",
        a: "Frames phone use as rational: \"cognitively taxing tasks actively drain\" his capacity. Justifies checking his phone because he believes he won't be productive anyway — feels he's hit a point of diminishing returns.",
        breakdown: "Users rationalize distraction as logical, making external intervention feel patronizing unless it mirrors the user's own internal reasoning.",
      },
      {
        q: "Have you tried any apps or tools to manage distraction?",
        a: "Uses OPAL to set app time limits. Found it useful but notes it's easy to disable. Values the 6–8 second delay most: \"How badly do I want this, and am I okay with this tradeoff?\"",
        breakdown: "Friction — not blocking — is the effective mechanism. A hard block feels controlling; a deliberate pause prompts self-reflection.",
      },
      {
        q: "How do you know when you're stressed or overwhelmed?",
        a: "Acts out of character. Because he's naturally optimistic, noticing negative thoughts signals something is wrong. People around him notice before he does.",
        breakdown: "Stress awareness is often socially mediated and retrospective — not real-time or self-generated.",
      },
      {
        q: "Have you ever tried tracking your mood or stress?",
        a: "Has never formally tracked. Notices his own patterns through lived experience but has no systematic method for capturing or acting on them.",
        breakdown: "High self-awareness doesn't translate to actionable data — patterns are felt but not captured or usable.",
      },
      {
        q: "Is there a moment in your day where focus just falls apart?",
        a: "After a long session, taking a break feels like his \"working memory was erased.\" The thought of the effort needed to rebuild context deters him from starting again.",
        breakdown: "Re-entry cost after breaks is a major hidden barrier — the psychological toll of rebuilding mental context prevents restart.",
      },
      {
        q: "What would a tool need to do — or avoid — to fit into your life?",
        a: "\"Avoid a system that forces me to change drastically.\" Wants OPAL to add a puzzle or cognitively taxing challenge instead of a simple timer — something that makes phone access feel earned rather than just delayed.",
        breakdown: "Passive timers are ignored; active challenges require genuine decision-making and are harder to rationalize away.",
      },
      {
        q: "Anything about your experience people wouldn't think to ask?",
        a: "\"Why do I do things.\" Suggests that the motivational layer beneath behavior is consistently overlooked by productivity tools.",
        breakdown: "Current tools address surface behavior but rarely address the underlying motivation — a consistent gap in existing solutions.",
      },
    ],
    observations: [
      "Touches his hair frequently during conversation — a possible physical indicator of cognitive load or social discomfort.",
      "Avoids direct eye contact while speaking — may reflect internal processing style, relevant to how feedback should be delivered (ambient, non-confrontational).",
    ],
  },
  {
   interviewer: "Meshal Alothra",
    participant: "Hamza",
    status: "complete",
    background: "Hamza is a junior at UC Berkeley from Jeddah, Saudi Arabia, studying psychology and data science. In addition to managing a demanding academic workload, he is a Taekwondo champion and competes on the university team.",
    responses: [
      {
        q: "Tell me a bit about yourself and what your typical day looks like in terms of school and work.",
        a: "I’m a junior at UC Berkeley from Saudi Arabia studying psychology and data science. My days are split between classes, studying, hobbies, and sports. I stay busy, and most of my academic and personal tasks involve using my phone or laptop.",
        breakdown: "Participant balances academics, hobbies, and athletics, creating a full schedule. Digital devices are central to both productivity and leisure, making it hard to disconnect.",
      },
      {
        q: "How often are you using electronic devices when you're studying or working?",
        a: "Almost all the time — pretty much everything except sports involves my laptop or phone.",
        breakdown: "Device use is unavoidable for school and daily tasks. Any change would need to work within device use, not eliminate it.",
      },
      {
        q: "How would you describe your relationship with digital devices overall?",
        a: "It started as something I used when I was bored, but it became a habit. Now it’s the first thing I check when I wake up. It feels like a comfort space, but I don’t like how dependent I’ve become.",
        breakdown: "There’s comfort and convenience, but also growing awareness of dependency. The relationship feels habitual rather than intentional.",
      },
      {
        q: "Do you like your current relationship with social media, and if not, what is one thing you wish you could change about it?",
        a: "I mostly use Instagram. I don’t like my current relationship with it — I spend too much time on my phone. I wish I could reduce my reliance and better control the content I see.",
        breakdown: "Social media is both entertainment and distraction. Participant wants moderation and more control over exposure to content.",
      },
      {
        q: "If you had to estimate, how much of your day involves digital devices and social media?",
        a: "Around five to six hours a day.",
        breakdown: "Usage is consistently high, forming a significant portion of daily life.",
      },
      {
        q: "Does social media ever get in the way of your work? If so, how?",
        a: "Yes. It’s not part of my work, so when I’m on it, I’m not being productive.",
        breakdown: "Distraction is mainly time loss rather than anxiety. Social media directly competes with focused work time.",
      },
      {
        q: "What, if anything, would you like to change about your relationship with your phone and social media?",
        a: "I want to be less reliant on it and better regulate how much I use it and what content I consume.",
        breakdown: "Participant wants both usage limits and content filtering — not just less time, but healthier engagement.",
      },
      {
        q: "Would you say that you feel anxiety when using electronic devices like phones or computers, and if so, why?",
        a: "No, not really.",
        breakdown: "There’s no direct anxiety during use; the concern is more about dependency and productivity.",
      },
      {
        q: "Is there anything we didn't talk about today that you would like to share before we wrap up?",
        a: "No.",
        breakdown: "No additional concerns beyond device dependency and moderation.",
      },
    ],
      observations: [
      "What really stands out is that his relationship with his phone isn’t toxic, it’s just habit. It’s not that he hates using it or feels anxious while scrolling — it has simply become the default. When he’s bored, tired, or just waking up, his phone is the first thing he reaches for without even thinking.",
    ],
  },
  {
    interviewer: "Aryan Nagpal",
    participant: "Gabriel Ryan Turner",
    status: "complete",
    background: "First-year mechanical engineering student at UC Berkeley, from Orange County, California, exploring a specialization in medical technology.",
    responses: [
      {
        q: "Tell me a bit about yourself and what your typical day looks like in terms of school and work.",
        a: "Gabriel Ryan Turner: I'm from Millville, Kentucky, and I'm studying industrial engineering — I'm a freshman. I'm working on different AI projects for a startup, meeting with teammates on a bi-weekly basis and using tools like VS Code and Render. On top of that I'm maintaining my schoolwork and constantly checking emails. I procrastinate a little, so my days can feel pretty sporadic.",
        breakdown: "Participant juggles a demanding academic schedule with an early-stage startup, producing a high and sometimes chaotic cognitive load. Digital tools are central to both domains, making it hard to find clear separation between \"on\" and \"off\" time.",
      },
      {
        q: "How often are you using electronic devices when you're studying or working?",
        a: "All the time — I'm pretty much attached to my computer.",
        breakdown: "Work and study are effectively inseparable from device use. Any intervention has to acknowledge that \"less screen\" is not realistic; instead, support must live within the same devices that create the overload.",
      },
      {
        q: "How would you describe your relationship with digital devices overall?",
        a: "Generally pretty positive — they allow me to do quite a lot. I'd like to be able to separate myself a little more, but overall it's good.",
        breakdown: "There is a tension between appreciation and overreliance: devices are empowering but also hard to step away from. The participant acknowledges the benefits of digital tools while wanting a bit more separation from them.",
      },
      {
        q: "Do you like your current relationship with social media, and if not, what is one thing you wish you could change about it?",
        a: "I use Instagram and LinkedIn, and we do a lot of organizing through Discord. I think my relationship with social media is okay, but I spend too much time on my phone. I've looked at some apps to limit screen time, but not much has really worked. I wish that I could just, like, put out notifications — or have a platform that could lock things down and send a status across different platforms when I'm trying not to be on my phone.",
        breakdown: "Social media is both social infrastructure (Discord for coordination) and a source of overuse. Previous attempts with screen-time tools have failed to stick, and the participant explicitly wishes for a way to both lock apps down and broadcast a \"do not disturb\" status across platforms.",
      },
      {
        q: "If you had to estimate, how much of your day involves digital devices and social media?",
        a: "On a good day, maybe around 3 hours. On a bad day, it can feel like the whole day.",
        breakdown: "Usage swings dramatically from moderate to extreme, indicating weak or unstable boundaries. Any tool that helps has to adapt to these swings rather than assuming a fixed \"normal\" day.",
      },
      {
        q: "Does social media ever get in the way of your work? If so, how?",
        a: "Yes, it does. It's not always just doomscrolling — it's also people messaging me and feeling obligated to reply.",
        breakdown: "Distraction isn't only passive scrolling; it's also the social obligation layer of messaging. Interventions must account for the pressure to respond, not just reduce content consumption.",
      },
      {
        q: "What, if anything, would you like to change about your relationship with your phone and social media?",
        a: "I wish I could just put out notifications or have a platform that could lock things down and send a status across different platforms — something that tells people when I'm trying not to be on my phone.",
        breakdown: "Participant wants two things: stronger friction around access (\"lock down\") and cross-platform social signaling (so others know not to expect instant replies). This points toward solutions that combine behavior shaping with status broadcasting.",
      },
      {
        q: "Would you say that you feel anxiety when using electronic devices like phones or computers, and if so, why?",
        a: "I don't really feel anxious while I'm using them, but I do feel anxious when I know I've spent too much time on them.",
        breakdown: "Emotional cost shows up as guilt or anxiety after overuse, not as a real-time signal. A helpful system could surface gentle feedback earlier, before the regret phase.",
      },
      {
        q: "Is there anything we didn't talk about today that you would like to share before we wrap up?",
        a: "No.",
        breakdown: "Participant did not have additional comments beyond what was already discussed in the interview.",
      },
    ],
    observations: [
      "Relies heavily on Discord for organizing school and startup work, reinforcing that social and work communications are intertwined.",
      "Describes himself as \"attached\" to his computer, suggesting that focus and distraction both occur on the same primary device.",
      "Has explored screen time limiting apps but abandoned them, indicating that existing tools feel either too blunt or too easy to bypass.",
    ],
  },
];

const themeLabels = [
  { text: "Rationalized Distraction", x: 30, y: 30 },
  { text: "Friction as Key Mechanism", x: 520, y: 30 },
  { text: "Re-entry Cost", x: 30, y: 340 },
  { text: "Retrospective Awareness", x: 520, y: 340 },
];

const Tag = ({ children, color = "default" }) => {
  const colors = {
    default: { bg: "#f4f4f5", text: "#71717a" },
    purple: { bg: "#f3f0ff", text: "#7c3aed" },
    green: { bg: "#f0fdf4", text: "#16a34a" },
    orange: { bg: "#fff7ed", text: "#c2410c" },
  };
  const c = colors[color] || colors.default;
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 500, display: "inline-block" }}>
      {children}
    </span>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 12, padding: 24, ...style }}>
    {children}
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: "#a1a1aa", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
    {children}
  </div>
);

export default function App() {
  const [active, setActive] = useState("Overview");
  const [openInterview, setOpenInterview] = useState(0);

  const [notePos, setNotePos] = useState(() => {
    const init = {};
    affinityNotes.forEach(n => { init[n.id] = { x: n.x, y: n.y }; });
    return init;
  });
  const [dragId, setDragId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const boardRef = useRef(null);

  const onNoteDown = (e, id) => {
    e.preventDefault();
    const rect = boardRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragOffset.current = { x: clientX - notePos[id].x - rect.left, y: clientY - notePos[id].y - rect.top };
    setDragId(id);
  };

  const onBoardMove = useCallback((e) => {
    if (dragId === null) return;
    const rect = boardRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setNotePos(prev => ({ ...prev, [dragId]: { x: clientX - rect.left - dragOffset.current.x, y: clientY - rect.top - dragOffset.current.y } }));
  }, [dragId]);

  const onBoardUp = useCallback(() => { setDragId(null); }, []);

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif", background: "#f9f9f9", minHeight: "100vh", color: "#18181b" }}>

      {/* Topbar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e4e4e7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#18181b", letterSpacing: "-0.3px" }}>INZONE</span>
            <span style={{ color: "#d4d4d8" }}>·</span>
            <span style={{ fontSize: 13, color: "#71717a" }}>DES 15</span>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {NAV.map(n => (
              <button key={n} onClick={() => setActive(n)} style={{
                padding: "5px 12px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: active === n ? 600 : 400,
                background: active === n ? "#f4f4f5" : "transparent",
                color: active === n ? "#18181b" : "#71717a",
                transition: "all 0.1s",
              }}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* OVERVIEW */}
        {active === "Overview" && (
          <div>
            <div style={{ marginBottom: 40 }}>
              <Tag color="purple">Needfinding · Milestone 1</Tag>
              <h1 style={{ fontSize: 36, fontWeight: 700, margin: "12px 0 8px", letterSpacing: "-0.5px", color: "#18181b" }}>INZONE</h1>
              <p style={{ fontSize: 17, color: "#52525b", maxWidth: 600, lineHeight: 1.65, margin: 0 }}>
                Understanding how people with ADHD and attention difficulties manage focus and stress — and how phone usage shapes those experiences throughout the day.
              </p>
            </div>

            <Card style={{ marginBottom: 16 }}>
              <SectionLabel>Why We Chose This Area</SectionLabel>
              <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.75, color: "#27272a" }}>
                Each of us on the team has personally experienced the frustration of losing focus — whether during lectures, study sessions, or deep work — and turning to our phones without fully understanding why. We wanted to explore this space because it felt deeply familiar yet poorly understood: the relationship between attention difficulties, stress, and the digital habits that quietly shape both. This personal connection motivated us to investigate how people with ADHD and attention challenges navigate focus and phone use in their daily lives.
              </p>

              <SectionLabel>Research Questions We Considered</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "8px 0 20px" }}>
                {[
                  "What is the relationship between daily screen time and academic productivity among college students with ADHD?",
                  "What coping strategies do people with attention difficulties use to manage digital distractions, and which ones are most effective?",
                  "How does the frequency of phone notifications impact stress levels and emotional regulation in individuals with ADHD?",
                ].map((rq, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#f4f4f5", borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#a1a1aa", flexShrink: 0, paddingTop: 1 }}>{i + 1}</span>
                    <span style={{ fontSize: 14, color: "#52525b", lineHeight: 1.6 }}>{rq}</span>
                  </div>
                ))}
              </div>

              <SectionLabel>Selected Research Question</SectionLabel>
              <div style={{ background: "#18181b", borderRadius: 10, padding: "16px 20px", margin: "8px 0 20px" }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "#fafafa", lineHeight: 1.65 }}>
                  How do people with ADHD manage stress and focus, and how does phone and screen use affect those experiences throughout the day?
                </p>
              </div>

              <SectionLabel>Why We Chose This Question</SectionLabel>
              <p style={{ margin: "0", fontSize: 15, lineHeight: 1.75, color: "#27272a" }}>
                We chose this question because it is broad enough to capture the full picture — not just screen time or notifications in isolation, but the interplay between stress, focus, and phone habits across a full day. Unlike our other candidates, this question avoids prescribing a specific variable (e.g., notification frequency) and instead lets participants describe their own experience, which is better suited to the exploratory, needfinding stage of our research.
              </p>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionLabel>Selected Research Question</SectionLabel>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#27272a" }}>
                  How do people with ADHD manage stress and focus, and how does phone and screen use affect those experiences throughout the day?
                </p>
              </Card>
              <Card>
                <SectionLabel>Problem Space</SectionLabel>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#27272a" }}>
                  People with ADHD experience elevated stress from frequent digital distractions — often without realizing the connection between their habits and their mental state.
                </p>
              </Card>
            </div>

            <Card style={{ marginBottom: 16 }}>
              <SectionLabel>Team</SectionLabel>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                {team.map(t => (
                  <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 10, background: "#f4f4f5", borderRadius: 8, padding: "8px 14px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#18181b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {t.initials}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#18181b" }}>{t.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionLabel>Approach</SectionLabel>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 4 }}>
                {[
                  ["3", "Interviews"],
                  ["5", "Insights"],
                  ["4", "Affinity Themes"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#18181b", letterSpacing: "-1px" }}>{n}</div>
                    <div style={{ fontSize: 13, color: "#71717a", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* RESEARCH PLAN */}
        {active === "Research Plan" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Research Plan</h2>
              <p style={{ margin: 0, color: "#71717a", fontSize: 15 }}>Participant strategy, interview structure, and data collection approach.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card>
                <SectionLabel>User Types</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                  {[
                    ["Everyday User", "College student with diagnosed ADHD who uses their phone regularly for school"],
                    ["Extreme User", "Someone who has tried many productivity systems and tools obsessively"],
                    ["Low-Tech User", "Deliberately analog — grayscale phone, minimal apps, paper planner"],
                    ["Clinical Stakeholder", "Therapist or coach who works with ADHD patients"],
                    ["Non-Diagnosed", "High-stress user without a diagnosis — reveals what is universal vs. ADHD-specific"],
                  ].map(([label, desc]) => (
                    <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <Tag>{label}</Tag>
                      <span style={{ fontSize: 14, color: "#52525b", lineHeight: 1.6, paddingTop: 2 }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionLabel>Interview Structure — 10 Minutes</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
                  {[
                    ["1 min", "Warm-up", "Tell me about yourself and how you typically spend your day."],
                    ["4 min", "Phone & Focus", "Walk me through the last time you tried to focus. What triggered picking up your phone? What tools have you tried?"],
                    ["3 min", "Stress & Awareness", "How do you know when you're stressed? Have you ever tracked your mood or stress?"],
                    ["2 min", "Needs & Wrap-up", "When does focus fall apart? What would a tool need to do — or avoid — to fit into your life?"],
                  ].map(([time, title, desc], i, arr) => (
                    <div key={title} style={{ display: "flex", gap: 16, paddingBottom: i < arr.length - 1 ? 16 : 0, marginBottom: i < arr.length - 1 ? 16 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f4f4f5" : "none" }}>
                      <div style={{ width: 44, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#a1a1aa" }}>{time}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#18181b", marginBottom: 3 }}>{title}</div>
                        <div style={{ fontSize: 14, color: "#52525b", lineHeight: 1.55 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionLabel>What to Capture</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {[
                    "Phone home screen layout — apps, folders, notification settings",
                    "Any physical tools in use (planners, sticky notes, fidget objects)",
                    "Moments of context-switching or phone pick-up during observation",
                    "Direct quotes, especially surprising or contradictory ones",
                    "Workarounds users invented themselves",
                    "Tools they know about but don't use — and why",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "#a1a1aa", fontSize: 13, marginTop: 3, flexShrink: 0 }}>—</span>
                      <span style={{ fontSize: 14, color: "#52525b", lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* INTERVIEWS */}
        {active === "Interviews" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Interviews</h2>
              <p style={{ margin: 0, color: "#71717a", fontSize: 15 }}>One interview per team member. ~10 minutes, semi-structured, with in-context observations.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid #e4e4e7", paddingBottom: 0 }}>
              {interviewees.map((iv, idx) => (
                <button key={idx} onClick={() => setOpenInterview(idx)} style={{
                  padding: "8px 16px", border: "none", background: "transparent", cursor: "pointer",
                  fontSize: 14, fontWeight: openInterview === idx ? 600 : 400,
                  color: openInterview === idx ? "#18181b" : "#71717a",
                  borderBottom: openInterview === idx ? "2px solid #18181b" : "2px solid transparent",
                  marginBottom: -1, transition: "all 0.1s",
                }}>
                  {iv.participant}
                  {iv.status === "complete" && <span style={{ marginLeft: 6, display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#16a34a", verticalAlign: "middle" }} />}
                </button>
              ))}
            </div>

            {interviewees[openInterview] && (() => {
              const iv = interviewees[openInterview];
              return (
                <div>
                  <Card style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <SectionLabel>Interviewer</SectionLabel>
                        <div style={{ fontSize: 15, fontWeight: 500, color: "#18181b" }}>{iv.interviewer}</div>
                      </div>
                      <Tag color={iv.status === "complete" ? "green" : "default"}>
                        {iv.status === "complete" ? "Complete" : "Pending"}
                      </Tag>
                    </div>
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f4f4f5" }}>
                      <SectionLabel>Participant Background</SectionLabel>
                      <p style={{ margin: 0, fontSize: 15, color: "#52525b", lineHeight: 1.65 }}>{iv.background}</p>
                    </div>
                  </Card>

                  {iv.responses.length > 0 ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {iv.responses.map((r, i) => (
                          <Card key={i}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Q{i + 1}</div>
                            <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "#18181b", lineHeight: 1.5 }}>{r.q}</p>
                            <p style={{ margin: "0 0 12px", fontSize: 14, color: "#52525b", lineHeight: 1.7 }}>{r.a}</p>
                            <div style={{ background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0, paddingTop: 1 }}>Breakdown</span>
                              <span style={{ fontSize: 13, color: "#52525b", lineHeight: 1.6 }}>{r.breakdown}</span>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {iv.observations.length > 0 && (
                        <Card style={{ marginTop: 16 }}>
                          <SectionLabel>Field Observations</SectionLabel>
                          {iv.participant === "Gabriel Ryan Turner" ? (
                            <div style={{ marginTop: 8 }}>
                              <audio
                                controls
                                src="/Call with Gabriel Turner.m4a"
                                style={{ width: "100%", maxWidth: 480, height: 40 }}
                              >
                                Your browser does not support the audio element.
                              </audio>
                              <div style={{ marginTop: 16, padding: "12px 16px", background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 8 }}>
                                <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#18181b" }}>Breakdown</p>
                                <p style={{ margin: 0, fontSize: 13, color: "#52525b", lineHeight: 1.65 }}>
                                  From the call: Gabriel relies heavily on Discord for school and startup coordination, so social and work communications are intertwined. He describes being &quot;attached&quot; to his computer — focus and distraction both happen on the same device. He has tried screen-time and limiting apps but stopped using them; existing tools feel either too blunt or too easy to bypass. Key opportunity: support that lives inside the same devices (e.g. friction or status broadcast) rather than asking for less screen time overall.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                                {iv.observations.map((o, i) => (
                                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                    <span style={{ color: "#a1a1aa", flexShrink: 0, marginTop: 2 }}>—</span>
                                    <span style={{ fontSize: 14, color: "#52525b", lineHeight: 1.6 }}>{o}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Photo documentation */}
                              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f4f4f5" }}>
                                <SectionLabel>Photo Documentation</SectionLabel>
                                <div style={{ marginTop: 10, border: "1px solid #e4e4e7", borderRadius: 10, overflow: "hidden" }}>
                                  <div style={{ background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220, position: "relative" }}>
                                    <img
                                      src={iv.participant === "Hamza" ? "/hamza-interview.png" : "https://i.imgur.com/WqesFlP.jpeg"}
                                      alt={iv.participant === "Hamza" ? "Hamza interview call screenshot" : "Participant observed touching hair during interview"}
                                      onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                                      style={{ width: "100%", maxHeight: 340, objectFit: "cover", display: "block" }}
                                    />
                                    <div style={{ display: "none", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 40, color: "#a1a1aa", fontSize: 13, textAlign: "center" }}>
                                      <span style={{ fontSize: 28 }}>📷</span>
                                      <span>Replace <code>REPLACE_WITH_HOSTED_IMAGE_URL</code> with your hosted image link</span>
                                    </div>
                                  </div>
                                  <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #f4f4f5" }}>
                                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#18181b" }}>
                                      {iv.participant === "Hamza"
                                        ? "Remote video call between Meshal and Hamza during the interview"
                                        : "Participant touches hair and avoids eye contact mid-response"}
                                    </p>
                                    <p style={{ margin: 0, fontSize: 13, color: "#71717a", lineHeight: 1.6 }}>
                                      {iv.participant === "Hamza" ? (
                                        <>
                                          <strong>Breakdown / Opportunity:</strong> Screenshot captures Hamza in his everyday digital workspace during a remote interview. The setting reinforces how much of his academic and personal life happens through his laptop, making it clear that any intervention to reduce dependence or distraction has to live within his existing device habits rather than pull him away from them.
                                        </>
                                      ) : (
                                        <>
                                          <strong>Breakdown / Opportunity:</strong> Physical self-soothing behavior (hair-touching, gaze aversion) appeared consistently during cognitively loaded responses — suggesting stress and cognitive load manifest physically before users consciously register them. This points to an opportunity for ambient, body-signal-based stress detection rather than self-reported check-ins.
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </Card>
                      )}
                    </>
                  ) : (
                    <Card style={{ textAlign: "center", padding: 48 }}>
                      <p style={{ margin: 0, color: "#a1a1aa", fontSize: 14 }}>Interview data will appear here once collected.</p>
                    </Card>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* AFFINITY DIAGRAM */}
        {active === "Affinity Diagram" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Affinity Diagram</h2>
              <p style={{ margin: 0, color: "#71717a", fontSize: 15 }}>Drag sticky notes to rearrange. Each note is color-coded by team member.</p>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { initials: "RA", name: "Rayyan Ali", c: memberColors.RA },
                { initials: "MA", name: "Meshal Alothra", c: memberColors.MA },
                { initials: "AN", name: "Aryan Nagpal", c: memberColors.AN },
              ].map(m => (
                <div key={m.initials} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: m.c.bg, border: `2px solid ${m.c.border}` }} />
                  <span style={{ fontSize: 13, color: "#52525b" }}>{m.name}</span>
                </div>
              ))}
            </div>

            <div
              ref={boardRef}
              onMouseMove={onBoardMove}
              onMouseUp={onBoardUp}
              onMouseLeave={onBoardUp}
              onTouchMove={onBoardMove}
              onTouchEnd={onBoardUp}
              style={{
                position: "relative",
                width: "100%",
                height: 640,
                background: "#f0f9ff",
                borderRadius: 16,
                border: "2px solid #e0f2fe",
                overflow: "hidden",
                cursor: dragId ? "grabbing" : "default",
                touchAction: "none",
                backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              <div style={{ position: "absolute", left: "50%", top: 30, bottom: 30, width: 1, background: "#cbd5e180" }} />
              <div style={{ position: "absolute", top: "50%", left: 30, right: 30, height: 1, background: "#cbd5e180" }} />

              {themeLabels.map(l => (
                <div key={l.text} style={{
                  position: "absolute", left: l.x, top: l.y,
                  fontSize: 11, fontWeight: 700, color: "#64748b",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  pointerEvents: "none", userSelect: "none",
                }}>
                  {l.text}
                </div>
              ))}

              {affinityNotes.map(note => {
                const pos = notePos[note.id];
                const c = memberColors[note.by];
                return (
                  <div
                    key={note.id}
                    onMouseDown={e => onNoteDown(e, note.id)}
                    onTouchStart={e => onNoteDown(e, note.id)}
                    style={{
                      position: "absolute",
                      left: pos.x,
                      top: pos.y,
                      width: 155,
                      minHeight: 90,
                      background: c.bg,
                      border: `2px solid ${c.border}`,
                      borderRadius: 6,
                      padding: "10px 12px",
                      cursor: dragId === note.id ? "grabbing" : "grab",
                      transform: `rotate(${note.r}deg)`,
                      boxShadow: dragId === note.id ? "0 8px 24px rgba(0,0,0,0.15)" : "0 2px 6px rgba(0,0,0,0.06)",
                      zIndex: dragId === note.id ? 50 : 1,
                      transition: dragId === note.id ? "none" : "box-shadow 0.15s",
                      userSelect: "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: 12.5, lineHeight: 1.45, color: c.text, fontWeight: 500 }}>{note.text}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c.text, opacity: 0.5, marginTop: 8, alignSelf: "flex-end" }}>{note.by}</span>
                  </div>
                );
              })}
            </div>

            <Card style={{ marginTop: 20 }}>
              <SectionLabel>Top 3 Takeaways</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
                {[
                  "Users rationalize distraction as logical \u2014 making hard blocks ineffective and friction-based design essential.",
                  "Stress awareness is almost always retrospective \u2014 users rarely know they are overwhelmed until after the fact.",
                  "Re-entry cost after breaks is a hidden and underserved pain point \u2014 the mental effort to rebuild context prevents people from resuming work.",
                ].map((text, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ background: "#18181b", color: "#fff", borderRadius: 6, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <p style={{ margin: 0, fontSize: 15, color: "#27272a", lineHeight: 1.65 }}>{text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* USER NEEDS */}
        {active === "Insights" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Key Insights</h2>
              <p style={{ margin: 0, color: "#71717a", fontSize: 15 }}>Five main insights about user needs, synthesized from our interviews.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  title: "Distraction is rationalized, not impulsive",
                  body: "Users don't mindlessly reach for their phones \u2014 they construct logical justifications for doing so. One participant described phone-checking as rational because \"cognitively taxing tasks actively drain\" capacity, making continued work feel pointless. This means interventions that treat distraction as purely impulsive (like hard blocks) will feel patronizing and be bypassed.",
                },
                {
                  title: "Friction is more effective than restriction",
                  body: "The most valued feature of existing tools like OPAL was not the ability to block apps entirely, but the 6\u20138 second delay that created a moment of self-reflection. Users want a pause that asks \"do you really want this?\" rather than a wall that says \"you can't have this.\" Active friction (puzzles, challenges) was preferred over passive timers.",
                },
                {
                  title: "Re-entry cost is a hidden barrier to productivity",
                  body: "After taking a break, users described feeling like their \"working memory was erased.\" The mental effort required to rebuild context and re-engage with a task was so high that it deterred them from starting again entirely. This re-entry cost is a significant and underserved pain point that no existing tool addresses.",
                },
                {
                  title: "Stress awareness is retrospective, not real-time",
                  body: "Users rarely recognize they are stressed or overwhelmed in the moment. Instead, stress is identified after the fact \u2014 often by other people noticing behavioral changes before the user does. This means tools that rely on self-reported stress levels in the moment will miss the mark entirely.",
                },
                {
                  title: "Existing tools address behavior but ignore motivation",
                  body: "Productivity tools track surface metrics like screen time or app usage, but never ask \"why\" a user is engaging in a particular behavior. One participant explicitly noted that the motivational layer beneath behavior is consistently overlooked. Understanding the \"why\" is critical for any intervention to feel relevant and respectful.",
                },
              ].map((insight, i) => (
                <Card key={i}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ background: "#18181b", color: "#fff", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#18181b", marginBottom: 6 }}>{insight.title}</div>
                      <p style={{ margin: 0, fontSize: 14, color: "#52525b", lineHeight: 1.7 }}>{insight.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* PROBLEM STATEMENT */}
        {active === "Problem Statement" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Problem Statement</h2>
              <p style={{ margin: 0, color: "#71717a", fontSize: 15 }}>Synthesized from research findings. No solutions — only the problem.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card>
                <SectionLabel>Background</SectionLabel>
                <p style={{ margin: 0, fontSize: 15, color: "#27272a", lineHeight: 1.8 }}>
                  People with ADHD and attention difficulties regularly experience breakdowns in focus — not just from distraction, but from the cognitive cost of managing distraction itself. Our research found that users rationalize phone use as a logical response to mental fatigue: one participant described phone-checking as a way to cope when he felt his brain had hit "diminishing returns." This behavior is self-reinforcing: taking a break erases working memory context, making re-entry feel so costly that users avoid resuming work altogether. Existing tools like OPAL are valued not for blocking access, but for introducing <em>friction</em> — a brief pause that prompts self-reflection. Yet these tools are easily bypassed, and none address the underlying stress or cognitive load driving the behavior.
                </p>
              </Card>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                <Card>
                  <SectionLabel>People Affected</SectionLabel>
                  <p style={{ margin: 0, fontSize: 15, color: "#27272a", lineHeight: 1.7 }}>
                    <strong>Primary:</strong> Individuals with ADHD or attention difficulties — students, professionals, and knowledge workers who depend on sustained focus.
                  </p>
                  <p style={{ margin: "10px 0 0", fontSize: 15, color: "#27272a", lineHeight: 1.7 }}>
                    <strong>Secondary:</strong> Employers, educators, therapists, and coaches who support these individuals and are affected by their productivity and wellbeing outcomes.
                  </p>
                </Card>
                <Card>
                  <SectionLabel>Impact</SectionLabel>
                  <p style={{ margin: 0, fontSize: 15, color: "#27272a", lineHeight: 1.7 }}>
                    The inability to sustain focus leads to chronic stress, reduced output, and a persistent sense of failure. Because the connection between phone habits and stress is invisible in real time, users cannot make informed behavioral changes — leaving them in recurring cycles of distraction, guilt, and avoidance.
                  </p>
                </Card>
              </div>

              <div style={{ background: "#18181b", borderRadius: 12, padding: 32, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#71717a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>How Might We</div>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#fafafa", lineHeight: 1.6, maxWidth: 660, marginLeft: "auto", marginRight: "auto" }}>
                  "How might we help people with attention difficulties recognize the real-time relationship between their phone habits and their stress — so they can make more intentional choices throughout the day?"
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      <div style={{ borderTop: "1px solid #e4e4e7", padding: "20px 24px", textAlign: "center", background: "#fff" }}>
        <span style={{ fontSize: 13, color: "#a1a1aa" }}>INZONE · DES 15 · Meshal Alothra, Rayyan Ali, Aryan Nagpal</span>
      </div>
    </div>
  );
}
