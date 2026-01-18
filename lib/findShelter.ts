import { shelters } from "./shelters";
import { haversineDistance } from "./geo";

export function findClosestShelter(
  userLat: number,
  userLon: number
) {
  let closest = shelters[0];
  let minDistance = Infinity;

  for (const shelter of shelters) {
    const distance = haversineDistance(
      userLat,
      userLon,
      shelter.lat,
      shelter.lon
    );

    if (distance < minDistance) {
      minDistance = distance;
      closest = shelter;
    }
  }

  return closest;
}
