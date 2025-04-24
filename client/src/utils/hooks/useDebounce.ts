import { useRef, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

export function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  const debouncer = useRef(
    debounce((val: T) => {
      setDebounced(val);
    }, delay)
  ).current;

  useEffect(() => {
    debouncer(value);
  }, [value, debouncer]);

  return debounced;
}
