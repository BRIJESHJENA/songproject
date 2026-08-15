import type { StaticImageData } from "next/image";

import arijitBg from "../assets/images/arijit.png";
import mikaBg from "../assets/images/mika.png";
import atifBg from "../assets/images/atif.png";
import jubinBg from "../assets/images/jubin.png";
import kkBg from "../assets/images/kk.png";
import mohitBg from "../assets/images/mohit.png";
import paponBg from "../assets/images/popon.png";
import shreyaBg from "../assets/images/shreya.png";

export type Artist = {
  id: string;
  name: string;
  nameHi: string;
  background: StaticImageData | string;
  accent: string;
};

export type Track = {
  id: string;
  title: string;
  artistId: string;
  year: number;
  youtubeId: string;
  album?: string;
};

export const artists: Artist[] = [
  {
    id: "kk",
    name: "KK",
    nameHi: "केके",
    background: kkBg,
    accent: "#c45c26",
  },
  {
    id: "mika",
    name: "Mika Singh",
    nameHi: "मिका",
    background: mikaBg,
    accent: "#e8a317",
  },
  {
    id: "arijit",
    name: "Arijit Singh",
    nameHi: "अरिजीत",
    background: arijitBg,
    accent: "#5b8a72",
  },
  {
    id: "jubin",
    name: "Jubin Nautiyal",
    nameHi: "जुबिन",
    background: jubinBg,
    accent: "#6b4c7a",
  },
  {
    id: "papon",
    name: "Papon",
    nameHi: "पापोन",
    background: paponBg,
    accent: "#8b5a2b",
  },
  {
    id: "atif",
    name: "Atif Aslam",
    nameHi: "आतिफ़",
    background: atifBg,
    accent: "#2f6f8f",
  },
  {
    id: "mohit",
    name: "Mohit Chauhan",
    nameHi: "मोहित",
    background: mohitBg,
    accent: "#a67c52",
  },
  {
    id: "shreya",
    name: "Shreya Ghoshal",
    nameHi: "श्रेया",
    background: shreyaBg,
    accent: "#b85c38",
  },
];

export const tracks: Track[] = [
  // KK
  {
    id: "kk-zara-sa",
    title: "Zara Sa",
    artistId: "kk",
    year: 2008,
    youtubeId: "5IY4BNj0-10",
    album: "Jannat",
  },
  {
    id: "kk-labon-ko",
    title: "Labon Ko",
    artistId: "kk",
    year: 2007,
    youtubeId: "-FP2Cmc7zj4",
    album: "Bhool Bhulaiyaa",
  },
  {
    id: "kk-dil-ibaadat",
    title: "Dil Ibaadat",
    artistId: "kk",
    year: 2009,
    youtubeId: "fKIJhHUW-G0",
    album: "Tum Mile",
  },
  {
    id: "kk-tujhe-sochta",
    title: "Tujhe Sochta Hoon",
    artistId: "kk",
    year: 2012,
    youtubeId: "ZNbE-PfI6jk",
    album: "Jannat 2",
  },

  // Mika
  {
    id: "mika-mauja",
    title: "Mauja Hi Mauja",
    artistId: "mika",
    year: 2007,
    youtubeId: "aPHsp9X2mBE",
    album: "Jab We Met",
  },
  {
    id: "mika-dhinka",
    title: "Dhinka Chika",
    artistId: "mika",
    year: 2011,
    youtubeId: "p6D8u6lEDjQ",
    album: "Ready",
  },

  // Arijit
  {
    id: "arijit-tum-hi-ho",
    title: "Tum Hi Ho",
    artistId: "arijit",
    year: 2013,
    youtubeId: "Umqb9KENgmk",
    album: "Aashiqui 2",
  },
  {
    id: "arijit-gerua",
    title: "Gerua",
    artistId: "arijit",
    year: 2015,
    youtubeId: "AEIVhBS6baE",
    album: "Dilwale",
  },
  {
    id: "arijit-channa",
    title: "Channa Mereya",
    artistId: "arijit",
    year: 2016,
    youtubeId: "284Ov7ysmfA",
    album: "Ae Dil Hai Mushkil",
  },

  // Jubin
  {
    id: "jubin-humnava",
    title: "Humnava Mere",
    artistId: "jubin",
    year: 2018,
    youtubeId: "TmRgK-pXH9c",
  },
  {
    id: "jubin-tum-hi-aana",
    title: "Tum Hi Aana",
    artistId: "jubin",
    year: 2019,
    youtubeId: "tLqtnGLfm4Q",
    album: "Marjaavaan",
  },

  // Papon
  {
    id: "papon-jiyein",
    title: "Jiyein Kyun",
    artistId: "papon",
    year: 2011,
    youtubeId: "szdRoROQy_c",
    album: "Dum Maaro Dum",
  },

  // Atif
  {
    id: "atif-tera-hone",
    title: "Tera Hone Laga Hoon",
    artistId: "atif",
    year: 2009,
    youtubeId: "rTuxUAuJRyY",
    album: "Ajab Prem Ki Ghazab Kahani",
  },
  {
    id: "atif-jeene",
    title: "Jeene Laga Hoon",
    artistId: "atif",
    year: 2013,
    youtubeId: "VhRwuWp4MQ8",
    album: "Ramaiya Vastavaiya",
  },

  // Mohit
  {
    id: "mohit-tum-se-hi",
    title: "Tum Se Hi",
    artistId: "mohit",
    year: 2007,
    youtubeId: "mt9xg0mmt28",
    album: "Jab We Met",
  },
  {
    id: "mohit-pee-loon",
    title: "Pee Loon",
    artistId: "mohit",
    year: 2010,
    youtubeId: "D8XFTglfSMg",
    album: "Once Upon a Time in Mumbaai",
  },
  {
    id: "mohit-kun-faya",
    title: "Kun Faya Kun",
    artistId: "mohit",
    year: 2011,
    youtubeId: "T94PHkuydcw",
    album: "Rockstar",
  },

  // Shreya
  {
    id: "shreya-teri-ore",
    title: "Teri Ore",
    artistId: "shreya",
    year: 2008,
    youtubeId: "GLEx6bhPu7s",
    album: "Singh Is Kinng",
  },
  {
    id: "shreya-saans",
    title: "Saans",
    artistId: "shreya",
    year: 2012,
    youtubeId: "VAt6TO2gdko",
    album: "Jab Tak Hai Jaan",
  },
  {
    id: "shreya-jeene",
    title: "Jeene Laga Hoon",
    artistId: "shreya",
    year: 2013,
    youtubeId: "9TP0qIJUyhM",
    album: "Ramaiya Vastavaiya",
  },
];

export function getArtist(artistId: string): Artist | undefined {
  return artists.find((a) => a.id === artistId);
}

export function getTracksByArtist(artistId: string): Track[] {
  return tracks.filter((t) => t.artistId === artistId);
}

export function getFirstTrackIndexForArtist(artistId: string): number {
  const index = tracks.findIndex((t) => t.artistId === artistId);
  return index === -1 ? 0 : index;
}

export function youtubeThumb(
  youtubeId: string,
  quality: "hq" | "mq" | "sd" | "maxres" = "hq"
) {
  return `https://i.ytimg.com/vi/${youtubeId}/${quality}default.jpg`;
}
