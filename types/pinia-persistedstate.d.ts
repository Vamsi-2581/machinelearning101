/**
 * Type declarations for pinia-plugin-persistedstate
 */

import 'pinia';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Persists store in localStorage/sessionStorage.
     * @see https://prazdevs.github.io/pinia-plugin-persistedstate/
     */
    persist?: {
      /**
       * Storage key to use.
       * @default $store.id
       */
      key?: string;
      /**
       * Storage to use.
       * @default localStorage
       */
      storage?: Storage;
      /**
       * Dot-notation paths to partially persist state.
       * @default undefined - persists all state
       */
      paths?: Array<string>;
      /**
       * Customer serializer to serialize persisted state.
       */
      serializer?: {
        serialize: (value: S) => string;
        deserialize: (value: string) => S;
      };
      /**
       * Hook called before state is hydrated from storage.
       * @default null
       */
      beforeRestore?: (context: { store: Store }) => void;
      /**
       * Hook called after state is hydrated from storage.
       * @default null
       */
      afterRestore?: (context: { store: Store }) => void;
    };
  }
}
