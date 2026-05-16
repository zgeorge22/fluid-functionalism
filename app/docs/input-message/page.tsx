"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InputMessage } from "@/registry/default/input-message";
import { Button } from "@/registry/radix/button";
import { Dropdown } from "@/registry/default/dropdown";
import { MenuItem } from "@/registry/default/menu-item";
import { Tooltip } from "@/registry/radix/tooltip";
import { useIcon } from "@/lib/icon-context";
import { springs } from "@/registry/default/lib/springs";
import { fontWeights } from "@/registry/default/lib/font-weight";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

const MODELS = ["Sonnet 5", "Sonnet 4.6", "Sonnet 4.5", "Haiku 4"] as const;
type Model = (typeof MODELS)[number];

const basicCode = `import { useState } from "react";
import { InputMessage } from "./components";

const [value, setValue] = useState("");

<InputMessage
  value={value}
  onValueChange={setValue}
  onSend={(text) => console.log("send:", text)}
/>`;

const actionsCode = `import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InputMessage, Button, Dropdown, MenuItem, Tooltip } from "./components";
import { useIcon } from "@/lib/icon-context";

const MODELS = ["Sonnet 5", "Sonnet 4.6", "Sonnet 4.5", "Haiku 4"] as const;

const [value, setValue] = useState("");
const [files, setFiles] = useState<File[]>([]);
const [modelOpen, setModelOpen] = useState(false);
const [attachOpen, setAttachOpen] = useState(false);
const [model, setModel] = useState<typeof MODELS[number]>("Sonnet 5");

const modelRef = useRef<HTMLDivElement>(null);
const attachRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (modelRef.current && !modelRef.current.contains(e.target as Node))
      setModelOpen(false);
    if (attachRef.current && !attachRef.current.contains(e.target as Node))
      setAttachOpen(false);
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

const PlusIcon = useIcon("plus");
const ChevronDownIcon = useIcon("chevron-down");
const ImageIcon = useIcon("image");
const FileTextIcon = useIcon("square-library");

<InputMessage
  value={value}
  onValueChange={setValue}
  files={files}
  onFilesChange={setFiles}
  onSend={(text, attachments) => {
    console.log("send:", text, attachments);
    setValue("");
    setFiles([]);
  }}
  // Drag-and-drop works on the whole container. Click + to choose a type.
  leftSlot={({ openFilePicker }) => (
    <div ref={attachRef} className="relative">
      <Tooltip content="Add" side="top">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Attach files"
          active={attachOpen}
          onClick={() => setAttachOpen((o) => !o)}
        >
          <PlusIcon />
        </Button>
      </Tooltip>
      <AnimatePresence>
        {attachOpen && (
          <motion.div
            className="absolute bottom-full mb-2 left-0 z-10"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4, transition: { duration: 0.1 } }}
            transition={springs.fast}
          >
            <Dropdown>
              <MenuItem
                index={0}
                label="Image"
                icon={ImageIcon}
                onSelect={() => {
                  setAttachOpen(false);
                  openFilePicker("image/png,image/jpeg");
                }}
              />
              <MenuItem
                index={1}
                label="PDF"
                icon={FileTextIcon}
                onSelect={() => {
                  setAttachOpen(false);
                  openFilePicker("application/pdf");
                }}
              />
            </Dropdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )}
  rightSlot={
    <div ref={modelRef} className="relative">
      <Tooltip content="Select model" side="top">
        <Button
          variant="ghost"
          size="sm"
          trailingIcon={ChevronDownIcon}
          active={modelOpen}
          onClick={() => setModelOpen((o) => !o)}
        >
          {model}
        </Button>
      </Tooltip>
      <AnimatePresence>
        {modelOpen && (
          <motion.div
            className="absolute bottom-full mb-2 right-0 z-10"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4, transition: { duration: 0.1 } }}
            transition={springs.fast}
          >
            <Dropdown checkedIndex={MODELS.indexOf(model)}>
              {MODELS.map((name, i) => (
                <MenuItem
                  key={name}
                  index={i}
                  label={name}
                  checked={name === model}
                  onSelect={() => {
                    setModel(name);
                    setModelOpen(false);
                  }}
                />
              ))}
            </Dropdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  }
/>`;

const leftOnlyCode = `import { useState } from "react";
import { InputMessage } from "./components";
import { Button } from "./components";
import { useIcon } from "@/lib/icon-context";

const [value, setValue] = useState("");
const PlusIcon = useIcon("plus");

<InputMessage
  value={value}
  onValueChange={setValue}
  leftSlot={
    <Button variant="ghost" size="icon-sm" aria-label="Attach">
      <PlusIcon />
    </Button>
  }
/>`;

const rightOnlyCode = `import { useState } from "react";
import { InputMessage } from "./components";
import { Button } from "./components";
import { useIcon } from "@/lib/icon-context";

const [value, setValue] = useState("");
const ChevronDownIcon = useIcon("chevron-down");

<InputMessage
  value={value}
  onValueChange={setValue}
  rightSlot={
    <Button variant="ghost" size="sm" trailingIcon={ChevronDownIcon}>
      Sonnet 4.6
    </Button>
  }
/>`;

const sendHandlerCode = `import { useState } from "react";
import { InputMessage } from "./components";

const [value, setValue] = useState("");
const [messages, setMessages] = useState<string[]>([]);

<InputMessage
  value={value}
  onValueChange={setValue}
  onSend={(text) => {
    setMessages((prev) => [...prev, text]);
    setValue("");
  }}
/>

<ul>
  {messages.map((m, i) => <li key={i}>{m}</li>)}
</ul>`;

const disabledCode = `import { InputMessage } from "./components";

<InputMessage
  value="This composer is disabled"
  onValueChange={() => {}}
  disabled
/>`;

const inputMessageProps: PropDef[] = [
  { name: "value", type: "string", description: "Controlled textarea value." },
  { name: "onValueChange", type: "(value: string) => void", description: "Called with the new value on every textarea change." },
  { name: "onSend", type: "(value: string, files: File[]) => void", description: "Fires on Enter (without Shift) or send-button click. Receives the trimmed value and the currently-attached files. Skipped when the value is empty and no files are attached." },
  { name: "placeholder", type: "string", default: '"Ask me anything…"', description: "Placeholder shown when the value is empty. While a file is being dragged over the component (and attachments are enabled), the placeholder swaps to “Drop files here to add to chat”." },
  { name: "leftSlot", type: "ReactNode | (ctx) => ReactNode", description: "Content rendered in the bottom-left action area. May be a render-fn that receives `{ openFilePicker, files }` — `openFilePicker(acceptOverride?)` opens the native file picker (optionally scoped to a subset of accept types, e.g. `\"image/*\"`)." },
  { name: "rightSlot", type: "ReactNode | (ctx) => ReactNode", description: "Content rendered in the bottom-right action area, before the built-in send button. Same render-fn shape as `leftSlot`." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the textarea, send button, and drag-and-drop." },
  { name: "minRows", type: "number", default: "1", description: "Minimum visible rows before the textarea grows." },
  { name: "maxRows", type: "number", default: "8", description: "Maximum visible rows before the textarea starts to scroll." },
  { name: "clickToFocus", type: "boolean", default: "true", description: "When true, clicking anywhere on the surrounding container (outside of buttons / links / inputs) focuses the textarea." },
  { name: "sendLabel", type: "string", default: '"Send"', description: "Accessible label for the send button." },
  { name: "files", type: "File[]", description: "Controlled list of attached files. Pair with `onFilesChange` to enable drag-and-drop and the file-picker slot helper. When omitted, attachment behavior is disabled." },
  { name: "onFilesChange", type: "(files: File[]) => void", description: "Called when files are added (drag-drop or picker) or removed via the preview tile’s × button. Duplicate drops of the same file (same name + size + lastModified) are silently de-duplicated." },
  { name: "accept", type: "string", default: '"image/png,image/jpeg,application/pdf"', description: "Accepted MIME types as a comma-separated string. Used by both the file picker and the drag-and-drop filter." },
  { name: "maxFiles", type: "number", description: "Maximum number of attached files. Extra files beyond this limit are dropped." },
  { name: "filePreviewSize", type: "number", default: "80", description: "Side length (in pixels) of each preview tile. Images use object-cover; PDFs render the first page via pdfjs; other types fall back to a centered icon." },
  { name: "textareaProps", type: "TextareaHTMLAttributes", description: "Extra props forwarded to the underlying textarea (value, onChange, onKeyDown, disabled and placeholder are controlled by the component)." },
];

export default function InputMessageDoc() {
  const [basicValue, setBasicValue] = useState("");
  const [actionsValue, setActionsValue] = useState("");
  const [leftValue, setLeftValue] = useState("");
  const [rightValue, setRightValue] = useState("");
  const [handlerValue, setHandlerValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // State for the "With Left and Right Actions" demo: attached files,
  // model-picker open state, and the currently-selected model.
  const [files, setFiles] = useState<File[]>([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [model, setModel] = useState<Model>("Sonnet 5");
  const [attachOpen, setAttachOpen] = useState(false);
  const modelRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node))
        setModelOpen(false);
      if (attachRef.current && !attachRef.current.contains(e.target as Node))
        setAttachOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const PlusIcon = useIcon("plus");
  const ChevronDownIcon = useIcon("chevron-down");
  const ImageIcon = useIcon("image");
  const FileTextIcon = useIcon("square-library");

  return (
    <DocPage
      title="InputMessage"
      slug="input-message"
      description="Chat-style message composer with an auto-resizing textarea, flexible left/right action slots, and a built-in send button on a Surface-2 substrate."
    >
      <DocSection title="Example">
        <ComponentPreview code={actionsCode} minHeightClass="min-h-[280px]">
          <div className="w-full max-w-xl">
            <InputMessage
              value={actionsValue}
              onValueChange={setActionsValue}
              files={files}
              onFilesChange={setFiles}
              onSend={() => {
                setActionsValue("");
                setFiles([]);
              }}
              leftSlot={({ openFilePicker }) => (
                <div ref={attachRef} className="relative">
                  <Tooltip content="Add" side="top">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Attach files"
                      active={attachOpen}
                      onClick={() => setAttachOpen((o) => !o)}
                    >
                      <PlusIcon />
                    </Button>
                  </Tooltip>
                  <AnimatePresence>
                    {attachOpen && (
                      <motion.div
                        className="absolute bottom-full mb-2 left-0 z-10"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4, transition: { duration: 0.1 } }}
                        transition={springs.fast}
                      >
                        <Dropdown>
                          <MenuItem
                            index={0}
                            label="Image"
                            icon={ImageIcon}
                            onSelect={() => {
                              setAttachOpen(false);
                              openFilePicker("image/png,image/jpeg");
                            }}
                          />
                          <MenuItem
                            index={1}
                            label="PDF"
                            icon={FileTextIcon}
                            onSelect={() => {
                              setAttachOpen(false);
                              openFilePicker("application/pdf");
                            }}
                          />
                        </Dropdown>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              rightSlot={
                <div ref={modelRef} className="relative">
                  <Tooltip content="Select model" side="top">
                    <Button
                      variant="ghost"
                      size="sm"
                      trailingIcon={ChevronDownIcon}
                      active={modelOpen}
                      onClick={() => setModelOpen((o) => !o)}
                    >
                      {model}
                    </Button>
                  </Tooltip>
                  <AnimatePresence>
                    {modelOpen && (
                      <motion.div
                        className="absolute bottom-full mb-2 right-0 z-10"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4, transition: { duration: 0.1 } }}
                        transition={springs.fast}
                      >
                        <Dropdown checkedIndex={MODELS.indexOf(model)}>
                          {MODELS.map((name, i) => (
                            <MenuItem
                              key={name}
                              index={i}
                              label={name}
                              checked={name === model}
                              onSelect={() => {
                                setModel(name);
                                setModelOpen(false);
                              }}
                            />
                          ))}
                        </Dropdown>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              }
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Basic">
        <ComponentPreview code={basicCode} minHeightClass="min-h-[280px]">
          <div className="w-full max-w-xl">
            <InputMessage
              value={basicValue}
              onValueChange={setBasicValue}
              onSend={() => setBasicValue("")}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Left Slot Only">
        <ComponentPreview code={leftOnlyCode} minHeightClass="min-h-[280px]">
          <div className="w-full max-w-xl">
            <InputMessage
              value={leftValue}
              onValueChange={setLeftValue}
              onSend={() => setLeftValue("")}
              leftSlot={
                <Button variant="ghost" size="icon-sm" aria-label="Attach">
                  <PlusIcon />
                </Button>
              }
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Right Slot Only">
        <ComponentPreview code={rightOnlyCode} minHeightClass="min-h-[280px]">
          <div className="w-full max-w-xl">
            <InputMessage
              value={rightValue}
              onValueChange={setRightValue}
              onSend={() => setRightValue("")}
              rightSlot={
                <Button variant="ghost" size="sm" trailingIcon={ChevronDownIcon}>
                  Sonnet 4.6
                </Button>
              }
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Send Handler">
        <ComponentPreview code={sendHandlerCode} minHeightClass="min-h-[280px]">
          <div className="w-full max-w-xl flex flex-col gap-3">
            <InputMessage
              value={handlerValue}
              onValueChange={setHandlerValue}
              onSend={(text) => {
                setMessages((prev) => [...prev, text]);
                setHandlerValue("");
              }}
              placeholder="Press Enter to send. Shift+Enter for newline."
            />
            {messages.length > 0 && (
              <ul className="flex flex-col gap-1 text-[13px] text-muted-foreground pl-1">
                {messages.map((m, i) => (
                  <li key={i} className="truncate">
                    <span className="text-foreground" style={{ fontVariationSettings: fontWeights.medium }}>
                      Sent:
                    </span>{" "}
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Disabled">
        <ComponentPreview code={disabledCode} minHeightClass="min-h-[280px]">
          <div className="w-full max-w-xl">
            <InputMessage
              value="This composer is disabled"
              onValueChange={() => {}}
              disabled
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={inputMessageProps} />
      </DocSection>
    </DocPage>
  );
}
