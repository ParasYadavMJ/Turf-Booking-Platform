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
  }
];

export async function seedTurfs() {
  const turfsCol = collection(db, 'turfs');
  const snapshot = await getDocs(turfsCol);
  
  if (snapshot.empty) {
    console.log("Seeding turfs...");
    for (const turf of INITIAL_TURFS) {
      await addDoc(turfsCol, turf);
    }
    console.log("Seeding complete.");
  } else {
    console.log("Turfs already seeded.");
  }
}
