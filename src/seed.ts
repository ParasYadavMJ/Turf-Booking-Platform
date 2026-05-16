import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const INITIAL_TURFS = [
  {
    name: "Arena One",
    location: "Downtown Sports Complex",
    sports: ["Football", "Cricket"],
    description: "Premium synthetic turf with floodlights and changing rooms. One of the best facilities in the city for competitive matches and casual games alike.",
    pricePerHour: 1200,
    originalPrice: 1600,
    pitchArea: "8,000 sq ft",
    imageUrls: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1000"
    ],
    amenities: ["Floodlights", "Water", "Parking", "Showers", "Changing Rooms"],
    rating: 4.8
  },
  {
    name: "CricKingdom",
    location: "East Wing Park",
    sports: ["Cricket"],
    description: "International standard cricket nets and practice wickets. Features high-quality astro-turf suitable for both fast and spin bowling practice.",
    pricePerHour: 800,
    originalPrice: 1100,
    pitchArea: "4,500 sq ft",
    imageUrls: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1593341604934-29f471f2373b?auto=format&fit=crop&q=80&w=1000"
    ],
    amenities: ["Bowling Machine", "Floodlights", "Kit Rental", "Coaching"],
    rating: 4.5
  },
  {
    name: "Goal Hub",
    location: "North Side Metro",
    sports: ["Football"],
    description: "The fastest 5-a-side pitch in the city. Perfect for high-intensity games and training sessions. Known for its excellent drainage and grip.",
    pricePerHour: 1000,
    originalPrice: 1400,
    pitchArea: "6,000 sq ft",
    imageUrls: [
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=1000"
    ],
    amenities: ["Parking", "Cafe", "Water", "Bibs & Balls"],
    rating: 4.6
  },
  {
    name: "Grand Slam Courts",
    location: "West End Club",
    sports: ["Tennis"],
    description: "Two professional grade clay courts and two hard courts. Perfect for training and local tournaments. Racket restringing available on site.",
    pricePerHour: 1500,
    originalPrice: 2000,
    pitchArea: "14,400 sq ft",
    imageUrls: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1000",
      "https://plus.unsplash.com/premium_photo-1664303498906-8dce2f9011af?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1000"
    ],
    amenities: ["Floodlights", "Pro Shop", "Locker Rooms", "Umpire Chair"],
    rating: 4.9
  },
  {
    name: "Hoops HQ",
    location: "Central Square",
    sports: ["Basketball"],
    description: "Indoor hardwood basketball courts with FIBA certified hoops. Glass backboards and digital scoreboards for a pro-level experience.",
    pricePerHour: 1800,
    originalPrice: 2200,
    pitchArea: "5,000 sq ft",
    imageUrls: [
      "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1544919982-b61976f0ba43?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=1000"
    ],
    amenities: ["AC", "Spectator Seating", "Scoreboard", "Lockers"],
    rating: 4.8
  },
  {
    name: "Padel Palace",
    location: "South Tech Park",
    sports: ["Padel", "Tennis"],
    description: "Modern panoramic glass padel courts brought directly from Spain. The fastest growing sport in a premium facility with a vibrant lounge area.",
    pricePerHour: 2000,
    originalPrice: 2500,
    pitchArea: "4,000 sq ft",
    imageUrls: [
      "https://images.unsplash.com/photo-1678198759325-1e3c8ec557b7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1000"
    ],
    amenities: ["Racket Rental", "Cafe", "WiFi", "Pro Shop"],
    rating: 4.7
  },
  {
    name: "The Iron Turf",
    location: "Industrial District",
    sports: ["Football"],
    description: "Built for true enthusiasts. 7-a-side pitch covered to allow playing in any weather conditions. High ceiling ensures natural feeling gameplay.",
    pricePerHour: 1600,
    originalPrice: 2000,
    pitchArea: "10,000 sq ft",
    imageUrls: [
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1431324155629-1a6d0a11f472?auto=format&fit=crop&q=80&w=1000"
    ],
    amenities: ["Covered Pitch", "Vending Machines", "Parking"],
    rating: 4.4
  },
  {
    name: "Green Fields Net",
    location: "Suburban Complex",
    sports: ["Cricket"],
    description: "Premium automated 3-lane cricket net facility featuring variable speed bowling machines and performance tracking cameras.",
    pricePerHour: 1100,
    originalPrice: 1500,
    pitchArea: "3,000 sq ft",
    imageUrls: [
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1593341604934-29f471f2373b?auto=format&fit=crop&q=80&w=1000"
    ],
    amenities: ["Bowling Machine", "Video Tracking", "Waiting Lounge"],
    rating: 4.6
  }
];

export async function seedTurfs() {
  const turfsCol = collection(db, 'turfs');
  const snapshot = await getDocs(turfsCol);
  
  const existingNames = snapshot.docs.map(doc => doc.data().name);

  let newTuresAdded = 0;
  for (const turf of INITIAL_TURFS) {
    if (!existingNames.includes(turf.name)) {
      await addDoc(turfsCol, turf);
      newTuresAdded++;
    }
  }
  
  if (newTuresAdded > 0) {
    console.log(`Seeding complete. Added ${newTuresAdded} new turfs.`);
  } else {
    console.log("Turfs already seeded.");
  }
}
