const seed = {
  nurses: [
    { id: "N01", name: "Asha Verma", ward: "ICU", certs: ["ICU"], seniorityYears: 11 },
    { id: "N02", name: "Rohit Nair", ward: "ICU", certs: ["ICU", "FLOAT"], seniorityYears: 4 },
    { id: "N03", name: "Meenal Joshi", ward: "icu ", certs: [], seniorityYears: 2 },
    { id: "N04", name: "Farhan Qureshi", ward: "GEN", certs: ["FLOAT"], seniorityYears: 9 },
    { id: "N04", name: "Farhan Qureshi", ward: "GEN", certs: ["FLOAT"], seniorityYears: "9" },
    { id: "N05", name: "Kavya Iyer", ward: "GEN", certs: [], seniorityYears: 1 },
    { id: "N06", name: "Deepak Rawat", ward: "ER", certs: ["ICU"], seniorityYears: 6 },
    { id: "N07", name: "Sunita Das", ward: "ER", certs: ["FLOAT", "ICU"], seniorityYears: 13 },
    { id: "N08", name: "Imran Sheikh", ward: "Gen", certs: [], seniorityYears: 3 }
  ],
  shifts: [
    { id: "S01", nurseId: "N01", ward: "ICU", date: "2026-10-05", start: "08:00", end: "16:00" },
    { id: "S02", nurseId: "N02", ward: "ICU", date: "2026-10-05", start: "20:00", end: "08:00" },
    { id: "S03", nurseId: "N01", ward: "ICU", date: "2026-10-06", start: "20:00", end: "08:00" },
    { id: "S04", nurseId: "N03", ward: "ICU", date: "06/10/2026", start: "08:00", end: "16:00" },
    { id: "S05", nurseId: "N04", ward: "GEN", date: "2026-10-05", start: "22:00", end: "06:00" },
    { id: "S06", nurseId: "N05", ward: "GEN", date: "2026-10-06", start: "08:00", end: "14:00" },
    { id: "S07", nurseId: "N04", ward: "GEN", date: "2026-10-07", start: "14:00", end: "22:00" },
    { id: "S08", nurseId: "N06", ward: "ER", date: "2026-10-05", start: "20:00", end: "04:00" },
    { id: "S09", nurseId: "N07", ward: "ER", date: "2026-10-06", start: "20:00", end: "04:00" },
    { id: "S10", nurseId: "N08", ward: "GEN", date: "2026-10-07", start: "06:00", end: "14:00" },
    { id: "S11", nurseId: "N05", ward: "GEN", date: "2026-10-07", start: "22:00", end: "06:00" },
    { id: "S12", nurseId: "N02", ward: "ICU", date: "2026-10-07", start: "20:00", end: "08:00" },
    { id: "S12", nurseId: "N06", ward: "ER", date: "2026-10-08", start: "08:00", end: "16:00" },
    { id: "S13", nurseId: "N09", ward: "GEN", date: "2026-10-08", start: "08:00", end: "16:00" },
    { id: "S14", nurseId: "N08", ward: "GEN", date: "2026-10-08", start: "14:00", end: "14:00" },
    { id: "S15", nurseId: "N01", ward: "ICU", date: "2026-10-08", start: "20:00", end: "08:00" },
    { id: "S16", nurseId: "N02", ward: "ICU", date: "2026-10-09", start: "20:00", end: "08:00" },
    { id: "S17", nurseId: "N06", ward: "ER", date: "2026-10-09", start: "01:00", end: "09:00" }
  ]
};

export default seed;
