import { StyleSheet } from "@react-pdf/renderer";

/** ATS-safe typography — Helvetica only (built-in, universally parseable) */
export const PDF_FONT_FAMILY = "Helvetica";

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10,
    lineHeight: 1.38,
    color: "#0f172a",
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 28,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 10,
    marginBottom: 2,
  },
  headerIdentity: {
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontFamily: PDF_FONT_FAMILY,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 4,
  },
  specialization: {
    fontSize: 10,
    color: "#64748b",
    lineHeight: 1.4,
  },
  contactRow: {
    marginTop: 8,
  },
  contactItem: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.4,
  },
  section: {
    marginTop: 9,
  },
  sectionCompact: {
    marginTop: 7,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  sectionRule: {
    height: 1,
    backgroundColor: "#cbd5e1",
    marginBottom: 6,
  },
  body: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.42,
  },
  muted: {
    color: "#475569",
  },
  subtle: {
    color: "#64748b",
    fontSize: 9.5,
  },
  faint: {
    color: "#94a3b8",
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  rowMain: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 2,
  },
  companyItem: {
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  companyItemLast: {
    paddingBottom: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  projectsList: {
    marginTop: 5,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#e2e8f0",
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bulletDot: {
    width: 9,
    fontSize: 10,
    color: "#334155",
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.42,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
    gap: 8,
  },
  skillCategory: {
    width: 132,
    fontSize: 9.5,
    fontWeight: 600,
    color: "#475569",
    lineHeight: 1.35,
  },
  skillItems: {
    flex: 1,
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.35,
  },
  optionalRow: {
    marginBottom: 3,
  },
  compactBlock: {
    marginBottom: 4,
  },
});
