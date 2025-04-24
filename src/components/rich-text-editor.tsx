"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  Strikethrough,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Link as LinkIcon,
  Quote,
  List,
  ListOrdered,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  Highlighter,
  Subscript,
  Superscript as SuperscriptIcon,
  Minus,
  Undo,
  Redo,
  EraserIcon,
  StickerIcon,
} from "lucide-react";
import Link from "@tiptap/extension-link";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import "./rich-text-editor.css";
import { Separator } from "./ui/separator";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface RichTextEditorProps {
  value?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  className?: string;
  maxLength?: number;
  reset?: boolean;
  disabled?: boolean;
}
//TODO: image, sticker
export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "",
  className,
  maxLength,
  reset = false,
  disabled = false,
}: RichTextEditorProps) {
  const [characterCount, setCharacterCount] = React.useState(0);
  const [shouldReset, setShouldReset] = React.useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Image,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Highlight,
      Link,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Superscript,
      SubScript,
      Placeholder.configure({ placeholder }),
      ...(maxLength
        ? [
            CharacterCount.configure({
              limit: maxLength,
            }),
          ]
        : []),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
      if (maxLength) {
        setCharacterCount(editor.storage.characterCount.characters());
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          "!min-h-32 block border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "prose prose-sm sm:prose-base max-w-full dark:prose-invert bg-background"
        ),
      },
    },
  });

  React.useEffect(() => {
    if (disabled) {
      editor?.setOptions({ editable: false });
    } else {
      editor?.setOptions({ editable: true });
    }
  }, [disabled, editor]);

  // Reset editor content when reset prop changes to true
  React.useEffect(() => {
    if (reset && editor) {
      editor.commands.clearContent();
      // Also reset the character count to 0
      if (maxLength) {
        setCharacterCount(0);
      }
      setShouldReset(false);
    }
  }, [reset, editor, maxLength]);

  // Update character count on mount
  React.useEffect(() => {
    if (editor && maxLength) {
      setCharacterCount(editor.storage.characterCount.characters());
    }
  }, [editor, maxLength]);

  if (!editor) {
    return null;
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center gap-2 mb-3">
          <ToggleGroup type="single" size="sm" variant="outline">
            <ToggleGroupItem
              value="undo"
              aria-label="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <Undo className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="redo"
              aria-label="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <Redo className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="clear"
              aria-label="Clear formatting"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              disabled={
                !editor.can().chain().focus().clearNodes().unsetAllMarks().run()
              }
              data-state="off"
            >
              <EraserIcon className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Separator orientation="vertical" className="h-6" />

          <ToggleGroup type="multiple" size="sm" variant="outline">
            <ToggleGroupItem
              value="bold"
              aria-label="Toggle bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              data-state={editor.isActive("bold") ? "on" : "off"}
            >
              <Bold className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="italic"
              aria-label="Toggle italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              data-state={editor.isActive("italic") ? "on" : "off"}
            >
              <Italic className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="underline"
              aria-label="Toggle underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              data-state={editor.isActive("underline") ? "on" : "off"}
            >
              <UnderlineIcon className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="strike"
              aria-label="Toggle strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              data-state={editor.isActive("strike") ? "on" : "off"}
            >
              <Strikethrough className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="code"
              aria-label="Toggle code"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              data-state={editor.isActive("code") ? "on" : "off"}
            >
              <Code className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="highlight"
              aria-label="Toggle highlight"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              disabled={!editor.can().chain().focus().toggleHighlight().run()}
              data-state={editor.isActive("highlight") ? "on" : "off"}
            >
              <Highlighter className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Separator orientation="vertical" className="h-6" />

          <ToggleGroup type="single" size="sm" variant="outline">
            {/* <Dialog>
              <DialogTrigger asChild>
                <ToggleGroupItem
                  value="link"
                  aria-label="Add link"
                  // onClick={() => {
                  //   const url = window.prompt("Enter URL");
                  //   if (url) {
                  //     editor
                  //       .chain()
                  //       .focus()
                  //       .setLink({
                  //         href: url,
                  //         target: "_blank",
                  //         rel: "noopener noreferrer",
                  //       })
                  //       .run();
                  //   }
                  // }}
                  disabled={
                    !editor
                      .can()
                      .chain()
                      .focus()
                      .setLink({ href: "https://example.com" })
                      .run()
                  }
                  data-state={editor.isActive("link") ? "on" : "off"}
                >
                  <LinkIcon className="size-4" />
                </ToggleGroupItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chèn hyperlink</DialogTitle>
                  <DialogDescription>
                    Nếu bạn không biết hyperlink là cái mẹ gì, thì tắt cái này
                    đi và nhập nguyên link vào cmt thôi là được!
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="text" className="text-right">
                      Text
                    </Label>
                    <Input id="text" className="col-span-3" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="url" className="text-right">
                      URL
                    </Label>
                    <Input id="url" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button>Xong</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}

            <LinkDialogButton editor={editor} />

            {/* <ToggleGroupItem
              value="link"
              aria-label="Add link"
              onClick={() => {
                const url = window.prompt("Enter URL");
                if (url) {
                  editor
                    .chain()
                    .focus()
                    .setLink({
                      href: url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })
                    .run();
                }
              }}
              disabled={
                !editor
                  .can()
                  .chain()
                  .focus()
                  .setLink({ href: "https://example.com" })
                  .run()
              }
              data-state={editor.isActive("link") ? "on" : "off"}
            >
              <LinkIcon className="size-4" />
            </ToggleGroupItem> */}

            <ToggleGroupItem
              value="unlink"
              aria-label="Add link"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
              }}
              disabled={!editor.can().chain().focus().unsetLink().run()}
            >
              <Unlink className="size-4" />
            </ToggleGroupItem>

            {/* <ToggleGroupItem
              value="img"
              aria-label="Add image"
              onClick={() => {
                const url = window.prompt("URL");

                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
            >
              <FileImageIcon className="size-4" />
            </ToggleGroupItem> */}
          </ToggleGroup>

          <Separator orientation="vertical" className="h-6" />

          <ToggleGroup type="single" size="sm" variant="outline">
            <ToggleGroupItem
              value="h1"
              aria-label="Heading 1"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              disabled={
                !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
              }
              data-state={
                editor.isActive("heading", { level: 1 }) ? "on" : "off"
              }
            >
              <Heading1 className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h2"
              aria-label="Heading 2"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              disabled={
                !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
              }
              data-state={
                editor.isActive("heading", { level: 2 }) ? "on" : "off"
              }
            >
              <Heading2 className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h3"
              aria-label="Heading 3"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              disabled={
                !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
              }
              data-state={
                editor.isActive("heading", { level: 3 }) ? "on" : "off"
              }
            >
              <Heading3 className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="h4"
              aria-label="Heading 4"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              disabled={
                !editor.can().chain().focus().toggleHeading({ level: 4 }).run()
              }
              data-state={
                editor.isActive("heading", { level: 4 }) ? "on" : "off"
              }
            >
              <Heading4 className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Separator orientation="vertical" className="h-6" />

          <ToggleGroup type="multiple" size="sm" variant="outline">
            <ToggleGroupItem
              value="blockquote"
              aria-label="Toggle blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              disabled={!editor.can().chain().focus().toggleBlockquote().run()}
              data-state={editor.isActive("blockquote") ? "on" : "off"}
            >
              <Quote className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bulletList"
              aria-label="Toggle bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={!editor.can().chain().focus().toggleBulletList().run()}
              data-state={editor.isActive("bulletList") ? "on" : "off"}
            >
              <List className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="orderedList"
              aria-label="Toggle ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={!editor.can().chain().focus().toggleOrderedList().run()}
              data-state={editor.isActive("orderedList") ? "on" : "off"}
            >
              <ListOrdered className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="horizontalRule"
              aria-label="Add horizontal rule"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              disabled={!editor.can().chain().focus().setHorizontalRule().run()}
              data-state="off"
            >
              <Minus className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="superscript"
              aria-label="Toggle superscript"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              disabled={!editor.can().chain().focus().toggleSuperscript().run()}
              data-state={editor.isActive("superscript") ? "on" : "off"}
            >
              <SuperscriptIcon className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="subscript"
              aria-label="Toggle subscript"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              disabled={!editor.can().chain().focus().toggleSubscript().run()}
              data-state={editor.isActive("subscript") ? "on" : "off"}
            >
              <Subscript className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Separator orientation="vertical" className="h-6" />

          <ToggleGroup type="single" size="sm" variant="outline">
            <ToggleGroupItem
              value="left"
              aria-label="Align left"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              disabled={
                !editor.can().chain().focus().setTextAlign("left").run()
              }
              data-state={editor.isActive({ textAlign: "left" }) ? "on" : "off"}
            >
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="center"
              aria-label="Align center"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              disabled={
                !editor.can().chain().focus().setTextAlign("center").run()
              }
              data-state={
                editor.isActive({ textAlign: "center" }) ? "on" : "off"
              }
            >
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="right"
              aria-label="Align right"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              disabled={
                !editor.can().chain().focus().setTextAlign("right").run()
              }
              data-state={
                editor.isActive({ textAlign: "right" }) ? "on" : "off"
              }
            >
              <AlignRight className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="justify"
              aria-label="Align justify"
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              disabled={
                !editor.can().chain().focus().setTextAlign("justify").run()
              }
              data-state={
                editor.isActive({ textAlign: "justify" }) ? "on" : "off"
              }
            >
              <AlignJustify className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <EditorContent editor={editor} />

      <div className="flex items-center justify-between mt-1.5">
        <StickerPicker editor={editor} />
        {/* character counter */}
        {!!maxLength && (
          <div className="text-xs text-muted-foreground text-right mt-1.5">
            {characterCount}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}

function LinkDialogButton({ editor }: { editor: any }) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [linkText, setLinkText] = React.useState("");

  const handleSetLink = () => {
    if (url) {
      editor.chain().focus();

      if (linkText) {
        editor
          .chain()
          .insertContent(linkText)
          .extendMarkRange("link")
          .setLink({
            href: url,
            target: "_blank",
            rel: "noopener noreferrer",
          })
          .run();
      } else {
        editor
          .chain()
          .extendMarkRange("link")
          .setLink({
            href: url,
            target: "_blank",
            rel: "noopener noreferrer",
          })
          .run();
      }
    }

    setOpen(false);
    setUrl("");
    setLinkText("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Gắn link"
          size="icon"
          className="size-8 bg-transparent"
          variant="outline"
        >
          <LinkIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chèn hyperlink</DialogTitle>
          <DialogDescription>
            Nếu bạn không biết hyperlink là cái mẹ gì, thì tắt cái này đi và để
            nguyên link vào cmt thôi là được!
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Text hiển thị (tuỳ chọn)"
          value={linkText}
          onChange={(e) => setLinkText(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleSetLink}>Xong</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StickerPicker({ editor }: { editor: any }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            aria-label="Add sticker"
            size="icon"
            className="size-8 bg-transparent"
            variant="outline"
          >
            <StickerIcon className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
          <div>mẹ mày</div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Add sticker"
          size="icon"
          className="size-8 bg-transparent"
          variant="outline"
        >
          <StickerIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="size-[350px] ml-4 md:ml-8 lg:ml-12">Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
