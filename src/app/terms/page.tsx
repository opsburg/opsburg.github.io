import LegalPage from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { COOKIE_POLICY_URL, GITHUB_URL, PRIVACY_POLICY_URL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of use",
  description: "The terms that apply to anyone who visits opsburg.dev and reads its content.",
  path: "/terms",
});

export default function TermsPage() {
  const mail = `mailto:${LEGAL.email}`;
  return (
    <LegalPage title="Terms of use" path="/terms">
      <p>
        These terms apply to your use of opsburg.dev (the &ldquo;site&rdquo;), run by {LEGAL.controller},{" "}
        {LEGAL.address} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site you accept them; if you do not, please
        do not use it.
      </p>

      <h2>1. What the site is</h2>
      <p>
        The site presents Opsburg, a platform that builds and ships apps and AI agents and turns running them into a
        game, and publishes articles about platform engineering and related topics. Opsburg is still being built:
        features, plans and timelines described on the site show where it is heading, may change or never ship, and
        are not an offer or a commitment.
      </p>
      <p>
        These terms cover the site only. Using the Opsburg software, whether you host it yourself or use a service
        we may offer later, will be governed by its own licence or terms, which prevail over these for that use.
      </p>

      <h2>2. Using the site</h2>
      <p>You may browse, read and share the site freely. You agree not to:</p>
      <ul>
        <li>use it in breach of the law or of anyone&apos;s rights;</li>
        <li>try to break into it, test its security without our written permission, or disrupt its operation;</li>
        <li>
          collect its content automatically at a rate or in a way that burdens it, or to build a service that
          competes with it by copying it;
        </li>
        <li>present yourself as Opsburg or suggest an affiliation with us that does not exist.</li>
      </ul>
      <p>
        Search engines and AI crawlers may index the site within the limits set in its <code>robots.txt</code>.
      </p>

      <h2>3. Intellectual property</h2>
      <p>
        The name and logo of Opsburg, the texts, illustrations, 3D scenes and the design of the site belong to us or
        to those who licensed them to us, and are protected by copyright and trademark law. Except as these terms
        allow, you may not copy, change or distribute them without our written consent.
      </p>
      <p>
        You may quote short extracts of the articles, with a link to the original. Code examples published in the
        articles may be used freely in your own projects. Source code published in the{" "}
        <a href={GITHUB_URL}>Opsburg organization on GitHub</a> is governed by the licence stated in each repository.
      </p>

      <h2>4. Content is for information</h2>
      <p>
        Articles and pages are general information, written with care but without any guarantee that they are
        complete, correct or up to date, and they are not professional advice. Try any command, configuration or
        code on a test environment before using it in production; doing so is your responsibility.
      </p>

      <h2>5. Links to other sites</h2>
      <p>
        The site links to websites we do not control, such as GitHub and the sources cited in articles. We are not
        responsible for their content, availability or privacy practices, and a link is not an endorsement.
      </p>

      <h2>6. Availability</h2>
      <p>
        We may change, suspend or close the site, or any part of it, at any time and without notice. We do not
        guarantee that it will always be available or free of errors.
      </p>

      <h2>7. Liability</h2>
      <p>
        The site is free and provided &ldquo;as is&rdquo;. To the extent the law allows, we are not liable for damage
        arising from using the site or relying on its content, or from its being unavailable. Nothing in these terms
        limits our liability for wilful misconduct or gross negligence, which Article 1229 of the Italian Civil Code
        does not allow to exclude, or any right you have as a consumer that cannot be waived by contract.
      </p>

      <h2>8. Privacy and cookies</h2>
      <p>
        How we handle personal data is described in the <a href={PRIVACY_POLICY_URL}>privacy policy</a>, and the
        cookies we use in the <a href={COOKIE_POLICY_URL}>cookie policy</a>.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these terms, for example when Opsburg becomes available. The version in force is the one
        published here, with the date at the top. Changes apply from that date and do not affect use that happened
        before.
      </p>

      <h2>10. Law and courts</h2>
      <p>
        These terms are governed by Italian law. Any dispute belongs to the courts of the place where we are
        established. If you are a consumer, the court of the place where you live has jurisdiction instead, and you
        keep the protection of the mandatory rules of the country where you live.
      </p>

      <h2>11. Contact</h2>
      <p>
        For questions about these terms, write to <a href={mail}>{LEGAL.email}</a>.
      </p>
    </LegalPage>
  );
}
