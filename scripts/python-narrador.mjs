import { existsSync } from 'node:fs';
import path from 'node:path';

/** Python com edge-tts: NARRADOR_PYTHON, ou o ambiente padrão de docs/NARRACAO.md. */
export function pythonDoNarrador() {
  if (process.env.NARRADOR_PYTHON) return process.env.NARRADOR_PYTHON;
  const local = process.env.LOCALAPPDATA;
  const venv = local && path.join(local, 'bau-edge-tts', 'Scripts', 'python.exe');
  return venv && existsSync(venv) ? venv : 'python3';
}
