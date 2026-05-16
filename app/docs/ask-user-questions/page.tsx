"use client";

import { useState, type ReactNode } from "react";
import {
  AskUserQuestions,
  type AskUserAnswer,
  type AskUserQuestion,
} from "@/registry/default/ask-user-questions";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { useIcon } from "@/lib/icon-context";

/**
 * Wraps a ComponentPreview with a Replay button that fully resets the demo.
 * Bumps an internal `replayKey` to remount the example (clears all internal
 * state), and optionally invokes `onReset` for parents that own controlled
 * state (e.g. currentIndex / answers).
 *
 * Pattern mirrors the ThinkingSteps doc page's playback button.
 */
function ReplayableExample({
  code,
  onReset,
  children,
}: {
  code: string;
  onReset?: () => void;
  children: (replayKey: number) => ReactNode;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const RotateIcon = useIcon("rotate-ccw");
  return (
    <ComponentPreview
      code={code}
      playbackButton={{
        icon: <RotateIcon size={16} strokeWidth={1.5} />,
        tooltip: "Replay",
        onClick: () => {
          onReset?.();
          setReplayKey((k) => k + 1);
        },
      }}
    >
      {children(replayKey)}
    </ComponentPreview>
  );
}

// ── Code snippets ──────────────────────────────────────────────

const exampleCode = `import { AskUserQuestions } from "./components";

const questions = [
  {
    id: "role",
    title: "What's your role?",
    options: [
      { id: "design", title: "Designer", description: "Visual / interaction" },
      { id: "eng", title: "Engineer", description: "Frontend / backend" },
      { id: "pm", title: "PM", description: "Product / program" },
      { id: "research", title: "Researcher", description: "User / market" },
    ],
  },
  {
    id: "tools",
    title: "Which tools do you use day to day?",
    multiSelect: true,
    options: [
      { id: "figma", title: "Figma", description: "Design source of truth" },
      { id: "vscode", title: "VS Code", description: "Code editor" },
      { id: "linear", title: "Linear", description: "Issue tracker" },
      { id: "notion", title: "Notion", description: "Docs and planning" },
    ],
  },
  {
    id: "missing",
    title: "What feels missing in your workflow?",
    options: [
      { id: "speed", title: "Speed", description: "Faster iteration loop" },
      { id: "clarity", title: "Clarity", description: "Sharper goals" },
      { id: "alignment", title: "Alignment", description: "Same page sooner" },
      { id: "quality", title: "Quality", description: "Higher craft bar" },
    ],
    allowOther: true,
    otherPlaceholder: "Something else?",
  },
];

<AskUserQuestions
  questions={questions}
  onComplete={(answers) => console.log(answers)}
/>`;

const multipleCode = `const questions = [
  {
    id: "role",
    title: "What's your role?",
    options: [
      { id: "design", title: "Designer", description: "Visual / interaction" },
      { id: "eng", title: "Engineer", description: "Frontend / backend" },
      { id: "pm", title: "PM", description: "Product / program" },
      { id: "research", title: "Researcher", description: "User / market research" },
    ],
  },
  {
    id: "tools",
    title: "Which tool do you use most?",
    options: [
      { id: "figma", title: "Figma", description: "Design source of truth" },
      { id: "vscode", title: "VS Code", description: "Code editor" },
      { id: "linear", title: "Linear", description: "Issue tracker" },
      { id: "notion", title: "Notion", description: "Docs and planning" },
    ],
  },
  {
    id: "team",
    title: "How big is your team?",
    options: [
      { id: "solo", title: "Just me", description: "Solo founder or freelancer" },
      { id: "small", title: "2–10", description: "Small team or pod" },
      { id: "mid", title: "11–50", description: "A few cross-functional teams" },
      { id: "large", title: "50+", description: "Full org" },
    ],
  },
  {
    id: "experience",
    title: "How long have you been doing this?",
    options: [
      { id: "lt1", title: "Less than a year", description: "Just getting started" },
      { id: "1to3", title: "1–3 years", description: "Finding your rhythm" },
      { id: "3to7", title: "3–7 years", description: "Comfortable in the craft" },
      { id: "gt7", title: "7+ years", description: "Seasoned" },
    ],
  },
];

<AskUserQuestions questions={questions} />`;

const multiSelectCode = `const questions = [
  {
    id: "features",
    title: "Which features should we prioritize?",
    multiSelect: true,
    options: [
      { id: "dm", title: "Dark mode", description: "System-aware theme switching" },
      { id: "a11y", title: "Accessibility", description: "Screen-reader and keyboard support" },
      { id: "perf", title: "Performance", description: "Faster initial load" },
      { id: "i18n", title: "Translations", description: "Multi-language support" },
    ],
    nextLabel: "Continue",
  },
  {
    id: "platforms",
    title: "Which platforms do you target?",
    multiSelect: true,
    options: [
      { id: "web", title: "Web", description: "Desktop browsers" },
      { id: "ios", title: "iOS", description: "iPhone and iPad" },
      { id: "android", title: "Android", description: "Phones and tablets" },
      { id: "desktop", title: "Native desktop", description: "macOS / Windows / Linux apps" },
    ],
  },
  {
    id: "integrations",
    title: "Which integrations matter most?",
    multiSelect: true,
    options: [
      { id: "slack", title: "Slack", description: "Notifications and approvals" },
      { id: "github", title: "GitHub", description: "PR and issue sync" },
      { id: "linear", title: "Linear", description: "Two-way ticket linking" },
      { id: "figma", title: "Figma", description: "Design hand-off" },
      { id: "calendar", title: "Calendar", description: "Schedule-aware reminders" },
    ],
  },
];

<AskUserQuestions questions={questions} />`;

const otherCode = `const questions = [
  {
    id: "blocker",
    title: "What's blocking you most right now?",
    options: [
      { id: "scope", title: "Scope", description: "Too much on the plate" },
      { id: "review", title: "Review", description: "Waiting on feedback" },
      { id: "infra", title: "Infra", description: "Tooling slows me down" },
    ],
    allowOther: true,
    otherPlaceholder: "Describe in your own words…",
  },
  {
    id: "improve",
    title: "Which area needs the most improvement?",
    options: [
      { id: "speed", title: "Speed", description: "Make the loop faster" },
      { id: "clarity", title: "Clarity", description: "Sharpen what good looks like" },
      { id: "alignment", title: "Alignment", description: "Get on the same page sooner" },
      { id: "quality", title: "Quality", description: "Raise the craft bar" },
    ],
    allowOther: true,
  },
  {
    id: "easier",
    title: "What would make your week easier?",
    options: [
      { id: "fewer", title: "Fewer meetings", description: "Reclaim deep work time" },
      { id: "decisions", title: "Faster decisions", description: "Unblock without escalation" },
      { id: "context", title: "More context", description: "Know the why upfront" },
    ],
    allowOther: true,
    otherPlaceholder: "Anything else?",
  },
];

<AskUserQuestions questions={questions} />`;

const skipCode = `const questions = [
  {
    id: "experience",
    title: "How long have you been using the product?",
    options: [
      { id: "new", title: "Less than a week", description: "Just getting started" },
      { id: "mid", title: "A few months", description: "Comfortable with basics" },
      { id: "long", title: "Over a year", description: "Power user" },
    ],
  },
  {
    id: "frequency",
    title: "How often do you use it?",
    options: [
      { id: "daily", title: "Daily", description: "Part of my routine" },
      { id: "weekly", title: "A few times a week", description: "When the work calls for it" },
      { id: "monthly", title: "A few times a month", description: "Occasional use" },
      { id: "rarely", title: "Rarely", description: "Once in a while" },
    ],
  },
  {
    id: "recommend",
    title: "Would you recommend it to a colleague?",
    options: [
      { id: "yes", title: "Yes", description: "Already have" },
      { id: "maybe", title: "Maybe", description: "Depends on the role" },
      { id: "no", title: "Not yet", description: "Needs more polish first" },
    ],
  },
];

<AskUserQuestions
  questions={questions}
  onSkip={(qId, idx) => console.log("skipped", qId, idx)}
/>`;

const controlledCode = `const [index, setIndex] = useState(0);
const [answers, setAnswers] = useState({});

<AskUserQuestions
  questions={questions}
  currentIndex={index}
  onCurrentIndexChange={setIndex}
  answers={answers}
  onAnswersChange={setAnswers}
  onComplete={() => setIndex(0)}
/>`;

// ── Props tables ───────────────────────────────────────────────

const componentProps: PropDef[] = [
  { name: "questions", type: "AskUserQuestion[]", description: "Ordered list of questions to ask. 2–5 options per question is recommended." },
  { name: "currentIndex", type: "number", description: "Controlled index of the active question." },
  { name: "defaultCurrentIndex", type: "number", default: "0", description: "Initial question index (uncontrolled mode)." },
  { name: "onCurrentIndexChange", type: "(index: number) => void", description: "Called when the active question changes." },
  { name: "answers", type: "Record<string, AskUserAnswer>", description: "Controlled answers map keyed by question id." },
  { name: "defaultAnswers", type: "Record<string, AskUserAnswer>", description: "Initial answers (uncontrolled mode)." },
  { name: "onAnswersChange", type: "(answers: Record<string, AskUserAnswer>) => void", description: "Called whenever any answer changes." },
  { name: "onComplete", type: "(answers: Record<string, AskUserAnswer>) => void", description: "Called after the last question is answered or submitted." },
  { name: "onSkip", type: "(questionId: string, index: number) => void", description: "Called when the user clicks Skip on a question." },
  { name: "skipLabel", type: "string", default: '"Skip"', description: "Label for the skip control in the header." },
];

const questionProps: PropDef[] = [
  { name: "id", type: "string", description: "Stable identifier used to key the answer. Falls back to position." },
  { name: "title", type: "string", description: "Question text shown above the options." },
  { name: "options", type: "AskUserOption[]", description: "2–5 options to choose from." },
  { name: "multiSelect", type: "boolean", default: "false", description: "Allow multiple options to be selected. Adds a Next button at the bottom." },
  { name: "allowOther", type: "boolean", default: "false", description: "Render an always-visible inline text input for free-form answers." },
  { name: "otherPlaceholder", type: "string", default: '"Describe in your own words…"', description: "Placeholder for the Other input." },
  { name: "skippable", type: "boolean", default: "true", description: "Show the Skip control in the header." },
  { name: "nextLabel", type: "string", description: "Label for the Next button in multi-select mode. Defaults to 'Next' or 'Finish'." },
];

const optionProps: PropDef[] = [
  { name: "id", type: "string", description: "Stable identifier returned in the answer. Falls back to position." },
  { name: "title", type: "string", description: "Bold leading label for the option." },
  { name: "description", type: "string", description: "Secondary muted text shown after the title." },
];

const answerProps: PropDef[] = [
  { name: "questionId", type: "string", description: "Id of the question this answer belongs to." },
  { name: "selectedIds", type: "string[]", description: "Selected option ids. Length 0–1 in single-select, 0–N in multi-select." },
  { name: "otherText", type: "string", description: "Free-form text from the Other input, if any." },
  { name: "skipped", type: "boolean", description: "True when the user skipped the question." },
];

// ── Page ───────────────────────────────────────────────────────

const exampleQuestions: AskUserQuestion[] = [
  {
    id: "role",
    title: "What's your role?",
    options: [
      { id: "design", title: "Designer", description: "Visual / interaction" },
      { id: "eng", title: "Engineer", description: "Frontend / backend" },
      { id: "pm", title: "PM", description: "Product / program" },
      { id: "research", title: "Researcher", description: "User / market" },
    ],
  },
  {
    id: "tools",
    title: "Which tools do you use day to day?",
    multiSelect: true,
    options: [
      { id: "figma", title: "Figma", description: "Design source of truth" },
      { id: "vscode", title: "VS Code", description: "Code editor" },
      { id: "linear", title: "Linear", description: "Issue tracker" },
      { id: "notion", title: "Notion", description: "Docs and planning" },
    ],
  },
  {
    id: "missing",
    title: "What feels missing in your workflow?",
    options: [
      { id: "speed", title: "Speed", description: "Faster iteration loop" },
      { id: "clarity", title: "Clarity", description: "Sharper goals" },
      { id: "alignment", title: "Alignment", description: "Same page sooner" },
      { id: "quality", title: "Quality", description: "Higher craft bar" },
    ],
    allowOther: true,
    otherPlaceholder: "Something else?",
  },
];

const multipleQuestions: AskUserQuestion[] = [
  {
    id: "role",
    title: "What's your role?",
    options: [
      { id: "design", title: "Designer", description: "Visual / interaction" },
      { id: "eng", title: "Engineer", description: "Frontend / backend" },
      { id: "pm", title: "PM", description: "Product / program" },
      { id: "research", title: "Researcher", description: "User / market research" },
    ],
  },
  {
    id: "tools",
    title: "Which tool do you use most?",
    options: [
      { id: "figma", title: "Figma", description: "Design source of truth" },
      { id: "vscode", title: "VS Code", description: "Code editor" },
      { id: "linear", title: "Linear", description: "Issue tracker" },
      { id: "notion", title: "Notion", description: "Docs and planning" },
    ],
  },
  {
    id: "team",
    title: "How big is your team?",
    options: [
      { id: "solo", title: "Just me", description: "Solo founder or freelancer" },
      { id: "small", title: "2–10", description: "Small team or pod" },
      { id: "mid", title: "11–50", description: "A few cross-functional teams" },
      { id: "large", title: "50+", description: "Full org" },
    ],
  },
  {
    id: "experience",
    title: "How long have you been doing this?",
    options: [
      { id: "lt1", title: "Less than a year", description: "Just getting started" },
      { id: "1to3", title: "1–3 years", description: "Finding your rhythm" },
      { id: "3to7", title: "3–7 years", description: "Comfortable in the craft" },
      { id: "gt7", title: "7+ years", description: "Seasoned" },
    ],
  },
];

const multiSelectQuestions: AskUserQuestion[] = [
  {
    id: "features",
    title: "Which features should we prioritize?",
    multiSelect: true,
    options: [
      { id: "dm", title: "Dark mode", description: "System-aware theme switching" },
      { id: "a11y", title: "Accessibility", description: "Screen-reader and keyboard support" },
      { id: "perf", title: "Performance", description: "Faster initial load" },
      { id: "i18n", title: "Translations", description: "Multi-language support" },
    ],
    nextLabel: "Continue",
  },
  {
    id: "platforms",
    title: "Which platforms do you target?",
    multiSelect: true,
    options: [
      { id: "web", title: "Web", description: "Desktop browsers" },
      { id: "ios", title: "iOS", description: "iPhone and iPad" },
      { id: "android", title: "Android", description: "Phones and tablets" },
      { id: "desktop", title: "Native desktop", description: "macOS / Windows / Linux apps" },
    ],
  },
  {
    id: "integrations",
    title: "Which integrations matter most?",
    multiSelect: true,
    options: [
      { id: "slack", title: "Slack", description: "Notifications and approvals" },
      { id: "github", title: "GitHub", description: "PR and issue sync" },
      { id: "linear", title: "Linear", description: "Two-way ticket linking" },
      { id: "figma", title: "Figma", description: "Design hand-off" },
      { id: "calendar", title: "Calendar", description: "Schedule-aware reminders" },
    ],
  },
];

const otherQuestions: AskUserQuestion[] = [
  {
    id: "blocker",
    title: "What's blocking you most right now?",
    options: [
      { id: "scope", title: "Scope", description: "Too much on the plate" },
      { id: "review", title: "Review", description: "Waiting on feedback" },
      { id: "infra", title: "Infra", description: "Tooling slows me down" },
    ],
    allowOther: true,
    otherPlaceholder: "Describe in your own words…",
  },
  {
    id: "improve",
    title: "Which area needs the most improvement?",
    options: [
      { id: "speed", title: "Speed", description: "Make the loop faster" },
      { id: "clarity", title: "Clarity", description: "Sharpen what good looks like" },
      { id: "alignment", title: "Alignment", description: "Get on the same page sooner" },
      { id: "quality", title: "Quality", description: "Raise the craft bar" },
    ],
    allowOther: true,
  },
  {
    id: "easier",
    title: "What would make your week easier?",
    options: [
      { id: "fewer", title: "Fewer meetings", description: "Reclaim deep work time" },
      { id: "decisions", title: "Faster decisions", description: "Unblock without escalation" },
      { id: "context", title: "More context", description: "Know the why upfront" },
    ],
    allowOther: true,
    otherPlaceholder: "Anything else?",
  },
];

const skipQuestions: AskUserQuestion[] = [
  {
    id: "experience",
    title: "How long have you been using the product?",
    options: [
      { id: "new", title: "Less than a week", description: "Just getting started" },
      { id: "mid", title: "A few months", description: "Comfortable with basics" },
      { id: "long", title: "Over a year", description: "Power user" },
    ],
  },
  {
    id: "frequency",
    title: "How often do you use it?",
    options: [
      { id: "daily", title: "Daily", description: "Part of my routine" },
      { id: "weekly", title: "A few times a week", description: "When the work calls for it" },
      { id: "monthly", title: "A few times a month", description: "Occasional use" },
      { id: "rarely", title: "Rarely", description: "Once in a while" },
    ],
  },
  {
    id: "recommend",
    title: "Would you recommend it to a colleague?",
    options: [
      { id: "yes", title: "Yes", description: "Already have" },
      { id: "maybe", title: "Maybe", description: "Depends on the role" },
      { id: "no", title: "Not yet", description: "Needs more polish first" },
    ],
  },
];

export default function AskUserQuestionsDoc() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AskUserAnswer>>({});

  return (
    <DocPage
      title="AskUserQuestions"
      slug="ask-user-questions"
      description="Stepped question flow with 2–5 options, single or multi-select, inline 'other' input, optional skip, and multi-question navigation."
    >
      <DocSection title="Example">
        <ReplayableExample code={exampleCode}>
          {(k) => <AskUserQuestions key={k} questions={exampleQuestions} />}
        </ReplayableExample>
      </DocSection>

      <DocSection title="Multiple questions">
        <ReplayableExample code={multipleCode}>
          {(k) => <AskUserQuestions key={k} questions={multipleQuestions} />}
        </ReplayableExample>
      </DocSection>

      <DocSection title="Multi-select">
        <ReplayableExample code={multiSelectCode}>
          {(k) => <AskUserQuestions key={k} questions={multiSelectQuestions} />}
        </ReplayableExample>
      </DocSection>

      <DocSection title="With other">
        <ReplayableExample code={otherCode}>
          {(k) => <AskUserQuestions key={k} questions={otherQuestions} />}
        </ReplayableExample>
      </DocSection>

      <DocSection title="Skippable">
        <ReplayableExample code={skipCode}>
          {(k) => <AskUserQuestions key={k} questions={skipQuestions} />}
        </ReplayableExample>
      </DocSection>

      <DocSection title="Controlled">
        <ReplayableExample
          code={controlledCode}
          onReset={() => {
            setIndex(0);
            setAnswers({});
          }}
        >
          {(k) => (
            <AskUserQuestions
              key={k}
              questions={multipleQuestions}
              currentIndex={index}
              onCurrentIndexChange={setIndex}
              answers={answers}
              onAnswersChange={setAnswers}
              onComplete={() => setIndex(0)}
            />
          )}
        </ReplayableExample>
      </DocSection>

      <DocSection title="API Reference — AskUserQuestions">
        <PropsTable props={componentProps} />
      </DocSection>

      <DocSection title="API Reference — AskUserQuestion">
        <PropsTable props={questionProps} />
      </DocSection>

      <DocSection title="API Reference — AskUserOption">
        <PropsTable props={optionProps} />
      </DocSection>

      <DocSection title="API Reference — AskUserAnswer">
        <PropsTable props={answerProps} />
      </DocSection>
    </DocPage>
  );
}
