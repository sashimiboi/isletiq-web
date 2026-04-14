import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | IsletIQ",
  description: "How IsletIQ collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="mb-12">
        <div className="text-xs font-semibold text-[#0033a0] uppercase tracking-widest mb-3">
          Legal
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#94989e]">
          Effective: April 12, 2026 · Last updated: April 12, 2026
        </p>
      </header>

      <div className="space-y-8 text-[#666b78] leading-relaxed">
        <Section title="Summary">
          <p>
            IsletIQ helps people living with Type 1 Diabetes track glucose,
            insulin, meals, sleep, and vitals. Your health data is yours. We
            don&apos;t sell it, we don&apos;t use it for advertising, we
            don&apos;t train models on it, and we encrypt it in transit and at
            rest. This page explains exactly what we collect and how we use
            it.
          </p>
        </Section>

        <Section title="Data We Collect">
          <p>
            IsletIQ may collect the following categories of data, only when
            you explicitly grant permission or use a feature that requires
            it:
          </p>
          <ul>
            <li>
              <strong>Health & fitness data</strong>:glucose readings,
              insulin doses, carbohydrate and meal entries, sleep, heart
              rate, HRV, VO₂ Max, blood pressure, body temperature, blood
              oxygen, steps, and active calories. This data is read from and
              written to Apple HealthKit on your device.
            </li>
            <li>
              <strong>Account information</strong>:email address and an
              opaque user ID, used to authenticate you and sync your data
              across your devices.
            </li>
            <li>
              <strong>Voice and photo input</strong>:when you use Agentic
              Sync, microphone audio and photos you choose to submit are
              processed to extract meal information and respond to your
              questions.
            </li>
            <li>
              <strong>CGM and pump credentials</strong>:when you connect a
              third-party device (e.g., Dexcom, LibreLink), the credentials
              needed to fetch your readings are stored in the device
              Keychain.
            </li>
            <li>
              <strong>Diagnostic logs</strong>:anonymous, technical
              information needed to keep the service running (request
              timing, error reports). No health data is included in
              diagnostics.
            </li>
          </ul>
        </Section>

        <Section title="HealthKit Data">
          <p>
            IsletIQ&apos;s use of Apple HealthKit complies with Apple&apos;s
            HealthKit framework requirements:
          </p>
          <ul>
            <li>HealthKit data is never used for advertising or marketing.</li>
            <li>
              HealthKit data is never sold, shared with data brokers, or used
              for purposes other than providing the service.
            </li>
            <li>
              HealthKit data is never stored in iCloud or any unauthorized
              third-party cloud service.
            </li>
            <li>
              HealthKit data is encrypted in transit (TLS 1.3) when synced to
              our backend, and encrypted at rest within our infrastructure.
            </li>
            <li>
              You control which HealthKit data types IsletIQ can read or
              write at any time via the iOS Settings app under{" "}
              <em>Health → Data Access & Devices → IsletIQ</em>.
            </li>
          </ul>
        </Section>

        <Section title="How We Use Your Data">
          <p>We use your data only to provide and improve the service:</p>
          <ul>
            <li>Show you live glucose, insulin, meal, and vitals data.</li>
            <li>
              Generate personalized insights, alerts, and AI-assisted
              guidance.
            </li>
            <li>
              Sync data between your iPhone, Apple Watch, and any other
              devices linked to your account.
            </li>
            <li>Authenticate you and secure your account.</li>
            <li>
              Diagnose technical issues and improve performance and
              reliability.
            </li>
          </ul>
          <p>
            We do <strong>not</strong> use your data for advertising, profile
            sale, behavioral targeting, or model training.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>
            IsletIQ integrates with a small number of third parties, only
            with your permission, only for the features you use:
          </p>
          <ul>
            <li>
              <strong>Dexcom and Abbott LibreLink</strong>:to fetch your
              CGM readings if you connect a CGM. Your credentials are stored
              locally; we never see them.
            </li>
            <li>
              <strong>Apple HealthKit</strong>:to read and write health
              records on your device.
            </li>
            <li>
              <strong>Amazon Web Services (AWS)</strong>:secure
              U.S.-hosted infrastructure for syncing your account data.
            </li>
            <li>
              <strong>OpenAI / Anthropic / ElevenLabs</strong>:for Agentic
              Sync responses and voice synthesis. Voice and chat
              transcripts are sent only when you actively use the AI
              feature.
            </li>
          </ul>
        </Section>

        <Section title="Data Retention and Deletion">
          <p>
            You can delete your account and all associated data at any time
            from <em>Settings → Account → Delete Account</em> within the
            app, or by emailing us at{" "}
            <a
              href="mailto:hello@isletiq.com"
              className="text-[#0033a0] hover:underline"
            >
              hello@isletiq.com
            </a>
            . Deletion is permanent and propagates to all backend storage
            within 30 days.
          </p>
          <p>
            HealthKit data remains on your device under your control even
            after you delete your IsletIQ account. To remove HealthKit data,
            use the Apple Health app.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>
            Depending on where you live, you may have the right to access,
            correct, port, restrict, or delete your personal data, and to
            object to processing. We honor these rights for all users
            regardless of jurisdiction. To exercise any of these rights,
            email{" "}
            <a
              href="mailto:hello@isletiq.com"
              className="text-[#0033a0] hover:underline"
            >
              hello@isletiq.com
            </a>
            .
          </p>
        </Section>

        <Section title="Children">
          <p>
            IsletIQ is intended for users 13 years of age or older. We do
            not knowingly collect data from children under 13. If you
            believe a child has provided us with personal data, please
            contact us so we can delete it.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We use industry-standard practices to protect your data: TLS 1.3
            for all network traffic, AES-256 encryption at rest, hardened
            cloud infrastructure, principle of least privilege, and regular
            security review. No system is perfectly secure. If you discover
            a vulnerability, please report it to{" "}
            <a
              href="mailto:hello@isletiq.com"
              className="text-[#0033a0] hover:underline"
            >
              hello@isletiq.com
            </a>
            .
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this policy from time to time. When we do,
            we&apos;ll update the &quot;Last updated&quot; date above and,
            for material changes, notify you via the app or by email.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Email{" "}
            <a
              href="mailto:hello@isletiq.com"
              className="text-[#0033a0] hover:underline"
            >
              hello@isletiq.com
            </a>
            .
          </p>
        </Section>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#14171f] mb-3">{title}</h2>
      <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:marker:text-[#94989e] [&_strong]:text-[#14171f]">
        {children}
      </div>
    </section>
  );
}
