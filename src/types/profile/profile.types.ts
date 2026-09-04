export type ProfileLinks = {
  github: string;
  linkedin: string;
  resume: string;
};

export type ProfileIdentity = {
  name: string;
  callsign: string;
  role: string;
  roleFramings: string[];
  location: string;
  email: string;
  phone: string;
  tagline: string;
  summary: string;
  narrative: string[];
  links: ProfileLinks;
};
