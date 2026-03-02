import { useState } from "react";

const NAV = ["Overview", "Research Plan", "Interviews", "Affinity Diagram", "User Needs", "Problem Statement"];

const team = [
  { name: "Meshal Alothra", initials: "MA" },
  { name: "Rayyan Ali", initials: "RA" },
  { name: "Aryan Nagpal", initials: "AN" },
];

const needs = [
  "Users need a way to recognize when their focus is degrading before they instinctively reach for their phone.",
  "Users need a way to understand the relationship between their phone habits and their stress levels over time.",
  "Users need a way to re-enter a deep focus state after taking a break without feeling overwhelmed by the re-entry cost.",
  "Users need a way to distinguish between a genuinely needed break and an avoidance behavior.",
  "Users need a way to make impulsive phone-checking feel effortful enough to prompt genuine self-reflection.",
  "Users need a way to see patterns in their distraction triggers without manually logging anything.",
  "Users need a way to transition between cognitively demanding tasks without losing their mental context.",
  "Users need a way to set screen time boundaries that are difficult to bypass in a moment of low willpower.",
  "Users need a way to receive stress signals that don't themselves become a new source of distraction.",
  "Users need a way to understand which specific apps or notification types correlate with spikes in stress.",
  "Users need a way to monitor their cognitive load throughout the day without intrusive hardware.",
  "Users need a way to be nudged back to a task without feeling punished or shamed.",
  "Users need a way to review their focus and stress data in a format that feels meaningful, not clinical.",
  "Users need a way to set personal focus goals that adapt to how they're actually feeling on a given day.",
  "Users need a way to identify when in the day their working memory is most depleted.",
  "Users need a way to experiment with different routines and see measurable impact on their focus quality.",
];

const interviewees = [
  {
    interviewer: "Rayyan Ali",
    participant: "Muhammed",
    status: "complete",
    background: "Berkeley CS & History graduate. Currently job-hopping and building projects. Enjoys reading and crime novels. Does not have a formal ADHD diagnosis but experiences significant attention and focus challenges.",
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
    participant: "Participant 2",
    status: "pending",
    background: "Interview pending.",
    responses: [],
    observations: [],
  },
  {
    interviewer: "Aryan Nagpal",
    participant: "Participant 3",
    status: "pending",
    background: "Interview pending.",
    responses: [],
    observations: [],
  },
];

const affinityThemes = [
  {
    theme: "Rationalized Distraction",
    color: "#fafafa",
    accent: "#18181b",
    notes: ["\"Cognitively taxing tasks drain me\"", "Phone as a rational escape hatch", "Diminishing returns justification", "Avoidance framed as self-care"],
  },
  {
    theme: "Friction as the Key Mechanism",
    color: "#fafafa",
    accent: "#18181b",
    notes: ["6–8 sec OPAL delay works", "Hard blocks feel punishing", "Puzzles > passive timers", "Pause enables self-reflection"],
  },
  {
    theme: "Re-entry Cost",
    color: "#fafafa",
    accent: "#18181b",
    notes: ["\"Working memory erased\"", "Break → restart barrier", "Context loss is painful", "Long sessions hard to resume"],
  },
  {
    theme: "Retrospective Awareness",
    color: "#fafafa",
    accent: "#18181b",
    notes: ["Stress noticed after the fact", "Others notice before self", "No real-time internal signal", "Patterns felt but not captured"],
  },
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionLabel>Research Question</SectionLabel>
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
                  ["5", "Interviews"],
                  ["16", "User Needs"],
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
                                  src="https://i.imgur.com/WqesFlP.jpeg"
                                  alt="Participant observed touching hair during interview"
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
                                  Participant touches hair and avoids eye contact mid-response
                                </p>
                                <p style={{ margin: 0, fontSize: 13, color: "#71717a", lineHeight: 1.6 }}>
                                  <strong>Breakdown / Opportunity:</strong> Physical self-soothing behavior (hair-touching, gaze aversion) appeared consistently during cognitively loaded responses — suggesting stress and cognitive load manifest physically before users consciously register them. This points to an opportunity for ambient, body-signal-based stress detection rather than self-reported check-ins.
                                </p>
                              </div>
                            </div>
                          </div>
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
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Affinity Diagram</h2>
              <p style={{ margin: 0, color: "#71717a", fontSize: 15 }}>Themes synthesized across all interviews. Each note represents a quote, behavior, or observed pattern.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
              {affinityThemes.map(t => (
                <div key={t.theme} style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f4f4f5", background: "#fafafa" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>{t.theme}</span>
                  </div>
                  <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {t.notes.map((n, i) => (
                      <div key={i} style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 7, padding: "8px 12px", fontSize: 13, color: "#451a03", lineHeight: 1.5 }}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Card>
              <SectionLabel>Top 3 Takeaways</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
                {[
                  "Users rationalize distraction as logical — making hard blocks ineffective and friction-based design essential.",
                  "Stress awareness is almost always retrospective — users rarely know they are overwhelmed until after the fact.",
                  "Re-entry cost after breaks is a hidden and underserved pain point — the mental effort to rebuild context prevents people from resuming work.",
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
        {active === "User Needs" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>User Needs</h2>
              <p style={{ margin: 0, color: "#71717a", fontSize: 15 }}>{needs.length} unmet needs identified from interviews. Each is framed as a need — not a solution.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {needs.map((n, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#a1a1aa", flexShrink: 0, paddingTop: 2, minWidth: 20 }}>{i + 1}</span>
                  <p style={{ margin: 0, fontSize: 14, color: "#27272a", lineHeight: 1.65 }}>{n}</p>
                </div>
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
