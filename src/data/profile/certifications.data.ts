export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  credentialUrl: string;
  image: string;
  hours?: number;
};

export const certifications: Certification[] = [
  {
    id: "fcc-frontend",
    title: "Front-End Development Libraries",
    issuer: "freeCodeCamp",
    date: "August 21, 2026",
    category: "Frontend",
    credentialUrl: "https://freecodecamp.org/certification/kumar-nallana/front-end-development-libraries-v9",
    image: "/credentials/freecodecamp-front-end-development-libraries-v2.jpg",
    hours: 300,
  },
  {
    id: "gfg-react",
    title: "React JS Development - Self Paced",
    issuer: "GeeksforGeeks",
    date: "Verified",
    category: "React",
    credentialUrl: "https://media.geeksforgeeks.org/courses/certificates/7c806680e300ce139f1810cb2256373a.pdf",
    image: "/credentials/geeksforgeeks-react-js.jpg",
  },
  {
    id: "fcc-javascript",
    title: "JavaScript",
    issuer: "freeCodeCamp",
    date: "March 18, 2026",
    category: "JavaScript",
    credentialUrl: "https://freecodecamp.org/certification/kumar-nallana/javascript-v9",
    image: "/credentials/freecodecamp-javascript-v2.jpg",
    hours: 300,
  },
  {
    id: "gfg-javascript",
    title: "JavaScript Programming - Self Paced",
    issuer: "GeeksforGeeks",
    date: "Verified",
    category: "JavaScript",
    credentialUrl: "https://media.geeksforgeeks.org/courses/certificates/1800d8cd9330b810dc78992458bde160.pdf",
    image: "/credentials/geeksforgeeks-javascript.jpg",
  },
  {
    id: "fcc-responsive",
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    date: "February 7, 2026",
    category: "Frontend",
    credentialUrl: "https://www.freecodecamp.org/certification/kumar-nallana/responsive-web-design-v9",
    image: "/credentials/freecodecamp-responsive-web-design-v2.jpg",
    hours: 300,
  },
];

export const internshipCredential = {
  company: "Zylxy Technology Pvt. Ltd.",
  role: "Web Developer Intern",
  image: "/credentials/zylxy-internship-certificate.jpg",
};
