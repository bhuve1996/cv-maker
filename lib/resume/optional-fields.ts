import type { OptionalFields } from "@/types/resume";

export const EMPTY_OPTIONAL_FIELDS: OptionalFields = {
  dateOfBirth: "",
  age: "",
  gender: "",
  currentCtc: "",
  expectedCtc: "",
  noticePeriod: "",
  maritalStatus: "",
  nationality: "",
  addressLine: "",
  certificationIds: "",
  cgpa: "",
  percentage10th: "",
  percentage12th: "",
  beCgpa: "",
};

export const OPTIONAL_FIELD_LABELS: Record<keyof OptionalFields, string> = {
  dateOfBirth: "Date of Birth",
  age: "Age",
  gender: "Gender",
  currentCtc: "Current CTC",
  expectedCtc: "Expected CTC",
  noticePeriod: "Notice Period",
  maritalStatus: "Marital Status",
  nationality: "Nationality",
  addressLine: "Address Line",
  certificationIds: "Certification IDs",
  cgpa: "CGPA",
  percentage10th: "10th Percentage",
  percentage12th: "12th Percentage",
  beCgpa: "B.E. CGPA",
};
