import { StyleSheet } from "@react-pdf/renderer";

/** ATS-safe typography — Helvetica only (built-in, universally parseable) */
export const PDF_FONT_FAMILY = "Helvetica";

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10.5,
    lineHeight: 1.45,
    color: "#0f172a",
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 32,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 12,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontFamily: PDF_FONT_FAMILY,
    fontWeight: 700,
    color: "#0f172a",
  },
  title: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: 500,
    color: "#334155",
  },
  specialization: {
    marginTop: 2,
    fontSize: 10.5,
    color: "#64748b",
  },
  contact: {
    marginTop: 8,
    fontSize: 10.5,
    color: "#475569",
    lineHeight: 1.5,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 3,
  },
  sectionRule: {
    height: 1,
    backgroundColor: "#cbd5e1",
    marginBottom: 8,
  },
  body: {
    fontSize: 10.5,
    color: "#334155",
    lineHeight: 1.5,
  },
  muted: {
    color: "#475569",
  },
  subtle: {
    color: "#64748b",
    fontSize: 10,
  },
  faint: {
    color: "#94a3b8",
    fontSize: 9.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  rowMain: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#0f172a",
  },
  companyItem: {
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  companyItemLast: {
    paddingBottom: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  projectsList: {
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#e2e8f0",
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    width: 10,
    fontSize: 10.5,
    color: "#334155",
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    color: "#334155",
    lineHeight: 1.5,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 8,
  },
  skillCategory: {
    width: "38%",
    fontSize: 10,
    fontWeight: 600,
    color: "#475569",
  },
  skillItems: {
    flex: 1,
    fontSize: 10.5,
    color: "#334155",
  },
  optionalRow: {
    marginBottom: 4,
  },
});
