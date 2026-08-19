// Server-side authoritative course and service prices dictionary
// NEVER trust payment amounts sent directly by the client browser.

const COURSE_PRICES = {
  // Course ID or Title matches
  'c1': 8500,
  'c2': 6500,
  'c3': 7000,
  'c4': 7500,
  'c5': 5000,
  'c6': 6000,

  // Course Title Exact / Partial Match fallbacks
  'full stack web development bootcamp': 8500,
  'full-stack web development bootcamp': 8500,
  'professional graphics design & ui/ux': 6500,
  'professional graphics design & ui/ux masterclass': 6500,
  'digital marketing & seo masterclass': 7000,
  'python & django web development': 7500,
  'c & c++ programming foundational course': 5000,
  'c & c++ programming foundational': 5000,
  'wordpress theme & plugin development': 6000,

  // Default fallback for general IT training course if unmatched
  'default_course_fee': 8500
};

/**
 * Resolves the authoritative BDT price for a course on the server side
 */
function resolveCoursePrice(courseId, courseTitle, fallbackAmount) {
  if (courseId && COURSE_PRICES[courseId]) {
    return COURSE_PRICES[courseId];
  }

  if (courseTitle) {
    const normalized = String(courseTitle).toLowerCase().trim();
    for (const key in COURSE_PRICES) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return COURSE_PRICES[key];
      }
    }
  }

  // If fallback numeric amount provided and valid, parse safely
  if (fallbackAmount) {
    const cleaned = String(fallbackAmount).replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return COURSE_PRICES['default_course_fee'];
}

module.exports = {
  COURSE_PRICES,
  resolveCoursePrice
};
