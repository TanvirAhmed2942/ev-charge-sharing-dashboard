/* Type declarations for TipTap extensions and custom commands */

declare module "@tiptap/extension-text-align" {
  import { Extension } from "@tiptap/core";
  export const TextAlign: Extension;
}

declare module "@tiptap/extension-color" {
  import { Extension } from "@tiptap/core";
  export const Color: Extension;
}

declare module "@tiptap/extension-text-style" {
  import { Extension } from "@tiptap/core";
  export const TextStyle: Extension;
}

declare module "@tiptap/extension-image" {
  import { Extension } from "@tiptap/core";
  export const Image: Extension;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    setFontSize: {
      setFontSize: (size: string) => ReturnType;
    };
    setColor: {
      setColor: (color: string) => ReturnType;
    };
    setImage: {
      setImage: (options: { src: string; alt?: string }) => ReturnType;
    };
    setTextAlign: {
      setTextAlign: (alignment: "left" | "center" | "right" | "justify") => ReturnType;
    };
  }
}
