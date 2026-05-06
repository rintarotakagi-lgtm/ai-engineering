export interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (key: string, value: unknown) => void;
    get: (key: string) => unknown;
  };
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

export async function loadPyodideSingleton(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;

  pyodideLoading = (async () => {
    if (!document.querySelector('script[src*="pyodide"]')) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    const instance = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
    pyodideInstance = instance;
    return instance;
  })();

  return pyodideLoading;
}

export function isPyodideLoaded(): boolean {
  return pyodideInstance !== null;
}

export const PYTHON_WRAPPER = `
import sys
from io import StringIO
_orig_out = sys.stdout
_orig_err = sys.stderr
_io_out = StringIO()
_io_err = StringIO()
sys.stdout = _io_out
sys.stderr = _io_err
try:
    exec(_user_code, {})
except Exception as _e:
    sys.stderr.write(type(_e).__name__ + ": " + str(_e))
finally:
    sys.stdout = _orig_out
    sys.stderr = _orig_err
_out_val = _io_out.getvalue()
_err_val = _io_err.getvalue()
`;
