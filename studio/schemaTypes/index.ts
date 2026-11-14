import { author } from "./author"
import { blockContent } from "./blockContent"
import { category } from "./category"
import { post } from "./post"

/**
 * The document and object types the Studio loads.
 *
 * There used to be no author type, on the reasoning that the project's own
 * Organization byline already existed in the site's linked data and a second
 * copy in the CMS would only be one more thing to keep in sync. That reasoning
 * held for search and fails for the answer engines: they weigh a named person
 * with checkable expertise well above a company name, and an Organization
 * cannot carry a biography or a credential. The author type is the exception,
 * and posts still fall back to the Organization when none is set.
 */
export const schemaTypes = [post, author, category, blockContent]
