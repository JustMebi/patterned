export function ViewerShell() {
  return (
    <section className="viewer-shell">
      <h2>Viewer boundary</h2>
      <div className="viewer-shell-grid">
        <div className="viewer-placeholder">
          <div>
            <strong>3D viewport placeholder</strong>
            <p>
              Phase 2 and Phase 3 will replace this with the mannequin scene,
              camera presets, model loading, and garment/fabric preview layers.
            </p>
          </div>
        </div>

        <aside className="viewer-panel">
          <h2>Reserved integration slots</h2>
          <ul>
            <li>`/public/models/mannequin.glb` for the Blender export target</li>
            <li>measurement form and normalized morph controls</li>
            <li>garment selection and style controls</li>
            <li>fabric upload, repeat, and finish controls</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
