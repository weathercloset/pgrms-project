import { useCallback, useEffect, useMemo } from 'react';

const ModifierBitMasks = {
  alt: 1,
  ctrl: 2,
  meta: 4,
  shift: 8,
};

const ShiftKeys = {
  '~': '`',
  '!': '1',
  '@': '2',
  '#': '3',
  $: '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  _: '-',
  '+': '=',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
};

const Aliases = {
  win: 'meta',
  window: 'meta',
  cmd: 'meta',
  command: 'meta',
  esc: 'escape',
  opt: 'alt',
  option: 'alt',
};

const getKeyCombo = (e) => {
  const key = e.key !== ' ' ? e.key.toLowerCase() : 'space';

  let modifiers = 0;
  if (e.altKey) modifiers += ModifierBitMasks.alt;
  if (e.ctrlKey) modifiers += ModifierBitMasks.ctrl;
  if (e.metaKey) modifiers += ModifierBitMasks.meta;
  if (e.shiftKey) modifiers += ModifierBitMasks.shift;

  return { modifiers, key };
};

const parseKeyCombo = (combo) => {
  const pieces = combo.replace(/\s/g, '').toLowerCase().split('+');
  let modifiers = 0;
  let key;
  pieces.forEach((piece) => {
    if (ModifierBitMasks[piece]) {
      modifiers += ModifierBitMasks[piece];
    } else if (ShiftKeys[piece]) {
      modifiers += ModifierBitMasks.shift;
      key = ShiftKeys[piece];
    } else if (Aliases[piece]) {
      key = Aliases[piece];
    } else {
      key = piece;
    }
  });

  return { modifiers, key };
};

const comboMatches = (a, b) => {
  return a.modifiers === b.modifiers && a.key === b.key;
};

const useHotKey = (hotkeys) => {
  const localKeys = useMemo(() => hotkeys.filter((k) => !k.global), [hotkeys]);
  const globalKeys = useMemo(() => hotkeys.filter((k) => k.global), [hotkeys]);

  const invokeCallback = useCallback(
    (global, combo, callbackName, e) => {
      const keys = global ? globalKeys : localKeys;
      keys.forEach((hotkey) => {
        if (comboMatches(parseKeyCombo(hotkey.combo), combo))
          if (hotkey[callbackName]) hotkey[callbackName](e);
      });
    },
    [localKeys, globalKeys],
  );

  const handleGlobalKeyDown = useCallback(
    (e) => {
      invokeCallback(true, getKeyCombo(e), 'onKeyDown', e);
    },
    [invokeCallback],
  );

  const handleGlobalKeyUp = useCallback(
    (e) => {
      invokeCallback(true, getKeyCombo(e), 'onKeyUp', e);
    },
    [invokeCallback],
  );

  const handleLocalKeyDown = useCallback(
    (e) => {
      invokeCallback(false, getKeyCombo(e.nativeEvent), 'onKeyDown', e.nativeEvent);
    },
    [invokeCallback],
  );

  const handleLocalKeyUp = useCallback(
    (e) => {
      invokeCallback(false, getKeyCombo(e.nativeEvent), 'onKeyUp', e.nativeEvent);
    },
    [invokeCallback],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('keyup', handleGlobalKeyUp);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [handleGlobalKeyDown, handleGlobalKeyUp]);

  return { handleKeyDown: handleLocalKeyDown, handleKeyUp: handleLocalKeyUp };
};

export default useHotKey;
