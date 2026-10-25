import { tierEntitlements } from "@patterned/entitlements";
import { defaultFabricDefinition } from "@patterned/fabric-catalogue";
import { defaultGarmentDefinition } from "@patterned/garment-schema";
import {
  defaultBodyMeasurementsCm,
  mannequinControlMeasurementKeys,
} from "@patterned/measurement-engine";
import { ViewerShell } from "../src/components/viewer-shell";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Phase 1 Foundation</p>
          <h1>Patterned workspace scaffold</h1>
          <p className="lede">
            This shell locks the domain contracts and prepares the web app for
            mannequin, garment, and fabric integration.
          </p>
        </div>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Measurement contract</h2>
          <p>
            The mannequin source of truth is structured body data, not scene
            state.
          </p>
          <ul>
            {mannequinControlMeasurementKeys.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
          <pre>{JSON.stringify(defaultBodyMeasurementsCm, null, 2)}</pre>
        </article>

        <article className="card">
          <h2>Garment contract</h2>
          <p>First garment target is a basic fitted bodice plus straight skirt.</p>
          <pre>{JSON.stringify(defaultGarmentDefinition, null, 2)}</pre>
        </article>

        <article className="card">
          <h2>Fabric contract</h2>
          <p>
            The first fabric system is visual-first and intentionally separate
            from physical simulation.
          </p>
          <pre>{JSON.stringify(defaultFabricDefinition, null, 2)}</pre>
        </article>

        <article className="card">
          <h2>Tier baseline</h2>
          <pre>{JSON.stringify(tierEntitlements.hobbyist, null, 2)}</pre>
        </article>
      </section>

      <ViewerShell />
    </main>
  );
}
