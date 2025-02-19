import { useContext, useEffect } from 'react';
import { isServerSide } from '../utils';
import { DispatcherContext, SCRIPT } from '../dispatcher';

export interface ScriptOptions {
  src?: string;
  id?: string;
  text?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
  module?: boolean;
  crossorigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
}

export const useScript = (options: ScriptOptions) => {
  const dispatcher = useContext(DispatcherContext);

  if (isServerSide) {
    dispatcher._addToQueue(SCRIPT, options as any);
  }

  useEffect(() => {
    const preExistingElements = options.id
      ? document.querySelectorAll(`script[id="${options.id}"]`)
      : document.querySelectorAll(`script[src="${options.src}"]`);

    let script: HTMLScriptElement;

    if (preExistingElements[0]) {
      script = preExistingElements[0] as HTMLScriptElement;
    } else {
      script = document.createElement('script');
    }

    if (options.type) script.type = options.type;
    if (options.module) script.type = 'module';

    if (options.integrity)
      script.setAttribute('integrity', options.integrity as string);
    if (options.crossorigin)
      script.setAttribute('crossorigin', options.crossorigin as string);
    if (options.defer) script.setAttribute('defer', 'true');
    else if (options.async) script.setAttribute('async', 'true');

    if (options.id) script.id = options.id;

    if (options.src) script.src = options.src;

    if (options.text) script.text = options.text;

    if (!preExistingElements[0]) {
      document.head.appendChild(script);
    }

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);
};
