"use client";

import { useState } from "react";
import Link from "next/link";
import { useIcon } from "@/lib/icon-context";
import { fontWeights } from "@/registry/default/lib/font-weight";
import { useShape } from "@/registry/default/lib/shape-context";
import { ScrollArea } from "@/registry/default/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/registry/default/select";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const TIMEZONES = [
  ["utc-8", "(UTC-8) Pacific Time"],
  ["utc-7", "(UTC-7) Mountain Time"],
  ["utc-6", "(UTC-6) Central Time"],
  ["utc-5", "(UTC-5) Eastern Time"],
  ["utc-4", "(UTC-4) Atlantic Time"],
  ["utc-3", "(UTC-3) Buenos Aires"],
  ["utc-1", "(UTC-1) Azores"],
  ["utc+0", "(UTC+0) London"],
  ["utc+1", "(UTC+1) Paris"],
  ["utc+2", "(UTC+2) Helsinki"],
  ["utc+3", "(UTC+3) Moscow"],
  ["utc+5:30", "(UTC+5:30) Mumbai"],
  ["utc+8", "(UTC+8) Singapore"],
  ["utc+9", "(UTC+9) Tokyo"],
  ["utc+10", "(UTC+10) Sydney"],
  ["utc+12", "(UTC+12) Auckland"],
] as const;

const RELEASES = Array.from(
  { length: 24 },
  (_, i) => `v1.${23 - i}.0 — maintenance release`
);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const PROBLEM_CODE = `// ❌ Native overflow — the list just stops. Nothing says
// there are 18 more releases below the fold, and on macOS
// the scrollbar is invisible until you happen to scroll.
<div className="h-56 overflow-y-auto">
  {releases.map((r) => <Row key={r} label={r} />)}
</div>

// ✅ ScrollArea — a surface gradient + chevron marks every
// edge with more content, and the scrollbar is always
// discoverable on hover.
<ScrollArea className="h-56">
  {releases.map((r) => <Row key={r} label={r} />)}
</ScrollArea>`;

const HOOK_CODE = `import { useScrollEdges, ScrollEdgeCue } from "@/lib/scroll-fade";

// Track which edges have more content. Pass the scroller's ref;
// scroll position, resizes, and content changes are all observed.
const edges = useScrollEdges(scrollerRef, { axis: "vertical" });

// Inside the scroller: sticky mode adds zero layout height.
// The gradient reads useSurface() from context, so it matches
// the actual background at any elevation.
<div ref={scrollerRef} className="overflow-y-auto ...">
  <ScrollEdgeCue edge="top" visible={edges.top} />
  {children}
  <ScrollEdgeCue edge="bottom" visible={edges.bottom} />
</div>`;

const SCROLL_AREA_CODE = `import { ScrollArea } from "./components";

// Cues + restyled scrollbars + native fallback on touch, in one
// wrapper. Vertical by default.
<ScrollArea className="h-64">
  {items.map((item) => <Row key={item} label={item} />)}
</ScrollArea>`;

const VERTICAL_CODE = `import { ScrollArea } from "./components";

<ScrollArea className="h-64 w-72">
  <div className="flex flex-col gap-0.5 p-3">
    {releases.map((release) => (
      <div key={release} className="px-3 py-2 text-[13px]">
        {release}
      </div>
    ))}
  </div>
</ScrollArea>`;

const HORIZONTAL_CODE = `import { ScrollArea } from "./components";

<ScrollArea orientation="horizontal" className="w-full">
  <div className="flex gap-2 p-3 w-max">
    {months.map((month) => (
      <Card key={month} label={month} />
    ))}
  </div>
</ScrollArea>`;

const NO_FADE_CODE = `import { ScrollArea } from "./components";

// Scrollbars only — no edge cues.
<ScrollArea scrollFade={false} className="h-64 w-72">
  ...
</ScrollArea>`;

const SELECT_CODE = `// SelectContent owns its own scroller (listbox role, keyboard
// nav), so it consumes the primitives directly instead of
// wrapping in ScrollArea — same hook, same cue, sticky mode.
<Select value={timezone} onValueChange={setTimezone}>
  <SelectTrigger icon={Globe} placeholder="Select timezone…" />
  <SelectContent>
    {timezones.map(([value, label], i) => (
      <SelectItem key={value} index={i} value={value}>
        {label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>`;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const scrollAreaProps: PropDef[] = [
  {
    name: "orientation",
    type: '"vertical" | "horizontal" | "both"',
    default: '"vertical"',
    description: "Which axes get scrollbars and edge cues.",
  },
  {
    name: "scrollFade",
    type: "boolean",
    default: "true",
    description:
      "Surface-gradient + chevron cues at edges with more content. Auto-shows on overflow; set to false to disable.",
  },
  {
    name: "cueSize",
    type: "number",
    default: "52",
    description: "Cue band size in px along the scroll axis.",
  },
  {
    name: "viewportClassName",
    type: "string",
    description: "Additional classes for the inner scrolling viewport.",
  },
  {
    name: "className",
    type: "string",
    description:
      "Classes for the outer container — set the height/width constraint here.",
  },
];

const useScrollEdgesProps: PropDef[] = [
  {
    name: "ref",
    type: "RefObject<HTMLElement>",
    description: "The scroll container to observe.",
  },
  {
    name: "enabled",
    type: "boolean",
    default: "true",
    description:
      "Attach/detach tracking. Callers whose scroller mounts late (portals) fold that into enabled so the hook re-attaches once the element exists.",
  },
  {
    name: "axis",
    type: '"vertical" | "horizontal" | "both"',
    default: '"vertical"',
    description: "Which axes to measure.",
  },
];

const scrollEdgeCueProps: PropDef[] = [
  {
    name: "edge",
    type: '"top" | "bottom" | "left" | "right"',
    description: "Which scroll edge the cue marks.",
  },
  {
    name: "visible",
    type: "boolean",
    description: "Whether the cue shows — wire to the matching useScrollEdges flag.",
  },
  {
    name: "mode",
    type: '"sticky" | "absolute"',
    default: '"sticky"',
    description:
      "sticky renders a zero-size element inside the scroller; absolute renders a band for an overlay sitting over the viewport.",
  },
  {
    name: "surfaceLevel",
    type: "number",
    default: "useSurface()",
    description:
      "Surface ladder level the gradient fades toward. Override only on backgrounds outside the ladder.",
  },
  {
    name: "size",
    type: "number",
    default: "52",
    description: "Band size in px along the scroll axis.",
  },
  {
    name: "inset",
    type: "number",
    default: "4",
    description:
      "Sticky-mode bleed in px so the band covers the scroller's padding (4 for p-1, 16 for p-4).",
  },
];

// ---------------------------------------------------------------------------
// Demos
// ---------------------------------------------------------------------------

function ReleaseRows() {
  return (
    <div className="flex flex-col p-3">
      {RELEASES.map((release) => (
        <div
          key={release}
          className="px-3 py-2 text-[13px] text-foreground whitespace-nowrap"
        >
          {release}
        </div>
      ))}
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] text-muted-foreground text-center">
      {children}
    </span>
  );
}

function ProblemDemo() {
  const shape = useShape();
  return (
    <ComponentPreview code={PROBLEM_CODE} padding="responsive">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="flex flex-col gap-2">
          <div
            className={`h-56 w-64 overflow-y-auto border border-border ${shape.container}`}
          >
            <ReleaseRows />
          </div>
          <PanelLabel>❌ Native — no hint of 18 more rows</PanelLabel>
        </div>
        <div className="flex flex-col gap-2">
          <ScrollArea
            className={`h-56 w-64 border border-border ${shape.container}`}
          >
            <ReleaseRows />
          </ScrollArea>
          <PanelLabel>✅ Treated — edge cues + scrollbar</PanelLabel>
        </div>
      </div>
    </ComponentPreview>
  );
}

function VerticalDemo() {
  const shape = useShape();
  return (
    <ComponentPreview code={VERTICAL_CODE}>
      <ScrollArea
        className={`h-64 w-72 border border-border ${shape.container}`}
      >
        <ReleaseRows />
      </ScrollArea>
    </ComponentPreview>
  );
}

function HorizontalDemo() {
  const shape = useShape();
  return (
    <ComponentPreview code={HORIZONTAL_CODE}>
      <ScrollArea
        orientation="horizontal"
        className={`w-full max-w-md border border-border ${shape.container}`}
      >
        <div className="flex gap-2 p-3 w-max">
          {MONTHS.map((month) => (
            <div
              key={month}
              className={`flex items-center justify-center h-20 w-28 shrink-0 border border-border text-[13px] text-foreground ${shape.bg}`}
            >
              {month}
            </div>
          ))}
        </div>
      </ScrollArea>
    </ComponentPreview>
  );
}

function NoFadeDemo() {
  const shape = useShape();
  return (
    <ComponentPreview code={NO_FADE_CODE}>
      <ScrollArea
        scrollFade={false}
        className={`h-64 w-72 border border-border ${shape.container}`}
      >
        <ReleaseRows />
      </ScrollArea>
    </ComponentPreview>
  );
}

function SelectDemo() {
  const Globe = useIcon("globe");
  const [timezone, setTimezone] = useState("");
  return (
    <ComponentPreview code={SELECT_CODE} minHeightClass="min-h-[380px]">
      <div className="w-64">
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger icon={Globe} placeholder="Select timezone…" />
          <SelectContent>
            {TIMEZONES.map(([value, label], i) => (
              <SelectItem key={value} index={i} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </ComponentPreview>
  );
}

// ---------------------------------------------------------------------------
// Doc Page
// ---------------------------------------------------------------------------

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[15px] text-foreground mt-2"
      style={{ fontVariationSettings: fontWeights.semibold }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-muted-foreground leading-relaxed">
      {children}
    </p>
  );
}

export default function ScrollingListDoc() {
  return (
    <DocPage
      title="Scrolling list"
      slug="scrolling-list"
      installSlug="scroll-area"
      description={
        <>
          Every scrolling surface gets the same affordances: a surface-colour
          gradient with a chevron at edges that have more content, and a
          scrollbar that stays discoverable — native where that feels better.
        </>
      }
    >
      <DocSection title="The problem">
        <div className="flex flex-col gap-3 text-[13px] text-muted-foreground leading-relaxed">
          <p>
            A clipped list looks finished. When content stops exactly at the
            container edge there is no signal that anything sits below the
            fold — and since macOS hides scrollbars until you scroll, the one
            built-in affordance often is not there either. Users simply do not
            scroll what does not look scrollable.
          </p>
        </div>
        <ProblemDemo />
      </DocSection>

      <DocSection title="The system">
        <div className="flex flex-col gap-3 text-[13px] text-muted-foreground leading-relaxed">
          <p>
            Two layers: primitives that any component can drop into its own
            scroller, and a wrapper that bundles everything for the common
            case.
          </p>
        </div>

        <H3>Edge primitives</H3>
        <P>
          <code className="px-1 py-0.5 rounded bg-muted text-[12px]">
            useScrollEdges
          </code>{" "}
          observes a scroll container — position, resizes, and content
          changes — and reports which edges have more content.{" "}
          <code className="px-1 py-0.5 rounded bg-muted text-[12px]">
            ScrollEdgeCue
          </code>{" "}
          renders the affordance for one edge. The gradient fades toward the
          surface level provided by context, so it matches the actual
          background at any depth of the{" "}
          <Link href="/docs/surfaces" className="underline underline-offset-2">
            surface ladder
          </Link>{" "}
          — a menu elevated two levels above a dialog fades into the menu
          colour, not the page colour.
        </P>
        <ComponentPreview code={HOOK_CODE} padding="compact">
          <div className="text-[13px] text-muted-foreground px-4 py-8 text-center max-w-sm">
            Sticky mode is what Select uses inside its listbox — zero layout
            height, no wrapper element. Open the demo under Examples to see it
            live.
          </div>
        </ComponentPreview>

        <H3>ScrollArea</H3>
        <P>
          The wrapper composes the cues with restyled overlay scrollbars
          (thumb radius follows the shape system — press{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted text-[12px] font-mono">
            R
          </kbd>
          ) and falls back to native overflow scrolling on touch-primary
          devices, where platform scroll physics beat any custom scrollbar.
          The edge cues stay active in both modes. Scrollbar machinery is
          built on Radix Scroll Area, adapted from{" "}
          <a
            href="https://lina.sameer.sh"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            Lina
          </a>
          .
        </P>
        <ComponentPreview code={SCROLL_AREA_CODE} padding="compact">
          <div className="text-[13px] text-muted-foreground px-4 py-8 text-center max-w-sm">
            New scrolling surfaces reach for ScrollArea by default; components
            that must own their scroller (Select, MobileDrawer) use the
            primitives directly.
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Examples">
        <H3>Vertical</H3>
        <P>
          The default. Cues appear only at edges with more content — at the
          top of the list only the bottom cue shows, at the end only the top
          one.
        </P>
        <VerticalDemo />

        <H3>Horizontal</H3>
        <P>Left/right chevrons, same gradient logic per edge.</P>
        <HorizontalDemo />

        <H3>Without fade</H3>
        <P>
          <code className="px-1 py-0.5 rounded bg-muted text-[12px]">
            scrollFade={"{false}"}
          </code>{" "}
          keeps the scrollbars but drops the edge cues.
        </P>
        <NoFadeDemo />

        <H3>Select</H3>
        <P>
          SelectContent consumes the same primitives in sticky mode inside its
          own listbox — the cue gradient picks up the menu&apos;s elevated
          surface automatically. MobileDrawer does the same on its panel.
        </P>
        <SelectDemo />
      </DocSection>

      <DocSection title="API reference">
        <H3>ScrollArea</H3>
        <PropsTable props={scrollAreaProps} />

        <H3>useScrollEdges</H3>
        <PropsTable props={useScrollEdgesProps} />

        <H3>ScrollEdgeCue</H3>
        <PropsTable props={scrollEdgeCueProps} />
      </DocSection>
    </DocPage>
  );
}
