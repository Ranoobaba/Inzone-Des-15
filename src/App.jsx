import { useState, useRef, useCallback } from "react";

/* ═══════════════════════════════════ DATA ═══════════════════════════════════ */

const NAV = [
  { label: "Overview", group: "foundation" },
  { label: "Research Plan", group: "foundation" },
  { label: "Interviews", group: "foundation" },
  { label: "Affinity Diagram", group: "foundation" },
  { label: "Insights", group: "foundation" },
  { label: "Problem Statement", group: "foundation" },
  { label: "Brainstorming", group: "prototyping" },
  { label: "Lo-fi Prototypes", group: "prototyping" },
  { label: "Hi-fi Prototypes", group: "prototyping" },
];

const team = [
  { name: "Meshal Alothra", initials: "MA", role: "Research & Synthesis" },
  { name: "Rayyan Ali", initials: "RA", role: "Interviews & Design" },
  { name: "Aryan Nagpal", initials: "AN", role: "Interviews & Analysis" },
];

const memberColorsRaw = {
  RA: { bg: "#dbeafe", border: "#93c5fd", text: "#1e3a5f" },
  MA: { bg: "#ede9fe", border: "#c4b5fd", text: "#3b1f7e" },
  AN: { bg: "#fed7aa", border: "#fdba74", text: "#7c2d12" },
};

const affinityNotes = [
  { id: 1, text: "\"Cognitively taxing tasks drain me\"", theme: "Rationalized Distraction", by: "RA", x: 40, y: 75, r: -2 },
  { id: 2, text: "Phone as a rational escape hatch", theme: "Rationalized Distraction", by: "MA", x: 220, y: 65, r: 1.5 },
  { id: 3, text: "Diminishing returns justification", theme: "Rationalized Distraction", by: "AN", x: 55, y: 195, r: -1 },
  { id: 4, text: "Avoidance framed as self-care", theme: "Rationalized Distraction", by: "RA", x: 235, y: 185, r: 2 },
  { id: 5, text: "6–8 sec OPAL delay works", theme: "Friction as Key Mechanism", by: "RA", x: 530, y: 70, r: 1 },
  { id: 6, text: "Hard blocks feel punishing", theme: "Friction as Key Mechanism", by: "MA", x: 710, y: 60, r: -1.5 },
  { id: 7, text: "Puzzles > passive timers", theme: "Friction as Key Mechanism", by: "AN", x: 545, y: 190, r: 2.5 },
  { id: 8, text: "Pause enables self-reflection", theme: "Friction as Key Mechanism", by: "RA", x: 725, y: 180, r: -0.5 },
  { id: 9, text: "\"Working memory erased\"", theme: "Re-entry Cost", by: "MA", x: 40, y: 385, r: -1.5 },
  { id: 10, text: "Break → restart barrier", theme: "Re-entry Cost", by: "AN", x: 220, y: 375, r: 2 },
  { id: 11, text: "Context loss is painful", theme: "Re-entry Cost", by: "RA", x: 55, y: 500, r: 0.5 },
  { id: 12, text: "Long sessions hard to resume", theme: "Re-entry Cost", by: "MA", x: 235, y: 490, r: -2.5 },
  { id: 13, text: "Stress noticed after the fact", theme: "Retrospective Awareness", by: "AN", x: 530, y: 380, r: 1.5 },
  { id: 14, text: "Others notice before self", theme: "Retrospective Awareness", by: "RA", x: 710, y: 370, r: -1 },
  { id: 15, text: "No real-time internal signal", theme: "Retrospective Awareness", by: "MA", x: 545, y: 495, r: 2 },
  { id: 16, text: "Patterns felt but not captured", theme: "Retrospective Awareness", by: "AN", x: 725, y: 485, r: -0.5 },
];

const interviewees = [
  {
    interviewer: "Rayyan Ali", participant: "Muhammed", status: "complete",
    background: "Berkeley CS & History graduate. Currently job-hopping and building projects. Enjoys reading and crime novels. Has ADHD and experiences significant attention and focus challenges.",
    responses: [
      { q: "Walk me through the last time you tried to focus on something important.", a: "Attended a YC hackathon and built a project. Struggled to focus for most of it — but because he genuinely enjoyed the problem, he sustained 5 hours of work. Intrinsic motivation was the primary driver of sustained attention.", breakdown: "Focus is highly contingent on interest level. When a task feels mandatory rather than engaging, focus collapses quickly regardless of environment." },
      { q: "When you pick up your phone during a focus session, what triggers that?", a: "Frames phone use as rational: \"cognitively taxing tasks actively drain\" his capacity. Justifies checking his phone because he believes he won't be productive anyway — feels he's hit a point of diminishing returns.", breakdown: "Users rationalize distraction as logical, making external intervention feel patronizing unless it mirrors the user's own internal reasoning." },
      { q: "Have you tried any apps or tools to manage distraction?", a: "Uses OPAL to set app time limits. Found it useful but notes it's easy to disable. Values the 6–8 second delay most: \"How badly do I want this, and am I okay with this tradeoff?\"", breakdown: "Friction — not blocking — is the effective mechanism. A hard block feels controlling; a deliberate pause prompts self-reflection." },
      { q: "How do you know when you're stressed or overwhelmed?", a: "Acts out of character. Because he's naturally optimistic, noticing negative thoughts signals something is wrong. People around him notice before he does.", breakdown: "Stress awareness is often socially mediated and retrospective — not real-time or self-generated." },
      { q: "Have you ever tried tracking your mood or stress?", a: "Has never formally tracked. Notices his own patterns through lived experience but has no systematic method for capturing or acting on them.", breakdown: "High self-awareness doesn't translate to actionable data — patterns are felt but not captured or usable." },
      { q: "Is there a moment in your day where focus just falls apart?", a: "After a long session, taking a break feels like his \"working memory was erased.\" The thought of the effort needed to rebuild context deters him from starting again.", breakdown: "Re-entry cost after breaks is a major hidden barrier — the psychological toll of rebuilding mental context prevents restart." },
      { q: "What would a tool need to do — or avoid — to fit into your life?", a: "\"Avoid a system that forces me to change drastically.\" Wants OPAL to add a puzzle or cognitively taxing challenge instead of a simple timer — something that makes phone access feel earned rather than just delayed.", breakdown: "Passive timers are ignored; active challenges require genuine decision-making and are harder to rationalize away." },
      { q: "Anything about your experience people wouldn't think to ask?", a: "\"Why do I do things.\" Suggests that the motivational layer beneath behavior is consistently overlooked by productivity tools.", breakdown: "Current tools address surface behavior but rarely address the underlying motivation — a consistent gap in existing solutions." },
    ],
    observations: [ "Touches his hair frequently during conversation — a possible physical indicator of cognitive load or social discomfort.", "Avoids direct eye contact while speaking — may reflect internal processing style, relevant to how feedback should be delivered (ambient, non-confrontational)." ],
  },
  {
    interviewer: "Meshal Alothra", participant: "Hamza", status: "complete",
    background: "Hamza is a junior at UC Berkeley from Jeddah, Saudi Arabia, studying psychology and data science. In addition to managing a demanding academic workload, he is a Taekwondo champion and competes on the university team.",
    responses: [
      { q: "Tell me a bit about yourself and what your typical day looks like in terms of school and work.", a: "I'm a junior at UC Berkeley from Saudi Arabia studying psychology and data science. My days are split between classes, studying, hobbies, and sports. I stay busy, and most of my academic and personal tasks involve using my phone or laptop.", breakdown: "Participant balances academics, hobbies, and athletics, creating a full schedule. Digital devices are central to both productivity and leisure, making it hard to disconnect." },
      { q: "How often are you using electronic devices when you're studying or working?", a: "Almost all the time — pretty much everything except sports involves my laptop or phone.", breakdown: "Device use is unavoidable for school and daily tasks. Any change would need to work within device use, not eliminate it." },
      { q: "How would you describe your relationship with digital devices overall?", a: "It started as something I used when I was bored, but it became a habit. Now it's the first thing I check when I wake up. It feels like a comfort space, but I don't like how dependent I've become.", breakdown: "There's comfort and convenience, but also growing awareness of dependency. The relationship feels habitual rather than intentional." },
      { q: "Do you like your current relationship with social media, and if not, what is one thing you wish you could change about it?", a: "I mostly use Instagram. I don't like my current relationship with it — I spend too much time on my phone. I wish I could reduce my reliance and better control the content I see.", breakdown: "Social media is both entertainment and distraction. Participant wants moderation and more control over exposure to content." },
      { q: "If you had to estimate, how much of your day involves digital devices and social media?", a: "Around five to six hours a day.", breakdown: "Usage is consistently high, forming a significant portion of daily life." },
      { q: "Does social media ever get in the way of your work? If so, how?", a: "Yes. It's not part of my work, so when I'm on it, I'm not being productive.", breakdown: "Distraction is mainly time loss rather than anxiety. Social media directly competes with focused work time." },
      { q: "What, if anything, would you like to change about your relationship with your phone and social media?", a: "I want to be less reliant on it and better regulate how much I use it and what content I consume.", breakdown: "Participant wants both usage limits and content filtering — not just less time, but healthier engagement." },
      { q: "Would you say that you feel anxiety when using electronic devices like phones or computers, and if so, why?", a: "No, not really.", breakdown: "There's no direct anxiety during use; the concern is more about dependency and productivity." },
      { q: "Is there anything we didn't talk about today that you would like to share before we wrap up?", a: "No.", breakdown: "No additional concerns beyond device dependency and moderation." },
    ],
    observations: [ "What really stands out is that his relationship with his phone isn't toxic, it's just habit. It's not that he hates using it or feels anxious while scrolling — it has simply become the default. When he's bored, tired, or just waking up, his phone is the first thing he reaches for without even thinking." ],
  },
  {
    interviewer: "Aryan Nagpal", participant: "Gabriel Ryan Turner", status: "complete",
    background: "First-year mechanical engineering student at UC Berkeley, from Orange County, California, exploring a specialization in medical technology.",
    responses: [
      { q: "Tell me a bit about yourself and what your typical day looks like in terms of school and work.", a: "I'm from Millville, Kentucky, and I'm studying industrial engineering — I'm a freshman. I'm working on different AI projects for a startup, meeting with teammates on a bi-weekly basis and using tools like VS Code and Render. On top of that I'm maintaining my schoolwork and constantly checking emails. I procrastinate a little, so my days can feel pretty sporadic.", breakdown: "Participant juggles a demanding academic schedule with an early-stage startup, producing a high and sometimes chaotic cognitive load. Digital tools are central to both domains, making it hard to find clear separation between \"on\" and \"off\" time." },
      { q: "How often are you using electronic devices when you're studying or working?", a: "All the time — I'm pretty much attached to my computer.", breakdown: "Work and study are effectively inseparable from device use. Any intervention has to acknowledge that \"less screen\" is not realistic; instead, support must live within the same devices that create the overload." },
      { q: "How would you describe your relationship with digital devices overall?", a: "Generally pretty positive — they allow me to do quite a lot. I'd like to be able to separate myself a little more, but overall it's good.", breakdown: "There is a tension between appreciation and overreliance: devices are empowering but also hard to step away from." },
      { q: "Do you like your current relationship with social media, and if not, what is one thing you wish you could change about it?", a: "I use Instagram and LinkedIn, and we do a lot of organizing through Discord. I think my relationship with social media is okay, but I spend too much time on my phone. I've looked at some apps to limit screen time, but not much has really worked. I wish that I could just, like, put out notifications — or have a platform that could lock things down and send a status across different platforms when I'm trying not to be on my phone.", breakdown: "Social media is both social infrastructure (Discord for coordination) and a source of overuse. Previous attempts with screen-time tools have failed to stick." },
      { q: "If you had to estimate, how much of your day involves digital devices and social media?", a: "On a good day, maybe around 3 hours. On a bad day, it can feel like the whole day.", breakdown: "Usage swings dramatically from moderate to extreme, indicating weak or unstable boundaries." },
      { q: "Does social media ever get in the way of your work? If so, how?", a: "Yes, it does. It's not always just doomscrolling — it's also people messaging me and feeling obligated to reply.", breakdown: "Distraction isn't only passive scrolling; it's also the social obligation layer of messaging." },
      { q: "What, if anything, would you like to change about your relationship with your phone and social media?", a: "I wish I could just put out notifications or have a platform that could lock things down and send a status across different platforms — something that tells people when I'm trying not to be on my phone.", breakdown: "Participant wants stronger friction around access and cross-platform social signaling." },
      { q: "Would you say that you feel anxiety when using electronic devices like phones or computers, and if so, why?", a: "I don't really feel anxious while I'm using them, but I do feel anxious when I know I've spent too much time on them.", breakdown: "Emotional cost shows up as guilt or anxiety after overuse, not as a real-time signal." },
      { q: "Is there anything we didn't talk about today that you would like to share before we wrap up?", a: "No.", breakdown: "Participant did not have additional comments beyond what was already discussed." },
    ],
    observations: [ "Relies heavily on Discord for organizing school and startup work, reinforcing that social and work communications are intertwined.", "Describes himself as \"attached\" to his computer, suggesting that focus and distraction both occur on the same primary device.", "Has explored screen time limiting apps but abandoned them, indicating that existing tools feel either too blunt or too easy to bypass." ],
  },
];

const themeLabels = [
  { text: "Rationalized Distraction", x: 30, y: 30 },
  { text: "Friction as Key Mechanism", x: 520, y: 30 },
  { text: "Re-entry Cost", x: 30, y: 340 },
  { text: "Retrospective Awareness", x: 520, y: 340 },
];

const insights = [
  { title: "Distraction is rationalized, not impulsive", body: "Users don't mindlessly reach for their phones — they construct logical justifications for doing so. Interventions that treat distraction as purely impulsive (like hard blocks) will feel patronizing and be bypassed.", icon: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" },
  { title: "Friction is more effective than restriction", body: "The most valued feature was not blocking apps, but the 6–8 second delay creating self-reflection. Users want a pause that asks \"do you really want this?\" rather than a wall that says \"you can't have this.\"", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Re-entry cost is a hidden barrier", body: "After breaks, users felt their \"working memory was erased.\" The mental effort to rebuild context was so high it deterred them from resuming work entirely — a significant and underserved pain point.", icon: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" },
  { title: "Stress awareness is retrospective", body: "Users rarely recognize they are stressed in the moment. Stress is identified after the fact — often by other people noticing behavioral changes before the user does.", icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { title: "Tools address behavior but ignore motivation", body: "Productivity tools track surface metrics but never ask \"why.\" Understanding the motivational layer beneath behavior is critical for any intervention to feel relevant and respectful.", icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" },
];

const brainstormSolutions = [
  { tag: "Most Likely to Work", tagColor: "from-emerald-500 to-teal-600", tagBg: "bg-emerald-50 text-emerald-700 border border-emerald-200", title: "Heartlock", description: "A full end-to-end app workflow that lets users choose apps to monitor, set pain thresholds and game types, then presents puzzle-based friction before opening stress-inducing apps. Includes leaderboards, charity donation incentives, and smart plans — making the entire experience useful and engaging." },
  { tag: "Most Likely to Delight", tagColor: "from-amber-500 to-orange-600", tagBg: "bg-amber-50 text-amber-700 border border-amber-200", title: "Stress Lock", description: "A notification-based system that creates gentle friction without enforcing habit change directly. It notifies users when stress-inducing app usage is detected and lets them set personalized incentive thresholds — making the choice to disengage feel self-driven rather than imposed." },
  { tag: "Dark Horse", tagColor: "from-fuchsia-500 to-purple-600", tagBg: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200", title: "Stress Monitoring Band", description: "A wearable cuff that builds on existing heart-rate monitoring technology (like Apple Watch) to provide real-time, personalized stress detection. It takes into account individual user data to offer proactive stress alerts before the user consciously registers overwhelm." },
];

const lofiPrototypes = [
  { idea: "Most Likely to Delight", ideaColor: "bg-amber-50 text-amber-700 border-amber-200", accentColor: "from-amber-500 to-orange-500", title: "Stress Lock", question: "How might we limit the stress that our users face without directly enforcing a change of habit, but rather helping the user towards making the healthier habit themselves?", description: "A lo-fi sketch of a notification-based system that alerts users when they are spending too long on stressful apps. Users set their own preferences for how strong or gentle the incentives are, keeping the experience self-directed.", imageUrl: "/lofi-scan-1.png" },
  { idea: "Most Likely to Work", ideaColor: "bg-emerald-50 text-emerald-700 border-emerald-200", accentColor: "from-emerald-500 to-teal-500", title: "Heartlock", question: "How does the full end-to-end workflow look like, and how can we make the app actually useful for the user?", description: "A lo-fi paper sketch mapping the complete user journey: choosing apps to monitor, setting pain thresholds and game types, solving puzzles before opening stress apps, leaderboard progression, charity donation incentives for hitting goals, and smart plans generated by the system.", imageUrl: "/lofi-inzone-ultra.png" },
  { idea: "Dark Horse", ideaColor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", accentColor: "from-fuchsia-500 to-purple-500", title: "Stress Monitoring Band", question: "How can we work off of current stress relief devices?", description: "A lo-fi sketch of a wearable cuff that monitors stress through biometric data. The prototype shows the physical form factor, the companion app interface, and how personalized stress data is surfaced to the user in real time.", imageUrl: "/lofi-scan-2.png" },
];

const hifiPrototypes = [
  { idea: "Most Likely to Delight", ideaColor: "bg-amber-50 text-amber-700 border-amber-200", accentColor: "from-amber-500 to-orange-500", title: "Stress Lock", question: "How might we limit the stress that our users face without directly enforcing a change of habit, but rather helping the user towards making the healthier habit themselves?", description: "We create notifiers for the user so that they feel that same incentive to not stay too long on a stressful app, and make the incentive stronger or weaker with the user's preferences. The system respects user autonomy while providing gentle, customizable nudges toward healthier behavior.", liveUrl: "https://heartlocker2.netlify.app", risk: "The notification system needs to strike a precise balance between being noticeable enough to work and subtle enough not to annoy. If the friction is too weak, users ignore it; if too strong, it feels like the hard blocks users already reject." },
  { idea: "Most Likely to Work", ideaColor: "bg-emerald-50 text-emerald-700 border-emerald-200", accentColor: "from-emerald-500 to-teal-500", title: "Heartlock", question: "How can we make this product attractive to our users when the overall assistance is with something very personal like someone's stress?", description: "We make the assistance indirect, embedding games within each app that users have identified as stress-inducing. The games serve as a stress reliever delivered at an optimal time — right when the user is about to enter a high-stress digital environment. The full workflow includes app selection, threshold configuration, puzzle gates, leaderboards, and charity donation incentives.", liveUrl: "https://heartlocker.netlify.app", risk: "Embedding games within app-opening flows risks becoming a distraction in itself. If the puzzles are too easy they lose friction value; if too hard they frustrate users. The gamification (leaderboards, donations) could also shift motivation from intrinsic self-care to extrinsic competition, undermining the core goal." },
  { idea: "Dark Horse", ideaColor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", accentColor: "from-fuchsia-500 to-purple-500", title: "Stress Monitoring Band", question: "How can we work off of current stress relief devices?", description: "Working off the heart rate monitoring capabilities of Apple Watches and similar wearables, we designed a cuff that fits around the arm and acts as a dedicated stress monitoring device. It takes into account important personalized information about each user to provide proactive, real-time stress alerts.", liveUrl: "https://heartlocker3.netlify.app", risk: "Relies on biometric accuracy that varies significantly across individuals — heart rate alone is an unreliable proxy for stress. The dedicated hardware adds cost and friction to adoption, and users may find wearing an extra device impractical compared to leveraging sensors already on their wrist." },
];

/* ═══════════════════════════════════ COMPONENTS ═══════════════════════════════════ */

function Badge({ children, className = "" }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${className}`}>{children}</span>;
}

function Card({ children, className = "", hover = false }) {
  return <div className={`rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${hover ? "card-hover" : ""} ${className}`}>{children}</div>;
}

function GlowCard({ children, className = "", gradient = "from-brand-500/10 to-violet-500/10" }) {
  return (
    <div className={`relative group ${className}`}>
      <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`} />
      <div className="relative rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">{children}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400">{children}</div>;
}

function SectionHeading({ title, subtitle, badge }) {
  return (
    <div className="mb-10 animate-fade-in">
      {badge && <Badge className="bg-brand-50 text-brand-600 border border-brand-200 mb-3">{badge}</Badge>}
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">{title}</h2>
      {subtitle && <p className="mt-2 text-base text-zinc-500 max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function ImageSlot({ src, alt, className = "" }) {
  if (!src) return null;
  return <img src={src} alt={alt} className={`w-full rounded-xl border border-zinc-200 object-cover ${className}`} />;
}

function StatNumber({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-extrabold text-white">{value}</div>
      <div className="text-xs sm:text-sm text-white/60 mt-2 font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════ APP ═══════════════════════════════════ */

export default function App() {
  const [active, setActive] = useState("Overview");
  const [openInterview, setOpenInterview] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    dragOffset.current = { x: cx - notePos[id].x - rect.left, y: cy - notePos[id].y - rect.top };
    setDragId(id);
  };
  const onBoardMove = useCallback((e) => {
    if (dragId === null) return;
    const rect = boardRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    setNotePos(prev => ({ ...prev, [dragId]: { x: cx - rect.left - dragOffset.current.x, y: cy - rect.top - dragOffset.current.y } }));
  }, [dragId]);
  const onBoardUp = useCallback(() => setDragId(null), []);

  const navigate = (label) => { setActive(label); setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 antialiased">

      {/* ─── Header ─── */}
      <header className="glass sticky top-0 z-50 border-b border-zinc-200/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button onClick={() => navigate("Overview")} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-700 to-violet-600 shadow-lg shadow-brand-500/25">
              <span className="text-xs font-extrabold text-white tracking-tight">IN</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-zinc-900 group-hover:text-brand-700 transition-colors">INZONE</span>
              <span className="text-zinc-300 mx-2">|</span>
              <span className="text-xs text-zinc-400 font-medium">DES 15</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((n, i) => {
              const divider = i > 0 && NAV[i - 1].group !== n.group;
              return (
                <div key={n.label} className="flex items-center">
                  {divider && <div className="mx-1.5 h-4 w-px bg-zinc-200" />}
                  <button onClick={() => navigate(n.label)} className={`relative rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all cursor-pointer ${active === n.label ? "text-brand-700" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100/80"}`}>
                    {n.label}
                    {active === n.label && <div className="absolute -bottom-[9px] left-2 right-2 h-[2px] rounded-full bg-brand-600" />}
                  </button>
                </div>
              );
            })}
          </nav>

          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="lg:hidden rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 cursor-pointer">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
        {mobileNavOpen && (
          <div className="lg:hidden border-t border-zinc-100 bg-white px-4 py-3 shadow-lg">
            {NAV.map(n => (
              <button key={n.label} onClick={() => navigate(n.label)} className={`block w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${active === n.label ? "bg-brand-50 text-brand-700" : "text-zinc-600 hover:bg-zinc-50"}`}>{n.label}</button>
            ))}
          </div>
        )}
      </header>

      {/* ═══════════ OVERVIEW HERO (full-width, outside max-w container) ═══════════ */}
      {active === "Overview" && (
        <div className="relative overflow-hidden bg-[#2d0a4e] text-white animate-fade-in">
          <div className="absolute top-[-150px] right-[-50px] w-[600px] h-[600px] rounded-full bg-purple-500/30 blur-[120px]" />
          <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-violet-400/20 blur-[100px]" />
          <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 sm:pt-36 sm:pb-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[12px] font-medium text-white/80 tracking-wide">Needfinding + Prototyping · DES 15</span>
            </div>
            <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05] text-white">INZONE</h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-white/75 mb-12">
              Understanding how people with ADHD manage focus and stress — and designing solutions that work <em className="text-white not-italic font-semibold">with</em> their habits, not against them.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 max-w-lg sm:max-w-2xl mx-auto">
              <StatNumber value="3" label="Interviews" />
              <StatNumber value="5" label="Insights" />
              <StatNumber value="4" label="Themes" />
              <StatNumber value="3" label="Prototypes" />
            </div>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => navigate("Research Plan")} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-purple-800 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/40 hover:scale-[1.03] transition-all cursor-pointer">
                Explore Our Research
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              <button onClick={() => navigate("Hi-fi Prototypes")} className="inline-flex items-center gap-2 rounded-xl bg-white/15 border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/25 transition-all cursor-pointer">
                View Prototypes
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 ${active === "Overview" ? "pt-0 sm:pt-0" : ""}`} key={active}>

        {/* ═══════════ OVERVIEW ═══════════ */}
        {active === "Overview" && (
          <div className="space-y-10 animate-fade-in">

            <div className="text-center max-w-3xl mx-auto pt-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">Why This Research Matters</h2>
              <p className="text-base sm:text-lg text-zinc-500 leading-relaxed">
                Each of us has personally experienced the frustration of losing focus — and turning to our phones without fully understanding why. We wanted to explore this deeply familiar yet poorly understood space.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 to-violet-600 px-8 py-8 sm:px-12 sm:py-10 shadow-xl shadow-brand-500/15 text-center">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,transparent_50%)]" />
              <div className="relative">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3">Selected Research Question</div>
                <p className="text-lg sm:text-xl font-semibold leading-relaxed text-white max-w-3xl mx-auto">&ldquo;How do people with ADHD manage stress and focus, and how does phone and screen use affect those experiences throughout the day?&rdquo;</p>
              </div>
            </div>

            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-zinc-800">Research Questions We Considered</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {["What is the relationship between daily screen time and academic productivity among college students with ADHD?", "What coping strategies do people with attention difficulties use to manage digital distractions, and which ones are most effective?", "How does the frequency of phone notifications impact stress levels and emotional regulation in individuals with ADHD?"].map((rq, i) => (
                  <GlowCard key={i} className={`animate-fade-in-slow stagger-${i + 1}`}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-violet-600 text-xs font-bold text-white mb-4 shadow-sm">{i + 1}</span>
                    <p className="text-sm text-zinc-600 leading-relaxed">{rq}</p>
                  </GlowCard>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card hover className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-100/40 blur-2xl" />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-violet-600 mb-4 shadow-lg shadow-brand-500/20">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                  </div>
                  <SectionLabel>Problem Space</SectionLabel>
                  <p className="text-[15px] leading-relaxed text-zinc-600 mt-2">People with ADHD experience elevated stress from frequent digital distractions — often without realizing the connection between their habits and their mental state.</p>
                </div>
              </Card>
              <Card hover className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-violet-100/40 blur-2xl" />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-violet-600 mb-4 shadow-lg shadow-brand-500/20">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                  </div>
                  <SectionLabel>Team</SectionLabel>
                  <div className="mt-3 space-y-2.5">
                    {team.map(t => (
                      <div key={t.name} className="flex items-center gap-3 rounded-xl bg-zinc-50/80 border border-zinc-100 px-3 py-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-700 to-violet-600 text-[11px] font-bold text-white shadow-sm">{t.initials}</div>
                        <div>
                          <div className="text-sm font-semibold text-zinc-800">{t.name}</div>
                          <div className="text-[11px] text-zinc-400">{t.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ═══════════ RESEARCH PLAN ═══════════ */}
        {active === "Research Plan" && (
          <div className="animate-fade-in">
            <SectionHeading title="Research Plan" subtitle="Participant strategy, interview structure, and data collection approach." badge="Phase 1" />
            <div className="space-y-6">
              <Card>
                <SectionLabel>User Types</SectionLabel>
                <div className="mt-4 space-y-3">
                  {[["Everyday User", "College student with diagnosed ADHD who uses their phone regularly for school"], ["Extreme User", "Someone who has tried many productivity systems and tools obsessively"], ["Low-Tech User", "Deliberately analog — grayscale phone, minimal apps, paper planner"], ["Clinical Stakeholder", "Therapist or coach who works with ADHD patients"], ["Non-Diagnosed", "High-stress user without a diagnosis — reveals what is universal vs. ADHD-specific"]].map(([label, desc]) => (
                    <div key={label} className="flex gap-3 items-start">
                      <Badge className="bg-zinc-100 text-zinc-600 border border-zinc-200 shrink-0">{label}</Badge>
                      <span className="text-sm text-zinc-500 leading-relaxed pt-0.5">{desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <SectionLabel>Interview Structure — 10 Minutes</SectionLabel>
                <div className="mt-4 divide-y divide-zinc-100">
                  {[["1 min", "Warm-up", "Tell me about yourself and how you typically spend your day."], ["4 min", "Phone & Focus", "Walk me through the last time you tried to focus. What triggered picking up your phone?"], ["3 min", "Stress & Awareness", "How do you know when you're stressed? Have you ever tracked your mood or stress?"], ["2 min", "Needs & Wrap-up", "When does focus fall apart? What would a tool need to do — or avoid — to fit into your life?"]].map(([time, title, desc]) => (
                    <div key={title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-14 shrink-0"><span className="inline-flex items-center justify-center rounded-md bg-brand-50 text-brand-600 text-[11px] font-bold px-2 py-0.5 border border-brand-100">{time}</span></div>
                      <div><div className="text-sm font-semibold text-zinc-800">{title}</div><div className="mt-0.5 text-sm text-zinc-500 leading-relaxed">{desc}</div></div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <SectionLabel>What to Capture</SectionLabel>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {["Phone home screen layout — apps, folders, notification settings", "Any physical tools in use (planners, sticky notes, fidget objects)", "Moments of context-switching or phone pick-up during observation", "Direct quotes, especially surprising or contradictory ones", "Workarounds users invented themselves", "Tools they know about but don't use — and why"].map((item, i) => (
                    <div key={i} className="flex gap-2.5 items-start rounded-lg bg-zinc-50/80 border border-zinc-100 px-3 py-2.5">
                      <span className="text-brand-400 mt-0.5 shrink-0">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span className="text-[13px] text-zinc-600 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ═══════════ INTERVIEWS ═══════════ */}
        {active === "Interviews" && (
          <div className="animate-fade-in">
            <SectionHeading title="Interviews" subtitle="One interview per team member. ~10 minutes, semi-structured, with in-context observations." badge="Phase 1" />
            <div className="mb-8 flex gap-1 border-b border-zinc-200">
              {interviewees.map((iv, idx) => (
                <button key={idx} onClick={() => setOpenInterview(idx)} className={`relative px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${openInterview === idx ? "text-brand-700" : "text-zinc-400 hover:text-zinc-600"}`}>
                  {iv.participant}
                  {iv.status === "complete" && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />}
                  {openInterview === idx && <div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-brand-600" />}
                </button>
              ))}
            </div>
            {interviewees[openInterview] && (() => {
              const iv = interviewees[openInterview];
              return (
                <div className="space-y-4 animate-fade-in" key={openInterview}>
                  <Card>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div><SectionLabel>Interviewer</SectionLabel><div className="text-[15px] font-semibold text-zinc-800">{iv.interviewer}</div></div>
                      <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200">Complete</Badge>
                    </div>
                    <div className="mt-5 border-t border-zinc-100 pt-5"><SectionLabel>Participant Background</SectionLabel><p className="text-[15px] leading-relaxed text-zinc-600">{iv.background}</p></div>
                  </Card>
                  <div className="space-y-3">
                    {iv.responses.map((r, i) => (
                      <Card key={i} hover>
                        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-300 mb-2">Question {i + 1}</div>
                        <p className="text-sm font-semibold text-zinc-800 leading-snug mb-2">{r.q}</p>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-4">{r.a}</p>
                        <div className="rounded-xl bg-gradient-to-r from-zinc-50 to-zinc-50/50 border border-zinc-200/60 px-4 py-3 flex gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-500 shrink-0 pt-0.5">Insight</span>
                          <span className="text-[13px] text-zinc-600 leading-relaxed">{r.breakdown}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                  {iv.observations.length > 0 && (
                    <Card>
                      <SectionLabel>Field Observations</SectionLabel>
                      {iv.participant === "Gabriel Ryan Turner" ? (
                        <div className="mt-3">
                          <audio controls src="/Call with Gabriel Turner.m4a" className="w-full max-w-md h-10" />
                          <div className="mt-4 rounded-xl bg-zinc-50 border border-zinc-200/60 p-4">
                            <p className="text-[13px] font-semibold text-zinc-800 mb-1">Breakdown</p>
                            <p className="text-[13px] text-zinc-500 leading-relaxed">From the call: Gabriel relies heavily on Discord for school and startup coordination. He describes being &quot;attached&quot; to his computer — focus and distraction both happen on the same device. He has tried screen-time apps but stopped; existing tools feel too blunt or too easy to bypass.</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mt-3 space-y-2">
                            {iv.observations.map((o, idx) => (
                              <div key={idx} className="flex gap-3 items-start"><span className="text-zinc-300 shrink-0 mt-0.5">—</span><span className="text-sm text-zinc-500 leading-relaxed">{o}</span></div>
                            ))}
                          </div>
                          <div className="mt-6 border-t border-zinc-100 pt-6">
                            <SectionLabel>Photo Documentation</SectionLabel>
                            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200">
                              <div className="bg-zinc-50 flex items-center justify-center min-h-[220px] relative">
                                <img src={iv.participant === "Hamza" ? "/hamza-interview.png" : "https://i.imgur.com/WqesFlP.jpeg"} alt={iv.participant === "Hamza" ? "Hamza interview" : "Participant observation"} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} className="w-full max-h-[340px] object-cover block" />
                                <div className="hidden flex-col items-center justify-center gap-2 p-10 text-zinc-400 text-[13px] text-center"><span className="text-3xl">+</span><span>Replace with hosted image URL</span></div>
                              </div>
                              <div className="border-t border-zinc-100 bg-white px-4 py-3">
                                <p className="text-[13px] font-semibold text-zinc-800 mb-1">{iv.participant === "Hamza" ? "Remote video call between Meshal and Hamza" : "Participant touches hair and avoids eye contact mid-response"}</p>
                                <p className="text-[13px] text-zinc-500 leading-relaxed">{iv.participant === "Hamza" ? <><strong>Opportunity:</strong> Any intervention must live within existing device habits rather than pull users away from them.</> : <><strong>Opportunity:</strong> Stress manifests physically before users consciously register it — pointing to ambient, body-signal-based detection.</>}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </Card>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════════ AFFINITY DIAGRAM ═══════════ */}
        {active === "Affinity Diagram" && (
          <div className="animate-fade-in">
            <SectionHeading title="Affinity Diagram" subtitle="Drag sticky notes to rearrange. Each note is color-coded by team member." badge="Synthesis" />
            <div className="mb-4 flex flex-wrap gap-4">
              {[{ initials: "RA", name: "Rayyan Ali" }, { initials: "MA", name: "Meshal Alothra" }, { initials: "AN", name: "Aryan Nagpal" }].map(m => (
                <div key={m.initials} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-sm" style={{ background: memberColorsRaw[m.initials].bg, border: `2px solid ${memberColorsRaw[m.initials].border}` }} />
                  <span className="text-[13px] text-zinc-500">{m.name}</span>
                </div>
              ))}
            </div>
            <div ref={boardRef} onMouseMove={onBoardMove} onMouseUp={onBoardUp} onMouseLeave={onBoardUp} onTouchMove={onBoardMove} onTouchEnd={onBoardUp}
              className="relative w-full rounded-2xl border border-sky-200/80 overflow-hidden shadow-inner"
              style={{ height: 640, background: "linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%)", cursor: dragId ? "grabbing" : "default", touchAction: "none", backgroundImage: "radial-gradient(circle, #cbd5e1 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}>
              <div className="absolute left-1/2 top-[30px] bottom-[30px] w-px bg-slate-300/30" />
              <div className="absolute top-1/2 left-[30px] right-[30px] h-px bg-slate-300/30" />
              {themeLabels.map(l => (<div key={l.text} className="absolute text-[10px] font-bold text-slate-400 uppercase tracking-wider pointer-events-none select-none" style={{ left: l.x, top: l.y }}>{l.text}</div>))}
              {affinityNotes.map(note => {
                const pos = notePos[note.id]; const c = memberColorsRaw[note.by];
                return (
                  <div key={note.id} onMouseDown={e => onNoteDown(e, note.id)} onTouchStart={e => onNoteDown(e, note.id)}
                    style={{ position: "absolute", left: pos.x, top: pos.y, width: 155, minHeight: 90, background: c.bg, border: `2px solid ${c.border}`, borderRadius: 8, padding: "10px 12px", cursor: dragId === note.id ? "grabbing" : "grab", transform: `rotate(${note.r}deg)`, boxShadow: dragId === note.id ? "0 8px 24px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.06)", zIndex: dragId === note.id ? 50 : 1, transition: dragId === note.id ? "none" : "box-shadow 0.15s", userSelect: "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, lineHeight: 1.45, color: c.text, fontWeight: 500 }}>{note.text}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c.text, opacity: 0.4, marginTop: 8, alignSelf: "flex-end" }}>{note.by}</span>
                  </div>
                );
              })}
            </div>
            <Card className="mt-6">
              <SectionLabel>Top 3 Takeaways</SectionLabel>
              <div className="mt-4 space-y-4">
                {["Users rationalize distraction as logical — making hard blocks ineffective and friction-based design essential.", "Stress awareness is almost always retrospective — users rarely know they are overwhelmed until after the fact.", "Re-entry cost after breaks is a hidden and underserved pain point — the mental effort to rebuild context prevents people from resuming work."].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-700 to-violet-600 text-xs font-bold text-white shrink-0 shadow-sm">{i + 1}</span>
                    <p className="text-[15px] leading-relaxed text-zinc-600">{text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════ INSIGHTS ═══════════ */}
        {active === "Insights" && (
          <div className="animate-fade-in">
            <SectionHeading title="Key Insights" subtitle="Five main insights about user needs, synthesized from our interviews." badge="Synthesis" />
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <GlowCard key={i} className={`animate-fade-in stagger-${i + 1}`}>
                  <div className="flex gap-5 items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-violet-600 shrink-0 shadow-lg shadow-brand-500/20">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={insight.icon} /></svg>
                    </div>
                    <div>
                      <div className="text-base font-bold text-zinc-800 mb-1.5">{insight.title}</div>
                      <p className="text-sm text-zinc-500 leading-relaxed">{insight.body}</p>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ PROBLEM STATEMENT ═══════════ */}
        {active === "Problem Statement" && (
          <div className="animate-fade-in">
            <SectionHeading title="Problem Statement" subtitle="Synthesized from research findings. No solutions — only the problem." badge="Synthesis" />
            <div className="space-y-6">
              <Card>
                <SectionLabel>Background</SectionLabel>
                <p className="text-[15px] leading-[1.85] text-zinc-600">
                  People with ADHD and attention difficulties regularly experience breakdowns in focus — not just from distraction, but from the cognitive cost of managing distraction itself. Our research found that users rationalize phone use as a logical response to mental fatigue. This behavior is self-reinforcing: taking a break erases working memory context, making re-entry feel so costly that users avoid resuming work altogether. Existing tools like OPAL are valued not for blocking access, but for introducing <em>friction</em> — a brief pause that prompts self-reflection. Yet these tools are easily bypassed, and none address the underlying stress or cognitive load driving the behavior.
                </p>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card hover>
                  <SectionLabel>People Affected</SectionLabel>
                  <p className="text-[15px] leading-relaxed text-zinc-600"><strong className="text-zinc-800">Primary:</strong> Individuals with ADHD or attention difficulties — students, professionals, and knowledge workers.</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-600"><strong className="text-zinc-800">Secondary:</strong> Employers, educators, therapists, and coaches who support them.</p>
                </Card>
                <Card hover>
                  <SectionLabel>Impact</SectionLabel>
                  <p className="text-[15px] leading-relaxed text-zinc-600">The inability to sustain focus leads to chronic stress, reduced output, and a persistent sense of failure. Because the connection between phone habits and stress is invisible in real time, users remain in recurring cycles of distraction, guilt, and avoidance.</p>
                </Card>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-[#2d0a4e] px-8 py-12 text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/25 blur-[100px]" />
                <div className="relative">
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-5">How Might We</div>
                  <p className="mx-auto max-w-2xl text-xl sm:text-2xl font-bold leading-relaxed text-white">&ldquo;How might we help people with attention difficulties recognize the real-time relationship between their phone habits and their stress — so they can make more intentional choices throughout the day?&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ BRAINSTORMING ═══════════ */}
        {active === "Brainstorming" && (
          <div className="animate-fade-in">
            <SectionHeading title="Brainstorming" subtitle="HMW evolution, brainstorm solutions, and the three ideas we chose to prototype." badge="Phase 2" />
            <div className="space-y-8">
              <Card>
                <SectionLabel>Original &ldquo;How Might We...?&rdquo; Statement</SectionLabel>
                <div className="mt-3 rounded-xl bg-zinc-50 border border-zinc-200/60 px-5 py-4 mb-8">
                  <p className="text-[15px] font-medium leading-relaxed text-zinc-600 italic">&ldquo;How might we help people with attention difficulties recognize the real-time relationship between their phone habits and their stress — so they can make more intentional choices throughout the day?&rdquo;</p>
                </div>
                <SectionLabel>&ldquo;How Might We...?&rdquo; Statement After Prototyping</SectionLabel>
                <div className="mt-3 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-700 to-violet-600 px-5 py-4 mb-8 shadow-lg shadow-brand-500/15">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
                  <p className="relative text-[15px] font-medium leading-relaxed text-white">&ldquo;How might we assist our users in lowering their stress levels caused by phone apps like social media platforms, specifically in a way that incentivizes less time on said apps for their own well-being while still making the assistance attractive towards the users?&rdquo;</p>
                </div>
                <SectionLabel>How the Statement Evolved</SectionLabel>
                <p className="mt-3 text-[15px] leading-[1.8] text-zinc-500">
                  Our statement has changed because we are taking a slightly more direct approach with the incentives we have for our users. We are now not only focusing on how we can make this product functional and efficient, but how we can do so without making it a bother towards those we want to attract. We are thinking more from the users' side first. The original statement was about helping users <em className="text-zinc-700">recognize</em> the relationship between phone habits and stress; the evolved statement shifts toward actively <em className="text-zinc-700">assisting</em> them in lowering stress while keeping the product attractive and non-intrusive.
                </p>
              </Card>

              <div>
                <h3 className="text-xl font-bold text-zinc-800 mb-5">Three Solutions from Brainstorming</h3>
                <div className="grid gap-5 sm:grid-cols-3">
                  {brainstormSolutions.map((sol, i) => (
                    <GlowCard key={i} gradient={`${sol.tagColor.replace("from-", "from-").replace("to-", "to-")}`} className={`animate-fade-in-slow stagger-${i + 1}`}>
                      <Badge className={`${sol.tagBg} mb-4`}>{sol.tag}</Badge>
                      <h4 className="text-lg font-bold text-zinc-800 mb-2">{sol.title}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed">{sol.description}</p>
                    </GlowCard>
                  ))}
                </div>
              </div>

              <Card>
                <SectionLabel>Brainstorm Outcome</SectionLabel>
                <p className="text-sm text-zinc-500 mb-3">Our brainstorming session — ideas captured on the whiteboard during our team meeting.</p>
                <div className="mt-3"><ImageSlot src="/brainstorm-whiteboard.png" alt="Our brainstorming session whiteboard" /></div>
              </Card>
            </div>
          </div>
        )}

        {/* ═══════════ LO-FI PROTOTYPES ═══════════ */}
        {active === "Lo-fi Prototypes" && (
          <div className="animate-fade-in">
            <SectionHeading title="Lo-fi Prototypes" subtitle="Paper sketches and wireframes testing our three ideas. Each prototype answers a specific question." badge="Phase 2" />
            <div className="space-y-8">
              <div className="space-y-6">
                {lofiPrototypes.map((proto, i) => (
                  <Card key={i} className={`animate-fade-in-slow stagger-${i + 1}`}>
                    <div className={`flex flex-col sm:flex-row gap-6`}>
                      {proto.imageUrl && <div className="sm:w-1/2"><ImageSlot src={proto.imageUrl} alt={`Lo-fi sketch: ${proto.title}`} className="min-h-[260px]" /></div>}
                      <div className={`${proto.imageUrl ? "sm:w-1/2" : ""} flex flex-col justify-center`}>
                        <Badge className={`${proto.ideaColor} border self-start mb-3`}>Idea: {proto.idea}</Badge>
                        <h3 className="text-xl font-bold text-zinc-800 mb-3">{proto.title}</h3>
                        <div className={`rounded-xl bg-gradient-to-r ${proto.accentColor} p-px mb-4`}>
                          <div className="rounded-[11px] bg-white px-4 py-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 block mb-1">Question Answered</span>
                            <p className="text-sm font-medium text-zinc-700 leading-relaxed">{proto.question}</p>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed">{proto.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-800 mb-5">Reflection Questions</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <GlowCard>
                    <SectionLabel>Reflection 1</SectionLabel>
                    <p className="text-sm font-semibold text-zinc-800 mb-3">What do you like about each prototype?</p>
                    <div className="rounded-xl bg-zinc-50 border border-zinc-200/60 px-4 py-3"><p className="text-sm text-zinc-500 leading-relaxed">Each prototype took a slightly different approach at answering our &ldquo;How Might We&rdquo; question, and each also showed correlation to the feedback we received from interviews. Some had to be whittled down during the brainstorming process, but overall each had important contributions and showed creativity from project members.</p></div>
                  </GlowCard>
                  <GlowCard>
                    <SectionLabel>Reflection 2</SectionLabel>
                    <p className="text-sm font-semibold text-zinc-800 mb-3">What else would you like to explore?</p>
                    <div className="rounded-xl bg-zinc-50 border border-zinc-200/60 px-4 py-3"><p className="text-sm text-zinc-500 leading-relaxed">We would like to explore a slight change in our &ldquo;How Might We...?&rdquo; statement, as our initial statement was more about how we could incentivize our users to be more considerate of their phone usage and stress. Now, after brainstorming and meeting together, the focus seems to have shifted towards not only incentivizing that focus, but helping to enforce it in a gentle and positive way through our product. We will likely be continuing to explore this shifted problem space, and so our statement can be updated to the following: &ldquo;How might we assist our users in lowering their stress levels caused by phone apps like social media platforms, specifically in a way that incentivizes less time on said apps for their own well-being while still making the assistance attractive towards the users?&rdquo;</p></div>
                  </GlowCard>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ HI-FI PROTOTYPES ═══════════ */}
        {active === "Hi-fi Prototypes" && (
          <div className="animate-fade-in">
            <SectionHeading title="Hi-fi Prototypes" subtitle="Refined prototypes with detailed mockups." badge="Phase 2" />
            <div className="space-y-8">
              <Card>
                <SectionLabel>Revisited &ldquo;How Might We...?&rdquo; Statement</SectionLabel>
                <div className="mt-3 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-700 to-violet-600 px-5 py-4 mb-5 shadow-lg shadow-brand-500/15">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
                  <p className="relative text-[15px] font-medium leading-relaxed text-white">&ldquo;How might we assist our users in lowering their stress levels caused by phone apps like social media platforms, specifically in a way that incentivizes less time on said apps for their own well-being while still making the assistance attractive towards the users?&rdquo;</p>
                </div>
                <SectionLabel>Why It Changed</SectionLabel>
                <p className="mt-2 text-[15px] leading-[1.8] text-zinc-500">Our statement has changed because we are taking a more direct approach with the incentives we have for our users. We are now focusing not only on how to make this product functional, but how to do so without making it a bother. We are thinking more from the users' side first.</p>
              </Card>

              <div className="space-y-6">
                {hifiPrototypes.map((proto, i) => (
                  <Card key={i} className={`animate-fade-in-slow stagger-${i + 1}`}>
                    <Badge className={`${proto.ideaColor} border self-start mb-4`}>Idea: {proto.idea}</Badge>
                    <h3 className="text-xl font-bold text-zinc-800 mb-3">{proto.title}</h3>
                    <div className={`rounded-xl bg-gradient-to-r ${proto.accentColor} p-px mb-4`}>
                      <div className="rounded-[11px] bg-white px-4 py-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 block mb-1">Question Answered</span>
                        <p className="text-sm font-medium text-zinc-700 leading-relaxed">{proto.question}</p>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-5">{proto.description}</p>
                    {proto.risk && (
                      <div className="rounded-xl bg-zinc-50 border border-zinc-200/60 px-5 py-4 mb-5 flex gap-3 items-start">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-700 to-violet-600 shrink-0 mt-0.5 shadow-sm">
                          <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400 mb-1">Risk Assessment</div>
                          <p className="text-[13px] text-zinc-600 leading-relaxed">{proto.risk}</p>
                        </div>
                      </div>
                    )}
                    {proto.liveUrl && (
                      <a href={proto.liveUrl} target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-700 to-violet-600 px-6 py-4 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-[1.02] transition-all">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
                        <div className="relative flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                          </div>
                          <div>
                            <div className="text-sm font-bold">Click here for the demo</div>
                            <div className="text-xs text-white/60">{proto.liveUrl.replace("https://", "")}</div>
                          </div>
                        </div>
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-zinc-200/60 bg-white/80 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-5 w-5 rounded-md bg-gradient-to-br from-purple-700 to-violet-600 flex items-center justify-center"><span className="text-[7px] font-extrabold text-white">IN</span></div>
          <span className="text-sm font-bold text-zinc-800">INZONE</span>
        </div>
        <span className="text-[13px] text-zinc-400">DES 15 · Meshal Alothra, Rayyan Ali, Aryan Nagpal</span>
      </footer>
    </div>
  );
}
