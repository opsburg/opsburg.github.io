import { defineField, defineType } from "sanity"

/**
 * The person who writes the posts.
 *
 * This type exists for one reason: an answer engine weighs a named human with
 * verifiable expertise more heavily than a corporate byline, and until now
 * every post was attributed to the Organization. The fields below are the ones
 * that end up in the Person node of a post's linked data — they are evidence,
 * not decoration, so leave one blank rather than filling it with something
 * that cannot be checked.
 */
export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      description: "As it should appear in the byline and in search results.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description:
        "Job title, e.g. \"Platform engineer, Opsburg\". Becomes jobTitle in the Person schema.",
    }),
    defineField({
      name: "bio",
      title: "Short biography",
      type: "text",
      rows: 3,
      description:
        "One or two sentences on why this person is credible on DevOps and SRE: what they have built, and for how long. This is the E-E-A-T signal — keep it concrete and true.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the person, e.g. \"Portrait of Jane Doe\".",
        }),
      ],
    }),
    defineField({
      name: "links",
      title: "Public profiles",
      type: "array",
      of: [{ type: "url" }],
      description:
        "GitHub, LinkedIn, X, a personal site. These become sameAs, which is how an engine confirms the byline and the accounts are one person. Only profiles that are actually public and actually theirs.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
})
