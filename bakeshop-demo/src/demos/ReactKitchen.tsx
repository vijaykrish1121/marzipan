import { useCallback, useMemo, useRef, useState } from 'react';

import { MarzipanCanvas, type ThemeOption } from '../components/MarzipanCanvas';

const reactMarkdown = [
  '# React Wrapper',
  '',
  'This demo mounts Marzipan inside a React component using refs and controlled state.',
  '',
  '- Boots the instance inside useEffect',
  '- Mirrors value via `useState`',
  '- Logs editor activity for debugging',
  '',
  'Enjoy hacking!'
].join('\n');

interface ReactKitchenProps {
  theme: ThemeOption;
  accent: string;
}

export function ReactKitchen({ theme, accent }: ReactKitchenProps) {
  const [controlledValue, setControlledValue] = useState(reactMarkdown);
  const [logs, setLogs] = useState<string[]>([]);
  const edits = useRef(0);

  const toolbarPreset = useMemo(
    () => ({
      buttons: [
        { name: 'bold', icon: '<strong>B</strong>', title: 'Bold', action: 'toggleBold' },
        { name: 'italic', icon: '<em>i</em>', title: 'Italic', action: 'toggleItalic' },
        { separator: true },
        { name: 'code', icon: '<code>{ }</code>', title: 'Code', action: 'toggleCode' },
        { name: 'link', icon: '🔗', title: 'Link', action: 'insertLink' }
      ]
    }),
    []
  );

  const handleReady = useCallback(() => {
    edits.current += 1;
    setLogs((prev) => [`Editor ready #${edits.current}`, ...prev].slice(0, 6));
  }, []);

  const handleChange = useCallback((value: string) => {
    setControlledValue(value);
    setLogs((prev) => [`Change (${value.length} chars)`, ...prev].slice(0, 6));
  }, []);

  return (
    <section className="bakeshop-panel">
      <div>
        <h2>React Kitchen</h2>
        <p>
          A controlled wrapper you can lift into your own app. Remove the log section when wiring up production code.
        </p>
      </div>

      <div className="demo-grid two-col">
        <div className="demo-card">
          <h4>Controlled Editor</h4>
          <div className="demo-preview">
            <MarzipanCanvas
              id="react-wrapper"
              value={controlledValue}
              defaultValue={reactMarkdown}
              theme={theme}
              accent={accent}
              toolbar={toolbarPreset}
              onReady={handleReady}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="demo-card">
          <h4>Event Log</h4>
          <p>Latest log entries from the controlled instance.</p>
          <div className="code-block" style={{ maxHeight: '220px', overflow: 'auto' }}>
            {logs.length === 0 ? 'Interact with the editor to generate logs.' : logs.join('\n')}
          </div>
          <button type="button" className="bakeshop-action" onClick={() => setLogs([])}>
            Clear Log
          </button>
        </div>
      </div>
    </section>
  );
}

export default ReactKitchen;
