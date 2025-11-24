// Minimal React/JSX shims to silence editor errors in absence of @types/react.
declare module 'react' {
  export type ReactNode = any;
  export type ComponentProps<T = any> = any;
  type CreateContextReturn<T = any> = { Provider: any; Consumer: any; _currentValue?: T };
  export interface FC<P = {}> {
    (props: P & { children?: ReactNode }): any;
  }
  export interface FormEvent<T = any> {
    preventDefault(): void;
    target: T;
  }
  export function useState<S>(
    initial: S | (() => S)
  ): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useContext<T>(ctx: CreateContextReturn<T>): T;
  export function createContext<T>(init: T): CreateContextReturn<T>;
  export function useId(): string;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
