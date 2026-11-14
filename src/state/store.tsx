import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import { decodeSave, initialSave, replenish, type Save } from "./model";
const KEY = "@katlapatla-balloons/save/v1";
type Store = {
  save: Save;
  ready: boolean;
  error: string | null;
  update: (fn: (s: Save) => Save) => Save;
  retry: () => void;
};
const Context = createContext<Store | null>(null);
export function SaveProvider({ children }: { children: React.ReactNode }) {
  const [save, setSave] = useState(() => initialSave(Date.now()));
  const current = useRef(save);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queue = useRef(Promise.resolve());
  const mounted = useRef(true);
  const persist = useCallback((s: Save) => {
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        await AsyncStorage.setItem(KEY, JSON.stringify(s));
        if (mounted.current) setError(null);
      })
      .catch(() => {
        if (mounted.current) setError("İlerleme kaydedilemedi. Tekrar dene.");
      });
  }, []);
  const update = useCallback(
    (fn: (s: Save) => Save) => {
      const next = fn(current.current);
      current.current = next;
      setSave(next);
      persist(next);
      return next;
    },
    [persist],
  );
  useEffect(() => {
    mounted.current = true;
    void AsyncStorage.getItem(KEY)
      .then((raw) => {
        const loaded = raw ? decodeSave(raw) : initialSave(Date.now());
        const s = replenish(loaded, Date.now());
        current.current = s;
        setSave(s);
        setReady(true);
      })
      .catch(() => {
        setError("Kayıt okunamadı. Verilerin korunuyor; yeniden dene.");
      });
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    const tick = () => {
      if (ready) {
        const s = replenish(current.current, Date.now());
        if (s !== current.current) update(() => s);
      }
    };
    const timer = ready && save.lives < 5 ? setInterval(tick, 1000) : null;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") tick();
    });
    return () => {
      if (timer) clearInterval(timer);
      subscription.remove();
    };
  }, [ready, update, save.lives]);
  const retry = useCallback(() => {
    if (ready) persist(current.current);
    else
      void AsyncStorage.getItem(KEY)
        .then((raw) => {
          const s = raw ? decodeSave(raw) : initialSave(Date.now());
          current.current = s;
          setSave(s);
          setError(null);
          setReady(true);
        })
        .catch(() => setError("Kayıt okunamadı. Yeniden dene."));
  }, [persist, ready]);
  return (
    <Context.Provider value={{ save, ready, error, update, retry }}>
      {children}
    </Context.Provider>
  );
}
export function useSave() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing SaveProvider");
  return value;
}
